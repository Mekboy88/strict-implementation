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
              <svg className="h-10 w-10 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9615 5.27473C15.1132 4.7437 14.8058 4.19021 14.2747 4.03849C13.7437 3.88677 13.1902 4.19426 13.0385 4.72529L9.03847 18.7253C8.88675 19.2563 9.19424 19.8098 9.72528 19.9615C10.2563 20.1133 10.8098 19.8058 10.9615 19.2747L14.9615 5.27473Z" fill="currentColor"></path>
                <path d="M5.7991 7.39879C6.13114 7.84012 6.04255 8.46705 5.60123 8.7991L2.40894 11.2009C1.87724 11.601 1.87723 12.399 2.40894 12.7991L5.60123 15.2009C6.04255 15.533 6.13114 16.1599 5.7991 16.6012C5.46705 17.0426 4.84012 17.1311 4.39879 16.7991L1.20651 14.3973C-0.388615 13.1971 -0.388621 10.8029 1.2065 9.60276L4.39879 7.20093C4.84012 6.86889 5.46705 6.95747 5.7991 7.39879Z" fill="currentColor"></path>
                <path d="M18.2009 16.6012C17.8689 16.1599 17.9575 15.533 18.3988 15.2009L21.5911 12.7991C22.1228 12.399 22.1228 11.601 21.5911 11.2009L18.3988 8.7991C17.9575 8.46705 17.8689 7.84012 18.2009 7.39879C18.533 6.95747 19.1599 6.86889 19.6012 7.20093L22.7935 9.60276C24.3886 10.8029 24.3886 13.1971 22.7935 14.3973L19.6012 16.7991C19.1599 17.1311 18.533 17.0426 18.2009 16.6012Z" fill="currentColor"></path>
              </svg>
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
              <svg className="h-10 w-10 mt-0.5" viewBox="13 15 15 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M23.013,27.6a2.505,2.505,0,0,0-.713-1.944c2.339-.26,4.794-1.148,4.794-5.181a4.051,4.051,0,0,0-1.079-2.818,3.772,3.772,0,0,0-.105-2.779s-.88-.282-2.884,1.077a9.939,9.939,0,0,0-5.258,0c-2.005-1.359-2.887-1.077-2.887-1.077a3.778,3.778,0,0,0-.1,2.779A4.057,4.057,0,0,0,13.7,20.47c0,4.023,2.451,4.924,4.783,5.189a2.248,2.248,0,0,0-.667,1.4,2.234,2.234,0,0,1-3.055-.873,2.209,2.209,0,0,0-1.609-1.082s-1.025-.013-.072.639a2.778,2.778,0,0,1,1.166,1.535s.616,2.043,3.537,1.408c0,.876.014,1.537.014,1.786a.606.606,0,0,1-.032.177a10.178,10.178,0,0,0,5.27,0A.606.606,0,0,1,23,30.476C23,30.132,23.013,29,23.013,27.6Z" fillRule="evenodd"></path>
              </svg>
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
