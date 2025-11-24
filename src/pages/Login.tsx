import React from "react";
import { Github, Mail, Lock } from "lucide-react";

const LoginPage: React.FC = () => {
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
          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition">
            <Mail className="h-4 w-4" />
            Continue with Google
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition">
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
        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs text-neutral-400">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm text-neutral-100 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
          />
        </div>

        {/* Password */}
        <div className="w-full max-w-sm mt-4 space-y-2">
          <label className="text-xs text-neutral-400">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm text-neutral-100 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 outline-none pr-10"
            />
            <Lock className="h-4 w-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button className="w-full max-w-sm mt-6 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium transition">
          Sign In
        </button>

        {/* Footer links */}
        <a href="#" className="text-neutral-300 hover:text-white text-xs mt-6 max-w-sm block hover:underline">
          Create your UR-DEV account
        </a>
        <a href="#" className="text-neutral-300 hover:text-white text-xs mt-3 max-w-sm block hover:underline">
          Resend confirmation email
        </a>
        <a href="#" className="text-neutral-300 hover:text-white text-xs mt-3 max-w-sm block hover:underline">
          Reset your password
        </a>

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
