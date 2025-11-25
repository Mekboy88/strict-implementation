import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login");
        toast({
          title: "Authentication Required",
          description: "Please login to your account first.",
          variant: "destructive",
        });
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["owner", "admin"])
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin area.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const adminAuth = sessionStorage.getItem("admin_authenticated");
      if (adminAuth === "true") {
        navigate("/admin");
      }
    };

    checkAccess();
  }, [navigate, toast]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting admin login...');
      
      // First authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Auth result:', { authData, authError });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Authentication failed");
      }

      console.log('Checking user role for:', authData.user.id);

      // Verify user has admin or owner role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .in('role', ['owner', 'admin'])
        .maybeSingle();

      console.log('Role check result:', { roleData, roleError });

      if (roleError) {
        console.error('Role error:', roleError);
        await supabase.auth.signOut();
        throw new Error(`Database error: ${roleError.message}`);
      }

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error("Access denied. You don't have admin privileges. Please contact support to be assigned an admin role.");
      }

      // Set admin session flag
      sessionStorage.setItem('admin_authenticated', 'true');

      toast({
        title: "Admin access granted",
        description: `Welcome, ${roleData.role === 'owner' ? 'Platform Owner' : 'Administrator'}`,
      });

      console.log('Navigating to admin dashboard...');
      navigate("/admin");
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Admin login failed",
        description: error.message || "Invalid credentials or insufficient permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Visual Area */}
      <div className="w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #4CB3FF, transparent)" }}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full animate-fade-in">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "#4CB3FF20", border: "2px solid #4CB3FF40" }}>
              <Shield className="w-12 h-12" style={{ color: "#4CB3FF" }} />
            </div>
            <h1 className="text-5xl font-bold mb-4" style={{ color: "#D6E4F0" }}>Admin Access</h1>
            <p className="text-lg" style={{ color: "#8FA3B7" }}>Secure authentication required</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Admin Login Form */}
      <div className="w-1/2 flex items-center justify-center" style={{ background: "#05060A" }}>
        <div className="w-[360px]">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="mb-6 text-[#8FA3B7] hover:text-[#D6E4F0]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#4CB3FF20" }}>
                <Shield className="w-5 h-5" style={{ color: "#4CB3FF" }} />
              </div>
              <h2 className="text-3xl font-semibold" style={{ color: "#D6E4F0" }}>
                Admin Login
              </h2>
            </div>
            <p className="text-sm" style={{ color: "#8FA3B7" }}>
              Enter your admin credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 rounded-[10px] border transition-all duration-200"
                style={{
                  background: "#0A0F17",
                  borderColor: "#ffffff25",
                  color: "#D6E4F0",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4CB3FF";
                  e.target.style.boxShadow = "0 0 0 2px rgba(76, 179, 255, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ffffff25";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 rounded-[10px] border transition-all duration-200"
                style={{
                  background: "#0A0F17",
                  borderColor: "#ffffff25",
                  color: "#D6E4F0",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4CB3FF";
                  e.target.style.boxShadow = "0 0 0 2px rgba(76, 179, 255, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ffffff25";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] rounded-[10px] font-medium text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(76,179,255,0.85)]"
              style={{ background: "#4CB3FF" }}
            >
              {loading ? "Authenticating..." : "Access Admin Dashboard"}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 rounded-lg" style={{ background: "#4CB3FF10", border: "1px solid #4CB3FF20" }}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 mt-0.5" style={{ color: "#4CB3FF" }} />
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "#4CB3FF" }}>
                  Enhanced Security Layer
                </p>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  This page provides an additional authentication layer to protect admin features. Only users with admin or owner privileges can access this area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
