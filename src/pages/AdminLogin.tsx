import React from "react";

const AdminLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center p-10">
      {/* TOP HEADER */}
      <div className="w-full text-center mb-12 mt-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-neutral-100 drop-shadow-xl">
          Leadership isn't power — it's responsibility.
        </h1>
        <p className="mt-3 text-2xl text-neutral-400 font-medium">
          Being an admin doesn't give you privileges — it gives you purpose.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-8 shadow-2xl border border-neutral-800">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide text-neutral-100">Admin Access</h1>

        <p className="text-neutral-400 text-center text-sm mb-8">Secure admin authentication required.</p>

        {/* EMAIL */}
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full mb-4 p-3 rounded-lg bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
        />

        {/* PASSWORD */}
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full mb-4 p-3 rounded-lg bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
        />

        {/* AUTH CODE */}
        <label className="block text-sm mb-1">Authenticator Code</label>
        <input
          type="text"
          placeholder="6‑digit code"
          className="w-full mb-6 p-3 rounded-lg bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
        />

        {/* HUMAN CHECK */}
        <div className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-neutral-500 rounded-sm"></div>
            <span className="text-neutral-300 text-sm">Verify you are human</span>
          </div>
          <span className="text-xs text-neutral-500">Cloudflare</span>
        </div>

        {/* BUTTON */}
        <button className="w-full p-3 bg-neutral-700 hover:bg-neutral-600 transition rounded-lg font-semibold">
          Sign In
        </button>

        <p className="text-neutral-500 text-xs text-center mt-4">
          Forgot your password? Contact your UR‑DEV administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
