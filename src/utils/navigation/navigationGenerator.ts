/**
 * Navigation Button Generator
 * 
 * Generates navigation buttons and links for pages.
 * 
 * @module utils/navigation/navigationGenerator
 */

export interface NavigationLink {
  path: string;
  label: string;
  icon?: string;
}

/**
 * Generates HTML navigation button
 * 
 * @param {NavigationLink} link - Navigation link configuration
 * @returns {string} HTML button code
 */
export const generateHTMLNavigationButton = (link: NavigationLink): string => {
  return `<button onclick="window.location.href='${link.path}'" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
  ${link.icon ? `${link.icon} ` : ''}${link.label}
</button>`;
};

/**
 * Generates React navigation button
 * 
 * @param {NavigationLink} link - Navigation link configuration
 * @returns {string} React Link component code
 */
export const generateReactNavigationButton = (link: NavigationLink): string => {
  return `<Link to="${link.path}" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
  ${link.icon ? `${link.icon} ` : ''}${link.label}
</Link>`;
};

/**
 * Generates navigation bar with all links
 * 
 * @param {NavigationLink[]} links - Array of navigation links
 * @param {string} format - 'html' or 'react'
 * @returns {string} Complete navigation bar code
 */
export const generateNavigationBar = (
  links: NavigationLink[],
  format: 'html' | 'react' = 'html'
): string => {
  const buttons = links
    .map(link => 
      format === 'html' 
        ? generateHTMLNavigationButton(link)
        : generateReactNavigationButton(link)
    )
    .join('\n    ');

  if (format === 'html') {
    return `<nav class="bg-gray-800 text-white p-4">
  <div class="container mx-auto flex gap-4">
    ${buttons}
  </div>
</nav>`;
  } else {
    return `<nav className="bg-gray-800 text-white p-4">
  <div className="container mx-auto flex gap-4">
    ${buttons}
  </div>
</nav>`;
  }
};

/**
 * Detects page type and suggests appropriate navigation label
 * 
 * @param {string} pagePath - Page route path
 * @returns {string} Suggested label
 */
export const suggestNavigationLabel = (pagePath: string): string => {
  const path = pagePath.replace('/', '');
  
  // Handle special cases
  const labelMap: { [key: string]: string } = {
    '': 'Home',
    'home': 'Home',
    'login': 'Sign In',
    'register': 'Sign Up',
    'profile': 'Profile',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
    'about': 'About',
    'contact': 'Contact',
  };
  
  if (labelMap[path]) {
    return labelMap[path];
  }
  
  // Default: capitalize first letter
  return path.charAt(0).toUpperCase() + path.slice(1);
};
