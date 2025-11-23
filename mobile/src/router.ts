/**
 * Mobile Router Configuration
 * 
 * Central routing configuration for the mobile app.
 * 100% separate from desktop router.
 */

export const mobileRoutes = [
  {
    path: '/',
    title: 'Home'
  }
];

export const getRoute = (path: string) => {
  return mobileRoutes.find(route => route.path === path);
};

export const getAllPaths = (): string[] => {
  return mobileRoutes.map(route => route.path);
};
