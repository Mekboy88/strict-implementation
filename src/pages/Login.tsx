import React, { useState, useEffect } from "react";
import { Github, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // REMOVED: Session check that was causing instant redirect

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to login with ${provider}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Left side – Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 md:px-32 py-20 bg-neutral-950 border-r border-neutral-800">
        <h1 className="text-3xl font-semibold mb-6">Welcome to UR-DEV</h1>
        <p className="text-neutral-400 text-sm mb-10 max-w-sm">
          Sign in to access your workspace, cloud projects and development tools.
        </p>

        {/* Buttons */}
        <div className="space-y-3 w-full max-w-sm">
          <button 
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M263.821537,7247.00386 L254.211298,7247.00386 C254.211298,7248.0033 254.211298,7250.00218 254.205172,7251.00161 L259.774046,7251.00161 C259.560644,7252.00105 258.804036,7253.40026 257.734984,7254.10487 C257.733963,7254.10387 257.732942,7254.11086 257.7309,7254.10986 C256.309581,7255.04834 254.43389,7255.26122 253.041161,7254.98137 C250.85813,7254.54762 249.130492,7252.96451 248.429023,7250.95364 C248.433107,7250.95064 248.43617,7250.92266 248.439233,7250.92066 C248.000176,7249.67336 248.000176,7248.0033 248.439233,7247.00386 L248.438212,7247.00386 C249.003881,7245.1669 250.783592,7243.49084 252.969687,7243.0321 C254.727956,7242.65931 256.71188,7243.06308 258.170978,7244.42831 C258.36498,7244.23842 260.856372,7241.80579 261.043226,7241.6079 C256.0584,7237.09344 248.076756,7238.68155 245.090149,7244.51127 L245.089128,7244.51127 C245.089128,7244.51127 245.090149,7244.51127 245.084023,7244.52226 L245.084023,7244.52226 C243.606545,7247.38565 243.667809,7250.75975 245.094233,7253.48622 C245.090149,7253.48921 245.087086,7253.49121 245.084023,7253.49421 C246.376687,7256.0028 248.729215,7257.92672 251.563684,7258.6593 C254.574796,7259.44886 258.406843,7258.90916 260.973794,7256.58747 C260.974815,7256.58847 260.975836,7256.58947 260.976857,7256.59047 C263.15172,7254.63157 264.505648,7251.29445 263.821537,7247.00386" transform="translate(-244.000000, -7239.000000)"/>
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={() => handleOAuthLogin("github")}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-4 my-8 w-full max-w-sm">
          <div className="flex-1 h-px bg-neutral-700" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-700" />
        </div>

        {/* Email */}
        <form onSubmit={handleEmailLogin} className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-neutral-400">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-900 border-neutral-700 text-neutral-100 focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-neutral-400">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-900 border-neutral-700 text-neutral-100 focus:ring-neutral-500 focus:border-neutral-500 pr-10"
              />
              <Lock className="h-4 w-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer links */}
        <Link to="/register" className="text-neutral-300 hover:text-white text-xs mt-6 max-w-sm block hover:underline">
          Create your UR-DEV account
        </Link>
        <Link to="/forgot-password" className="text-neutral-300 hover:text-white text-xs mt-3 max-w-sm block hover:underline">
          Reset your password
        </Link>

        <p className="text-neutral-500 text-xs mt-5 max-w-sm">
          By signing in, you agree to the{" "}
          <a href="#" className="text-neutral-300 hover:text-white hover:underline">
            UR-DEV Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-neutral-300 hover:text-white hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Right side */}
      <div className="hidden md:flex w-1/2 bg-neutral-800 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 opacity-40" />
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-semibold text-white drop-shadow-md mb-4">Build. Deploy. Scale.</h2>
          <p className="text-neutral-300 text-sm max-w-md mx-auto">
            UR-DEV is your all-in-one environment for creating apps, websites, integrations, and cloud-powered tools
            with clean and modern DX.
            {/* Typing code animation */}
            <div className="mt-6 font-mono text-[11px] text-neutral-300 whitespace-pre leading-4">
              <code className="typing-effect">{`const app = createURDEV();
app.deploy();
app.scale();
// Building without limits...
// Creating with pure freedom...
// UR-DEV: nothing you cannot build.`}</code>
            </div>
            <style>{`
              @keyframes typing {
                from { width: 0 }
                to { width: 100% }
              }
              @keyframes caret {
                50% { border-color: transparent }
              }
              .typing-effect {
                display: inline-block;
                width: 100%;
                overflow: hidden;
                border-right: 2px solid #9ca3af;
                white-space: pre;
                animation: typing 4s steps(40, end) infinite, caret .7s step-end infinite;
              }
            `}</style>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
