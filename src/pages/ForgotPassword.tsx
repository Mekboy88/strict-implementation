import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Reset email sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Please check your email and try again.",
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
            <h1 className="text-5xl font-bold mb-4" style={{ color: "#D6E4F0" }}>UR-DEV</h1>
            <p className="text-lg" style={{ color: "#8FA3B7" }}>Reset your password</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="w-1/2 flex items-center justify-center" style={{ background: "#05060A" }}>
        <div className="w-[360px]">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "#4CB3FF20" }}>
                <svg className="w-8 h-8" style={{ color: "#4CB3FF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: "#D6E4F0" }}>
                Check your email
              </h2>
              <p className="text-sm mb-6" style={{ color: "#8FA3B7" }}>
                We've sent a password reset link to {email}
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-[44px] rounded-[10px] font-medium text-white"
                style={{ background: "#4CB3FF" }}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-2" style={{ color: "#D6E4F0" }}>
                  Forgot password?
                </h2>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>
                  Enter your email to receive a reset link.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[44px] rounded-[10px] font-medium text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(76,179,255,0.85)]"
                  style={{ background: "#4CB3FF" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#8FA3B7" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4CB3FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3B7")}
                >
                  Back to sign in
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
