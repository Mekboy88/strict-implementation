import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Visual Area */}
      <div
        className="w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #4CB3FF, transparent)" }}
          ></div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-1/2 flex items-center justify-center" style={{ background: "#05060A" }}>
        <div className="w-[360px]">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2" style={{ color: "#D6E4F0" }}>
              Sign in to UR-DEV
            </h2>
            <p className="text-sm" style={{ color: "#8FA3B7" }}>
              Enter your email to continue.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
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

            <div>
              <Input
                type="password"
                placeholder="Password"
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm transition-colors duration-200"
              style={{ color: "#8FA3B7" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4CB3FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3B7")}
            >
              <span className="underline">Forgot password?</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-sm transition-colors duration-200"
              style={{ color: "#8FA3B7" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4CB3FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3B7")}
            >
              Don't have an account? <span className="underline">Sign up</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm transition-colors duration-200"
              style={{ color: "#8FA3B7" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4CB3FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3B7")}
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
