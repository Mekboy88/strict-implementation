import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Left side – Forgot Password Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-48 px-10 md:px-32 py-20 bg-neutral-950 border-r border-neutral-800">
        <h1 className="text-3xl font-semibold mb-6">Reset your password</h1>
        <p className="text-neutral-400 text-sm mb-10 max-w-sm">
          Enter your email to receive password reset instructions.
        </p>

        {/* Email */}
        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs text-neutral-400">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm text-neutral-100 focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
          />
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
          <span>Send reset link</span>
        </button>

        <Link to="/login" className="text-neutral-400 hover:text-neutral-200 text-xs mt-6 max-w-sm block hover:underline">
          Back to Sign In
        </Link>
      </div>

      {/* Right side – Promo */}
      <div className="hidden md:flex w-1/2 bg-neutral-800 items-start justify-center pt-32 px-20 relative text-left">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-white mb-2 leading-tight">We've got you</h2>
          <p className="text-neutral-300 text-lg mb-10">Reset securely. Continue building.</p>

          <ul className="space-y-8 text-neutral-200 text-base leading-relaxed">
            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                🔐
              </span>
              <div>
                <strong className="text-white">Secure recovery.</strong>
                <p className="text-neutral-400">Your account security always comes first.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                ⚡
              </span>
              <div>
                <strong className="text-white">Fast process.</strong>
                <p className="text-neutral-400">Get back into your workspace quickly.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-600">
                🛠️
              </span>
              <div>
                <strong className="text-white">Keep building.</strong>
                <p className="text-neutral-400">Reset password and continue creating instantly.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
