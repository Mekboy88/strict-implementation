/**
 * High-Quality Component Examples
 * Pre-built examples demonstrating professional code quality
 */

export const componentExamples = {
  cards: {
    productCard: `
<div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
  {/* Image Container */}
  <div className="relative aspect-square overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" 
      alt="Premium Watch"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
      -20%
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
  
  {/* Content */}
  <div className="p-6 space-y-3">
    <div className="flex items-start justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Watch</h3>
      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
        <HeartIcon className="w-5 h-5" />
      </button>
    </div>
    
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      Elegant timepiece with Swiss movement and sapphire crystal
    </p>
    
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">(128 reviews)</span>
    </div>
    
    <div className="flex items-center justify-between pt-2">
      <div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">$399</span>
        <span className="text-sm text-gray-500 line-through ml-2">$499</span>
      </div>
      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300">
        Add to Cart
      </button>
    </div>
  </div>
</div>`,

    statsCard: `
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-2xl">
  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
  <div className="relative space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-white/80">Total Revenue</p>
      <div className="p-2 bg-white/20 rounded-lg">
        <DollarSignIcon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-3xl font-bold">$45,231</p>
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1 text-green-200">
        <ArrowUpIcon className="w-4 h-4" />
        +20.1%
      </span>
      <span className="text-white/60">from last month</span>
    </div>
  </div>
</div>`,

    userCard: `
<div className="group relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-xl transition-all duration-500 hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]">
  <div className="flex items-start gap-4">
    <div className="relative">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" 
        alt="User Avatar"
        className="w-16 h-16 rounded-full ring-4 ring-white/20"
      />
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white" />
    </div>
    
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Sarah Johnson</h3>
        <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm text-gray-300">Senior Product Designer</p>
      
      <div className="flex items-center gap-4 pt-2">
        <div className="text-center">
          <p className="text-lg font-bold text-white">124</p>
          <p className="text-xs text-gray-400">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">2.4k</p>
          <p className="text-xs text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">890</p>
          <p className="text-xs text-gray-400">Following</p>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
        Follow
      </button>
    </div>
  </div>
</div>`
  },

  forms: {
    loginForm: `
<div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl space-y-6">
  <div className="text-center space-y-2">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      Welcome Back
    </h2>
    <p className="text-gray-600 dark:text-gray-400">Sign in to continue to your account</p>
  </div>
  
  <form className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input 
        type="email"
        placeholder="you@example.com"
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      />
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
          Forgot?
        </a>
      </div>
      <div className="relative">
        <input 
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <EyeIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <button 
      type="submit"
      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
    >
      Sign In
    </button>
  </form>
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300 dark:border-gray-700" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <button className="px-4 py-3 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
      <img src="/google-icon.svg" className="w-5 h-5" />
      Google
    </button>
    <button className="px-4 py-3 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
      <img src="/github-icon.svg" className="w-5 h-5" />
      GitHub
    </button>
  </div>
  
  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
    Don't have an account? 
    <a href="#" className="ml-1 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
      Sign up
    </a>
  </p>
</div>`
  },

  navigation: {
    sidebar: `
<aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 h-full flex flex-col">
  {/* Logo */}
  <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg" />
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Brand
      </span>
    </div>
  </div>
  
  {/* Navigation */}
  <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium transition-all duration-200">
      <HomeIcon className="w-5 h-5" />
      Dashboard
    </a>
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
      <UsersIcon className="w-5 h-5" />
      Users
    </a>
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
      <FolderIcon className="w-5 h-5" />
      Projects
    </a>
    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
      <SettingsIcon className="w-5 h-5" />
      Settings
    </a>
  </nav>
  
  {/* User Profile */}
  <div className="p-4 border-t border-gray-200 dark:border-gray-800">
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=current-user" 
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">John Doe</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">john@example.com</p>
      </div>
      <ChevronUpIcon className="w-4 h-4 text-gray-400" />
    </div>
  </div>
</aside>`
  }
};
