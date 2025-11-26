import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify the requesting user is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: requestingUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !requestingUser) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if requesting user is admin
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    if (!roleData || !["owner", "admin"].includes(roleData.role)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, userId, role, banDuration, redirectUrl, reason, email: inviteEmail } = await req.json();

    // Actions that don't require userId validation
    if (action === "inviteUser") {
      if (!inviteEmail) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if email is blacklisted
      const { data: blacklisted } = await supabaseAdmin
        .from("deleted_user_blacklist")
        .select("email")
        .eq("email", inviteEmail)
        .maybeSingle();

      if (blacklisted) {
        return new Response(JSON.stringify({ 
          error: "This email is blacklisted and cannot be invited",
          code: "EMAIL_BLACKLISTED"
        }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create invite link
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(inviteEmail, {
        redirectTo: redirectUrl || `${Deno.env.get("SUPABASE_URL")}/auth/v1/callback`,
        data: { invited_by: requestingUser.id, assigned_role: role || "user" }
      });

      if (error) throw error;

      // Create user role entry for the invited user
      if (data?.user) {
        await supabaseAdmin.from("user_roles").upsert({
          user_id: data.user.id,
          role: role || "user"
        }, { onConflict: "user_id" });
      }

      console.log(`Invitation sent to ${inviteEmail} by admin ${requestingUser.email}`);

      return new Response(JSON.stringify({ 
        success: true, 
        email: inviteEmail,
        message: "Invitation sent successfully"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CRITICAL: Check if target user is owner - NEVER allow changes to owner
    const { data: targetUserRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    // Protection: Cannot modify owner role in any way
    if (targetUserRole?.role === "owner") {
      console.log("SECURITY: Attempted to modify platform owner role - BLOCKED");
      return new Response(JSON.stringify({ 
        error: "Cannot modify Platform Owner. This action has been logged.",
        code: "OWNER_PROTECTED"
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "updateRole": {
        // CRITICAL: Never allow assigning owner role
        if (role === "owner") {
          console.log("SECURITY: Attempted to assign owner role - BLOCKED");
          return new Response(JSON.stringify({ 
            error: "Owner role cannot be assigned. This action has been logged.",
            code: "OWNER_ASSIGN_BLOCKED"
          }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update user role
        const { error } = await supabaseAdmin
          .from("user_roles")
          .update({ role, updated_at: new Date().toISOString() })
          .eq("user_id", userId);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "suspend": {
        // Ban user for specified duration
        const banUntil = banDuration === "permanent" 
          ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString() // 100 years
          : new Date(Date.now() + parseInt(banDuration) * 24 * 60 * 60 * 1000).toISOString();

        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: banDuration === "permanent" ? "876000h" : `${parseInt(banDuration) * 24}h`
        });

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "unsuspend": {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: "none"
        });

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete": {
        // Get user data before deletion for blacklist
        
        // Get user data before deletion for blacklist
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError) {
          console.error("Error fetching user for deletion:", userError);
          throw userError;
        }

        const userEmail = userData?.user?.email;
        const userMetadata = userData?.user?.user_metadata;
        const fullName = userMetadata?.full_name || 
                        `${userMetadata?.first_name || ''} ${userMetadata?.last_name || ''}`.trim() || 
                        null;

        if (!userEmail) {
          throw new Error("Cannot delete user: email not found");
        }

        // Add to blacklist before deletion
        const { error: blacklistError } = await supabaseAdmin
          .from("deleted_user_blacklist")
          .insert({
            email: userEmail,
            original_user_id: userId,
            full_name: fullName,
            deletion_reason: reason || "No reason provided",
            deleted_by: requestingUser.id,
          });

        if (blacklistError) {
          console.error("Error adding to blacklist:", blacklistError);
          // Continue with deletion even if blacklist fails
        }

        console.log(`User ${userEmail} added to blacklist. Proceeding with deletion.`);

        // Delete user from auth (cascades to user_roles due to foreign key)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (deleteError) throw deleteError;

        // Also explicitly delete from user_roles to be safe
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);

        console.log(`User ${userEmail} successfully deleted and blacklisted.`);

        return new Response(JSON.stringify({ 
          success: true,
          blacklisted: !blacklistError,
          email: userEmail 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "resetPassword": {
        // Get user email first
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData?.user?.email) {
          throw new Error("Could not find user email");
        }

        // Generate password reset link
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email: userData.user.email,
          options: {
            redirectTo: redirectUrl || `${Deno.env.get("SUPABASE_URL")}/auth/v1/callback`,
          },
        });

        if (error) throw error;

        console.log(`Password reset email generated for user: ${userData.user.email}`);

        return new Response(JSON.stringify({ 
          success: true, 
          email: userData.user.email,
          message: "Password reset link generated"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "resendVerification": {
        // Get user email first
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData?.user?.email) {
          throw new Error("Could not find user email");
        }

        // Use invite to resend verification - this will send a new email
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(userData.user.email, {
          redirectTo: redirectUrl || `${Deno.env.get("SUPABASE_URL")}/auth/v1/callback`,
        });

        if (error) {
          // If user already exists, try to generate a magic link instead
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: "magiclink",
            email: userData.user.email,
          });
          
          if (linkError) throw linkError;
          
          console.log(`Magic link generated for verification: ${userData.user.email}`);
          
          return new Response(JSON.stringify({ 
            success: true, 
            email: userData.user.email,
            message: "Verification link generated"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log(`Verification email resent to: ${userData.user.email}`);

        return new Response(JSON.stringify({ 
          success: true, 
          email: userData.user.email,
          message: "Verification email resent"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "impersonate": {
        // Get user email first
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData?.user?.email) {
          throw new Error("Could not find user email");
        }

        // Generate magic link for impersonation
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: userData.user.email,
          options: {
            redirectTo: redirectUrl || "/",
          },
        });

        if (error) throw error;

        console.log(`SECURITY: Admin ${requestingUser.email} generated impersonation link for ${userData.user.email}`);

        // Log this security event
        await supabaseAdmin.from("activity_logs").insert({
          user_id: requestingUser.id,
          action: "admin_impersonate",
          entity_type: "user",
          entity_id: userId,
          metadata: { 
            target_email: userData.user.email,
            admin_email: requestingUser.email 
          }
        });

        return new Response(JSON.stringify({ 
          success: true, 
          email: userData.user.email,
          link: data.properties?.action_link,
          message: "Impersonation link generated"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "giveCredits": {
        const { amount, creditReason } = await req.json().catch(() => ({}));
        
        // Parse amount from the original request body
        const requestBody = await req.clone().json();
        const creditAmount = requestBody.amount;
        const creditDescription = requestBody.creditReason || "Admin credit grant";

        if (!creditAmount || creditAmount <= 0) {
          return new Response(JSON.stringify({ error: "Invalid credit amount" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get or create user credits record
        const { data: existingCredits } = await supabaseAdmin
          .from("user_credits")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingCredits) {
          // Update existing credits
          const { error: updateError } = await supabaseAdmin
            .from("user_credits")
            .update({
              balance: existingCredits.balance + creditAmount,
              total_earned: existingCredits.total_earned + creditAmount,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);

          if (updateError) throw updateError;
        } else {
          // Create new credits record
          const { error: insertError } = await supabaseAdmin
            .from("user_credits")
            .insert({
              user_id: userId,
              balance: creditAmount,
              total_earned: creditAmount,
              total_spent: 0
            });

          if (insertError) throw insertError;
        }

        // Record transaction
        const { error: transactionError } = await supabaseAdmin
          .from("credit_transactions")
          .insert({
            user_id: userId,
            amount: creditAmount,
            type: "admin_grant",
            description: creditDescription,
            granted_by: requestingUser.id
          });

        if (transactionError) {
          console.error("Error recording transaction:", transactionError);
        }

        // Get user email for notification
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
        const userEmail = userData?.user?.email;

        // Create in-app notification
        const { error: notificationError } = await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: userId,
            type: "credits",
            title: "Credits Received!",
            message: `You have received ${creditAmount} AI credits. ${creditDescription}`,
            action_url: "/account"
          });

        if (notificationError) {
          console.error("Error creating notification:", notificationError);
        }

        console.log(`Admin ${requestingUser.email} granted ${creditAmount} credits to user ${userId}`);

        return new Response(JSON.stringify({ 
          success: true, 
          credits: creditAmount,
          email: userEmail,
          message: `${creditAmount} credits granted successfully`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
