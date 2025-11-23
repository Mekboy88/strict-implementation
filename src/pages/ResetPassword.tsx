import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Something went wrong. Please try again.",
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
            <p className="text-lg" style={{ color: "#8FA3B7" }}>Set your new password</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="w-1/2 flex items-center justify-center" style={{ background: "#05060A" }}>
        <div className="w-[360px]">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2" style={{ color: "#D6E4F0" }}>
              Reset password
            </h2>
            <p className="text-sm" style={{ color: "#8FA3B7" }}>
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New password"
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

            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Updating..." : "Update Password"}
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
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
