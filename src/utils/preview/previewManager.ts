/**
 * Preview Manager
 * 
 * Manages the preview system for viewing pages without rebuilding.
 * Tracks page history and enables navigation between pages.
 * 
 * @module utils/preview/previewManager
 */

export interface PreviewPage {
  path: string;
  htmlPath: string;
  content: string;
  lastModified: number;
}

/**
 * Preview page storage
 */
class PreviewManager {
  private pages: Map<string, PreviewPage> = new Map();
  private currentPage: string | null = null;

  /**
   * Registers a page in the preview system
   * 
   * @param {string} path - Route path (e.g., '/login')
   * @param {string} htmlPath - File path (e.g., 'public/login.html')
   * @param {string} content - HTML content
   */
  registerPage(path: string, htmlPath: string, content: string): void {
    const page: PreviewPage = {
      path,
      htmlPath,
      content,
      lastModified: Date.now(),
    };

    this.pages.set(path, page);
    this.currentPage = path;
    
    console.log(`✅ Preview: Registered page ${path} (${htmlPath})`);
  }

  /**
   * Updates existing page content without changing others
   * 
   * @param {string} path - Route path
   * @param {string} content - Updated HTML content
   */
  updatePage(path: string, content: string): void {
    const existingPage = this.pages.get(path);
    
    if (existingPage) {
      existingPage.content = content;
      existingPage.lastModified = Date.now();
      this.currentPage = path;
      console.log(`✅ Preview: Updated page ${path}`);
    } else {
      console.warn(`⚠️ Preview: Page ${path} not found for update`);
    }
  }

  /**
   * Gets the last modified page (for preview display)
   * 
   * @returns {PreviewPage | null} Last modified page or null
   */
  getLastModifiedPage(): PreviewPage | null {
    if (this.pages.size === 0) return null;

    let lastPage: PreviewPage | null = null;
    let lastTime = 0;

    this.pages.forEach(page => {
      if (page.lastModified > lastTime) {
        lastTime = page.lastModified;
        lastPage = page;
      }
    });

    return lastPage;
  }

  /**
   * Gets a specific page by route path
   * 
   * @param {string} path - Route path
   * @returns {PreviewPage | null} Page or null if not found
   */
  getPage(path: string): PreviewPage | null {
    return this.pages.get(path) || null;
  }

  /**
   * Gets all registered pages
   * 
   * @returns {PreviewPage[]} Array of all pages
   */
  getAllPages(): PreviewPage[] {
    return Array.from(this.pages.values());
  }

  /**
   * Navigates to a specific page (changes preview without rebuilding)
   * 
   * @param {string} path - Route path to navigate to
   * @returns {PreviewPage | null} The page to display, or null if not found
   */
  navigateToPage(path: string): PreviewPage | null {
    const page = this.pages.get(path);
    
    if (page) {
      this.currentPage = path;
      console.log(`📍 Preview: Navigated to ${path}`);
      return page;
    }

    console.warn(`⚠️ Preview: Page ${path} not found for navigation`);
    return null;
  }

  /**
   * Gets the current page being previewed
   * 
   * @returns {PreviewPage | null} Current page or null
   */
  getCurrentPage(): PreviewPage | null {
    if (!this.currentPage) {
      return this.getLastModifiedPage();
    }
    return this.pages.get(this.currentPage) || null;
  }

  /**
   * Checks if a page exists
   * 
   * @param {string} path - Route path
   * @returns {boolean} True if page exists
   */
  hasPage(path: string): boolean {
    return this.pages.has(path);
  }

  /**
   * Clears all pages (use with caution)
   */
  clear(): void {
    this.pages.clear();
    this.currentPage = null;
    console.log('🗑️ Preview: Cleared all pages');
  }
}

// Export singleton instance
export const previewManager = new PreviewManager();

/**
 * Helper to detect navigation request (e.g., "go to login page")
 * 
 * @param {string} message - User message
 * @returns {string | null} Route path if navigation detected, null otherwise
 */
export const detectNavigationRequest = (message: string): string | null => {
  const lower = message.toLowerCase().trim();

  // Navigation phrases
  const navPatterns = [
    /go to ([a-z]+) page/i,
    /show me ([a-z]+) page/i,
    /open ([a-z]+) page/i,
    /view ([a-z]+) page/i,
    /navigate to ([a-z]+)/i,
    /switch to ([a-z]+)/i,
  ];

  for (const pattern of navPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const pageName = match[1];
      // Convert to route path
      return `/${pageName}`;
    }
  }

  return null;
};
