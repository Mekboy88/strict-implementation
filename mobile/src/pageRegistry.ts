/**
 * Mobile Page Registry
 * 
 * Central registry of all mobile pages.
 * 100% separate from desktop page registry.
 */

export const mobilePages = {
  '/': 'mobile/public/index.html'
};

export const getPagePath = (route: string): string | null => {
  return mobilePages[route] || null;
};

export const getAllRoutes = (): string[] => {
  return Object.keys(mobilePages);
};
