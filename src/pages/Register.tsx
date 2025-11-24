import React from "react";
import { Github, Lock } from "lucide-react";

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
            <svg className="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M263.821537,7247.00386 L254.211298,7247.00386 C254.211298,7248.0033 254.211298,7250.00218 254.205172,7251.00161 L259.774046,7251.00161 C259.560644,7252.00105 258.804036,7253.40026 257.734984,7254.10487 C257.733963,7254.10387 257.732942,7254.11086 257.7309,7254.10986 C256.309581,7255.04834 254.43389,7255.26122 253.041161,7254.98137 C250.85813,7254.54762 249.130492,7252.96451 248.429023,7250.95364 C248.433107,7250.95064 248.43617,7250.92266 248.439233,7250.92066 C248.000176,7249.67336 248.000176,7248.0033 248.439233,7247.00386 L248.438212,7247.00386 C249.003881,7245.1669 250.783592,7243.49084 252.969687,7243.0321 C254.727956,7242.65931 256.71188,7243.06308 258.170978,7244.42831 C258.36498,7244.23842 260.856372,7241.80579 261.043226,7241.6079 C256.0584,7237.09344 248.076756,7238.68155 245.090149,7244.51127 L245.089128,7244.51127 C245.089128,7244.51127 245.090149,7244.51127 245.084023,7244.52226 L245.084023,7244.52226 C243.606545,7247.38565 243.667809,7250.75975 245.094233,7253.48622 C245.090149,7253.48921 245.087086,7253.49121 245.084023,7253.49421 C246.376687,7256.0028 248.729215,7257.92672 251.563684,7258.6593 C254.574796,7259.44886 258.406843,7258.90916 260.973794,7256.58747 C260.974815,7256.58847 260.975836,7256.58947 260.976857,7256.59047 C263.15172,7254.63157 264.505648,7251.29445 263.821537,7247.00386" transform="translate(-244.000000, -7239.000000)"/>
            </svg>
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
              <svg className="h-10 w-10 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C7.97056 12 12 7.97056 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
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
              <svg className="h-10 w-10 mt-0.5" viewBox="0 0 482.368 482.368" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M468.756,13.241C457.966,2.427,442.108-2.186,427.299,0.98c-47.696,10.211-137.739,37.375-204.92,104.542 c-20.236,20.234-38.564,41.292-54.703,62.394L14.908,181.96c-6.176,0.564-11.479,4.66-13.589,10.502 c-2.112,5.84-0.657,12.369,3.737,16.763l94.955,94.971c-2.815,19.461-0.626,35.921,6.145,49.003l-36.812,36.804 c-6.255,6.255-6.255,16.388,0,22.645c3.127,3.128,7.225,4.69,11.323,4.69c4.097,0,8.194-1.563,11.322-4.69l36.781-36.781 c9.211,4.793,20.001,7.459,32.635,7.459c4.786,0,9.869-0.493,15.077-1.204l95.547,95.557c3.05,3.057,7.147,4.692,11.323,4.692 c1.829,0,3.675-0.313,5.441-0.954c5.85-2.111,9.93-7.413,10.509-13.597l14.042-152.956c21.205-16.154,42.504-34.661,63.101-55.257 c67.181-67.173,94.345-157.217,104.557-204.929C484.206,39.606,479.624,24.118,468.756,13.241z M434.009,32.296 c0.907-0.196,1.845-0.29,2.767-0.29c3.52,0,6.835,1.369,9.336,3.864c3.16,3.182,4.504,7.717,3.566,12.119 c-2.362,11.001-5.677,24.427-10.274,39.329c-10.79-2.4-20.971-7.498-29.133-15.661c-8.133-8.14-13.214-18.312-15.606-29.079 C409.566,37.981,422.999,34.65,434.009,32.296z M51.844,210.727l91.593-8.421c-10.775,16.765-20,33.34-27.164,49.291 c-2.579,5.755-4.77,11.323-6.786,16.796L51.844,210.727z M154.008,350.625l35.999-35.99c0.016-0.024,0.03-0.048,0.046-0.07 l0.673-0.672c6.254-6.257,6.254-16.398,0-22.645c-6.255-6.255-16.388-6.255-22.645,0l-36.78,36.789 c-2.205-15.216,2.517-37.297,14.199-63.327c4.315-9.625,9.523-19.525,15.341-29.564c22.472-0.149,44.443,8.639,60.894,25.107 c16.529,16.521,25.335,38.61,25.131,61.136C207.052,344.456,174.165,353.518,154.008,350.625z M270.528,430.887l-58.049-58.057 c20.814-7.56,43.318-19.024,66.492-33.848L270.528,430.887z M353.801,236.96c-31.932,31.916-62.99,56.633-91.295,74.835 c-2.08-23.324-12.229-45.656-29.445-62.866c-17.155-17.155-39.393-27.296-62.632-29.415c19.501-30.361,44.897-61.661,74.594-91.35 c40.972-40.964,91.718-65.687,134.128-80.458c3.222,13.089,9.883,25.349,19.797,35.271c9.93,9.946,22.238,16.523,35.358,19.745 C419.544,145.149,394.819,195.948,353.801,236.96z"></path>
                <path d="M263.037,146.18c-9.727,9.72-15.091,22.645-15.091,36.391c-0.014,13.746,5.333,26.67,15.061,36.389 c9.727,9.729,22.659,15.091,36.405,15.091c13.762,0,26.678-5.363,36.39-15.083c9.727-9.719,15.091-22.643,15.091-36.397 c0-13.746-5.365-26.678-15.091-36.407C316.379,126.743,282.459,126.727,263.037,146.18z M324.479,207.646 c-13.386,13.402-36.733,13.394-50.151-0.008c-6.694-6.694-10.369-15.591-10.369-25.06c0-9.469,3.691-18.375,10.4-25.075 c6.692-6.702,15.591-10.393,25.067-10.393c9.477,0,18.359,3.683,25.052,10.376c6.71,6.708,10.4,15.615,10.4,25.084 C334.879,192.039,331.188,200.944,324.479,207.646z"></path>
              </svg>
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
