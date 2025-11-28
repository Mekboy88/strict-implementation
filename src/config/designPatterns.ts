/**
 * Modern UI Design Patterns
 * Reusable patterns for high-quality component generation
 */

export const designPatterns = {
  cards: {
    glassMorphism: {
      classes: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl',
      hover: 'hover:bg-white/20 hover:shadow-purple-500/25 hover:scale-[1.02]',
      transition: 'transition-all duration-500'
    },
    
    gradient: {
      classes: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl shadow-xl border border-purple-200/20',
      hover: 'hover:from-purple-500/30 hover:to-pink-500/30 hover:shadow-2xl',
      transition: 'transition-all duration-300'
    },
    
    elevated: {
      classes: 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700',
      hover: 'hover:shadow-2xl hover:-translate-y-1',
      transition: 'transition-all duration-300'
    },
    
    minimal: {
      classes: 'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800',
      hover: 'hover:border-purple-500 hover:shadow-lg',
      transition: 'transition-all duration-200'
    }
  },
  
  buttons: {
    primary: {
      classes: 'px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30',
      hover: 'hover:shadow-purple-500/50 hover:scale-105',
      active: 'active:scale-95',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
      transition: 'transition-all duration-300'
    },
    
    secondary: {
      classes: 'px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/10 backdrop-blur border border-gray-300 dark:border-gray-700 rounded-xl',
      hover: 'hover:bg-white/20 hover:border-purple-500',
      active: 'active:scale-95',
      transition: 'transition-all duration-200'
    },
    
    ghost: {
      classes: 'px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      active: 'active:scale-95',
      transition: 'transition-all duration-150'
    },
    
    icon: {
      classes: 'p-2 text-gray-600 dark:text-gray-400 rounded-lg',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600',
      active: 'active:scale-90',
      transition: 'transition-all duration-150'
    }
  },
  
  inputs: {
    standard: {
      classes: 'w-full px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl',
      focus: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
      error: 'border-red-500 focus:ring-red-500',
      transition: 'transition-all duration-200'
    },
    
    floating: {
      wrapper: 'relative',
      input: 'w-full px-4 pt-6 pb-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl peer',
      label: 'absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs'
    },
    
    search: {
      wrapper: 'relative',
      input: 'w-full pl-10 pr-4 py-3 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500',
      icon: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
    }
  },
  
  layouts: {
    dashboard: {
      container: 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
      sidebar: 'w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 h-full',
      main: 'ml-64 p-8',
      header: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 sticky top-0 z-10'
    },
    
    centered: {
      container: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800',
      card: 'w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl'
    },
    
    landing: {
      hero: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white',
      section: 'py-20 px-8',
      container: 'max-w-6xl mx-auto'
    }
  },
  
  navigation: {
    sidebar: {
      item: 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300',
      active: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      transition: 'transition-all duration-200'
    },
    
    tabs: {
      container: 'flex gap-2 border-b border-gray-200 dark:border-gray-800',
      tab: 'px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400',
      active: 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600',
      hover: 'hover:text-gray-900 dark:hover:text-gray-200',
      transition: 'transition-all duration-200'
    },
    
    breadcrumb: {
      container: 'flex items-center gap-2 text-sm',
      item: 'text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors',
      separator: 'text-gray-400',
      active: 'text-gray-900 dark:text-gray-100 font-medium'
    }
  },
  
  typography: {
    heading1: 'text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    heading2: 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white',
    heading3: 'text-2xl font-semibold text-gray-900 dark:text-white',
    body: 'text-base text-gray-700 dark:text-gray-300 leading-relaxed',
    caption: 'text-sm text-gray-600 dark:text-gray-400',
    label: 'text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide'
  },
  
  animations: {
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    
    hover: {
      lift: 'hover:-translate-y-1',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-2xl hover:shadow-purple-500/50'
    },
    
    stagger: (index: number) => ({
      style: `animation-delay: ${index * 100}ms`
    })
  },
  
  colors: {
    gradients: {
      purple: 'bg-gradient-to-r from-purple-600 to-pink-600',
      blue: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      green: 'bg-gradient-to-r from-green-600 to-emerald-600',
      sunset: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600',
      ocean: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500',
      dark: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
    },
    
    backgrounds: {
      light: 'bg-white dark:bg-gray-900',
      muted: 'bg-gray-50 dark:bg-gray-800',
      elevated: 'bg-gray-100 dark:bg-gray-800'
    }
  }
};

export const responsivePatterns = {
  grid: {
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    twoColumn: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    sidebar: 'grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6'
  },
  
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    stack: 'flex flex-col gap-4',
    responsive: 'flex flex-col md:flex-row items-start md:items-center gap-4'
  },
  
  spacing: {
    section: 'py-12 md:py-20',
    container: 'px-4 sm:px-6 lg:px-8',
    card: 'p-6 lg:p-8'
  }
};
