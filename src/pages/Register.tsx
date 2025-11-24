import React from "react";
import { Github, Mail, Lock } from "lucide-react";

const RegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Left side – Registration form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-48 px-10 md:px-32 py-20 bg-neutral-950 border-r border-neutral-800">
        <h1 className="text-3xl font-semibold mb-6">Get Started</h1>
        <p className="text-neutral-400 text-sm mb-10 max-w-sm">Create your UR-DEV account.</p>

        {/* Buttons */}
        <div className="space-y-3 w-full max-w-sm">
          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition">
            <Mail className="h-4 w-4" />
            Sign up with Google
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm border border-neutral-700 transition">
            <Github className="h-4 w-4" />
            Sign up with GitHub
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

        {/* Username */}
        <div className="w-full max-w-sm mt-4 space-y-2">
          <label className="text-xs text-neutral-400">Username</label>
          <input
            type="text"
            placeholder="Your username"
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

        {/* Confirm Password */}
        <div className="w-full max-w-sm mt-4 space-y-2">
          <label className="text-xs text-neutral-400">Password confirmation</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm text-neutral-100 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 outline-none pr-10"
            />
            <Lock className="h-4 w-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Cloudflare Placeholder */}
        <div className="w-full max-w-sm mt-6 border border-neutral-700 rounded-md p-4 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border border-neutral-500 rounded-sm" />
            <span className="text-sm text-neutral-300">Verify you are human</span>
          </div>
          <span className="text-xs text-neutral-500">CLOUDFLARE</span>
        </div>

        <button className="w-full max-w-sm mt-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition">
          <span>Sign Up</span>
        </button>

        <a href="#" className="text-neutral-400 hover:text-neutral-200 text-xs mt-6 max-w-sm block hover:underline">
          Have an account? Sign in.
        </a>

        <p className="text-neutral-500 text-xs mt-5 max-w-sm">
          By signing up, you agree to the
          <a href="#" className="text-neutral-300 hover:text-white hover:underline">
            {" "}
            UR-DEV Terms of Service{" "}
          </a>
          and
          <a href="#" className="text-neutral-300 hover:text-white hover:underline">
            {" "}
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Right side – Promo text */}
      <div className="hidden md:flex w-1/2 bg-neutral-800 items-start justify-center pt-32 px-20 relative text-left">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-white mb-2 leading-tight">Build apps at the speed of thought</h2>
          <p className="text-neutral-300 text-lg mb-10">Say it. See it. Ship it.</p>

          <ul className="space-y-8 text-neutral-200 text-base leading-relaxed">
            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                💻
              </span>
              <div>
                <strong className="text-white">Zero code. Zero stress.</strong>
                <p className="text-neutral-400">Let AI handle the boring parts — you just create.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                ⚙️
              </span>
              <div>
                <strong className="text-white">Remix & tweak.</strong>
                <p className="text-neutral-400">Don’t like something? Ask AI to rewrite, restyle, or rebuild.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                🔗
              </span>
              <div>
                <strong className="text-white">Bring your code.</strong>
                <p className="text-neutral-400">Already started on GitHub? Plug it in and keep going.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                🚀
              </span>
              <div>
                <strong className="text-white">Ship in seconds.</strong>
                <p className="text-neutral-400">Deploy with one click — no servers, no headaches.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
