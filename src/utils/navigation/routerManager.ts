/**
 * Router Manager
 * 
 * Manages the application router configuration.
 * Automatically updates routing without breaking existing code.
 * 
 * @module utils/navigation/routerManager
 */

export interface Route {
  path: string;
  component: string;
  title?: string;
}

/**
 * Generates router.ts file content
 * 
 * @param {Route[]} routes - Array of route definitions
 * @returns {string} Complete router.ts file content
 */
export const generateRouter = (routes: Route[]): string => {
  const routeImports = routes
    .filter(route => route.component.startsWith('src/'))
    .map((route, index) => {
      const componentName = route.component.split('/').pop()?.replace('.tsx', '') || `Page${index}`;
      return `import ${componentName} from '@/${route.component.replace('src/', '').replace('.tsx', '')}';`;
    })
    .join('\n');

  const routeDefinitions = routes
    .map(route => {
      const componentName = route.component.split('/').pop()?.replace('.tsx', '') || 'Page';
      return `  {
    path: '${route.path}',
    component: ${componentName},
    title: '${route.title || componentName}'
  }`;
    })
    .join(',\n');

  return `/**
 * Router Configuration
 * 
 * Central routing configuration for the application.
 * Auto-generated and maintained by UR-DEV AI builder.
 */

${routeImports}

export const routes = [
${routeDefinitions}
];

export const getRoute = (path: string) => {
  return routes.find(route => route.path === path);
};

export const getAllPaths = (): string[] => {
  return routes.map(route => route.path);
};
`;
};

/**
 * Parses existing router to extract routes
 * 
 * @param {string} routerContent - Content of router.ts
 * @returns {Route[]} Array of route definitions
 */
export const parseRouter = (routerContent: string): Route[] => {
  const routes: Route[] = [];
  
  // Simple pattern matching for route definitions
  const routePattern = /path:\s*'([^']+)'[\s\S]*?component:\s*([a-zA-Z0-9]+)/g;
  let match;
  
  while ((match = routePattern.exec(routerContent)) !== null) {
    routes.push({
      path: match[1],
      component: match[2],
    });
  }
  
  return routes;
};

/**
 * Adds a new route without breaking existing routes
 * 
 * @param {string} existingRouter - Current router content
 * @param {Route} newRoute - New route to add
 * @returns {string} Updated router content
 */
export const addRouteToRouter = (
  existingRouter: string,
  newRoute: Route
): string => {
  const existingRoutes = parseRouter(existingRouter);
  
  // Check if route already exists
  const routeExists = existingRoutes.some(r => r.path === newRoute.path);
  if (routeExists) {
    console.log(`Route ${newRoute.path} already exists`);
    return existingRouter;
  }
  
  // Add new route
  existingRoutes.push(newRoute);
  
  return generateRouter(existingRoutes);
};
