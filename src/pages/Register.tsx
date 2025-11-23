import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Welcome to UR-DEV. You can now start building.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "GitHub sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Registration Form */}
      <div className="w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        <div className="relative z-10 flex items-center justify-center h-full animate-fade-in">
          <div className="w-[360px]">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-2" style={{ color: "#D6E4F0" }}>
                Create your UR-DEV account
              </h2>
              <p className="text-sm" style={{ color: "#8FA3B7" }}>
                Sign up using one of the methods below.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-4">
              <Button
                onClick={handleGitHubSignup}
                className="w-full h-[44px] rounded-[10px] font-medium text-white transition-all duration-200"
                style={{ background: "#1A1A1A" }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                </svg>
                Continue with GitHub
              </Button>

              <Button
                onClick={handleGoogleSignup}
                className="w-full h-[44px] rounded-[10px] font-medium transition-all duration-200"
                style={{ background: "#ffffff", color: "#000000" }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-[1px]" style={{ background: "#ffffff20" }}></div>
              <span className="px-4 text-sm" style={{ color: "#8FA3B7" }}>— or —</span>
              <div className="flex-1 h-[1px]" style={{ background: "#ffffff20" }}></div>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
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
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
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

              {/* Cloudflare Turnstile Placeholder */}
              <div 
                className="flex items-center gap-3 p-3 rounded-[10px] border"
                style={{
                  background: "#0A0F17",
                  borderColor: "#ffffff20",
                }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: "#10b981" }} />
                <span className="text-sm" style={{ color: "#8FA3B7" }}>
                  Cloudflare Verification
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[44px] rounded-[10px] font-medium text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(76,179,255,0.85)]"
                style={{ background: "#4CB3FF" }}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm transition-colors duration-200"
                style={{ color: "#8FA3B7" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4CB3FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3B7")}
              >
                Already have an account? <span className="underline">Sign in</span>
              </button>
            </div>

            {/* Privacy Text */}
            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: "#8FA3B760" }}>
                By creating an account you agree to UR-DEV's{" "}
                <a href="#" className="underline hover:text-[#4CB3FF]">Terms</a> and{" "}
                <a href="#" className="underline hover:text-[#4CB3FF]">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Text Area */}
      <div className="w-1/2 flex items-center justify-center relative" style={{ background: "#0A0F12" }}>
        {/* Soft blue glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #4CB3FF, transparent)" }}></div>
        </div>

        <div className="relative z-10 max-w-md text-center animate-fade-in">
          {/* Quote */}
          <h3 className="text-3xl font-semibold mb-4" style={{ color: "#D6E4F0" }}>
            "UR-DEV helps you build ideas faster than ever."
          </h3>

          {/* Subtext */}
          <p className="text-base mb-8" style={{ color: "#8FA3B7", lineHeight: "1.6" }}>
            With powerful AI tools, you can create apps, components, and complete systems effortlessly.
          </p>

          {/* Avatar + Name */}
          <div className="flex items-center justify-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#4CB3FF" }}
            >
              <span className="text-white font-semibold text-lg">AD</span>
            </div>
            <div className="text-left">
              <p className="font-medium" style={{ color: "#D6E4F0" }}>Alex Dimitri</p>
              <p className="text-sm" style={{ color: "#8FA3B7" }}>Product Architect at UR-DEV</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
