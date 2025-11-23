/**
 * Router Configuration
 * 
 * Central routing configuration for the application.
 * Auto-generated and maintained by UR-DEV AI builder.
 */

import Index from '@/pages/Index';

export const routes = [
  {
    path: '/',
    component: Index,
    title: 'Home'
  }
];

export const getRoute = (path: string) => {
  return routes.find(route => route.path === path);
};

export const getAllPaths = (): string[] => {
  return routes.map(route => route.path);
};
