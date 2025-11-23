/**
 * Protection Rules
 * 
 * Defines files and patterns that MUST NEVER be modified by AI builds.
 * These are core IDE interface files that keep UR-DEV functional.
 * 
 * @module utils/protection/protectionRules
 */

/**
 * Protected file patterns - NEVER allow AI to modify these
 */
export const PROTECTED_PATHS = [
  // Core IDE UI components
  'src/components/AssistantPanel.tsx',
  'src/components/EditorPanel.tsx',
  'src/components/EditorTabs.tsx',
  'src/components/FileTree.tsx',
  'src/components/FilePreview.tsx',
  'src/components/MobilePreview.tsx',
  'src/components/DiffView.tsx',
  'src/components/CommandPalette.tsx',
  'src/components/WorkspaceSelector.tsx',
  'src/components/UnifiedMenuDropdown.tsx',
  'src/components/PremiumSettingsDropup.tsx',
  'src/components/PreviewHistoryPanel.tsx',
  'src/components/SnippetsLibrary.tsx',
  'src/components/RestoreConfirmationModal.tsx',
  
  // Chat system components
  'src/components/chat/EnhancedChatInput.tsx',
  'src/components/chat/ChatToolsMenu.tsx',
  'src/components/chat/FileMentionAutocomplete.tsx',
  'src/components/chat/FileShimmer.tsx',
  'src/components/chat/Shimmer.tsx',
  'src/components/chat/SlashCommandPalette.tsx',
  'src/components/chat/MainActionsDrawer.tsx',
  
  // Core IDE pages
  'src/pages/Index.tsx',
  'src/pages/BuildTools.tsx',
  'src/pages/CloudSandbox.tsx',
  'src/pages/DatabaseIntegration.tsx',
  'src/pages/LiveCollaboration.tsx',
  'src/pages/RealTerminal.tsx',
  'src/pages/RemoteSync.tsx',
  'src/pages/TeamChat.tsx',
  
  // Stores and state management
  'src/stores/useEditorStore.ts',
  'src/stores/useEditorSuggestionsStore.ts',
  'src/stores/useFileSystemStore.ts',
  'src/stores/usePreviewHistoryStore.ts',
  'src/stores/usePreviewStore.ts',
  
  // Utility files
  'src/utils/aiFileParser.ts',
  'src/utils/requestTypeDetector.ts',
  'src/utils/projectScaffolder.ts',
  
  // Services
  'src/services/ai/aiService.ts',
  'src/services/chat/chatService.ts',
  'src/services/editor/editorStreamService.ts',
  
  // Core configuration
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'tailwind.config.ts',
  'vite.config.ts',
  
  // Supabase edge functions
  'supabase/functions/ai/index.ts',
];

/**
 * Protected path patterns (regex)
 */
export const PROTECTED_PATTERNS = [
  /^src\/components\/ui\//,        // Shadcn UI components
  /^src\/hooks\//,                  // Core hooks
  /^src\/integrations\//,           // Integration files
  /^src\/lib\//,                    // Library files
  /^src\/utils\/preview\//,         // Preview system utilities
  /^src\/utils\/navigation\//,      // Navigation utilities
  /^src\/utils\/output\//,          // Output formatters
  /^src\/utils\/prompt\//,          // Prompt builders
  /^src\/utils\/protection\//,      // Protection system (this file!)
  /^src\/utils\/requestDetection\//, // Request classifiers
  /^src\/utils\/templates\//,       // Templates
];

/**
 * Checks if a file path is protected
 * 
 * @param {string} path - File path to check
 * @returns {boolean} True if file is protected
 */
export const isProtectedFile = (path: string): boolean => {
  // Check exact path matches
  if (PROTECTED_PATHS.includes(path)) {
    return true;
  }
  
  // Check pattern matches
  return PROTECTED_PATTERNS.some(pattern => pattern.test(path));
};

/**
 * Validates file operations and blocks protected file modifications
 * 
 * @param {string} path - File path being modified
 * @param {string} operation - Operation type (CREATE, UPDATE, DELETE)
 * @returns {object} Validation result
 */
export const validateFileOperation = (
  path: string,
  operation: string
): { allowed: boolean; reason?: string } => {
  if (isProtectedFile(path)) {
    return {
      allowed: false,
      reason: `BLOCKED: Cannot ${operation} protected IDE file: ${path}`,
    };
  }
  
  return { allowed: true };
};

/**
 * Filters file operations to remove protected file modifications
 * 
 * @param {Array} operations - Array of file operations
 * @returns {object} Filtered operations and blocked list
 */
export const filterProtectedOperations = (operations: any[]): {
  allowed: any[];
  blocked: any[];
} => {
  const allowed: any[] = [];
  const blocked: any[] = [];
  
  operations.forEach(op => {
    const validation = validateFileOperation(op.path, op.type);
    
    if (validation.allowed) {
      allowed.push(op);
    } else {
      blocked.push({ ...op, blockReason: validation.reason });
      console.error(`🚫 ${validation.reason}`);
    }
  });
  
  return { allowed, blocked };
};

/**
 * Protection rules summary for AI system prompt
 */
export const PROTECTION_RULES_PROMPT = `
CRITICAL PROTECTION RULES - NEVER VIOLATE THESE:

You MUST NEVER modify, create, update, or delete these types of files:
• Core IDE UI components (AssistantPanel, EditorPanel, FileTree, etc.)
• IDE pages (Index, BuildTools, CloudSandbox, etc.)
• State management stores (useEditorStore, useFileSystemStore, etc.)
• Chat system components (EnhancedChatInput, ChatToolsMenu, etc.)
• Preview system files (PreviewHistoryPanel, MobilePreview, etc.)
• Utility files in src/utils/
• Service files in src/services/
• Core hooks in src/hooks/
• Shadcn UI components in src/components/ui/
• Configuration files (App.tsx, main.tsx, tailwind.config.ts, vite.config.ts)
• Supabase edge functions for the IDE
• Any file in src/integrations/

ONLY CREATE/MODIFY FILES IN THESE SAFE LOCATIONS:
• public/ folder (for HTML previews and static assets)
• src/pages/ (ONLY for USER project pages, never IDE pages)
• src/components/ (ONLY for USER project components)
• src/styles/ (for user project styles)

If a build request would require modifying protected files, REFUSE and explain the limitation.

REMEMBER: Your job is to build USER projects, NOT modify the IDE itself.
`;
