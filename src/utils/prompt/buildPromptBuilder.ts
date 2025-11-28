/**
 * Build Prompt Builder
 * 
 * Constructs comprehensive AI prompts for code generation with context,
 * requirements, and structured instructions for consistent output.
 * 
 * @module utils/prompt/buildPromptBuilder
 */

import { DetectedRequest } from "../requestTypeDetector";

/**
 * Builds a comprehensive AI prompt for code generation
 * 
 * Combines user request with:
 * - Request context (type, description)
 * - File scaffolding information
 * - Existing project structure
 * - Detailed generation instructions
 * - Preview requirements
 * 
 * @param {string} userMessage - Original user request
 * @param {DetectedRequest} requestDetection - Detected request type and metadata
 * @param {string[]} filesBeingGenerated - Files planned for generation
 * @param {string[]} existingFilePaths - Currently existing project files
 * @returns {string} Complete prompt for AI code generation
 * 
 * @example
 * ```typescript
 * const prompt = buildAIPrompt(
 *   "Create a login page",
 *   { type: 'page', entityName: 'login' },
 *   ['src/pages/Login.tsx'],
 *   ['src/App.tsx']
 * );
 * ```
 */
export const buildAIPrompt = (
  userMessage: string,
  requestDetection: DetectedRequest,
  filesBeingGenerated: string[],
  existingFilePaths: string[],
  platform: 'desktop' | 'mobile' = 'desktop'
): string => {
  const isMobileBuild = platform === 'mobile' || filesBeingGenerated.some(f => f.startsWith('mobile/'));
  
  return `${userMessage}

RESPONSE FORMAT - YOU MUST FOLLOW THIS EXACT STRUCTURE:

IMPORTANT ORDER:
1) Always start with natural language planning (no code, no code fences)
2) Then list Design Vision and Features
3) Only AFTER that, output CREATE_FILE blocks and code

[Brief intro explaining what you'll build - be enthusiastic and clear]

Design Vision:
• [design choice 1 - max 8 words, explain your design decisions]
• [design choice 2 - max 8 words, explain your design decisions]
• [design choice 3 - max 8 words, explain your design decisions]

Features:
• [feature 1 - max 8 words, what you're implementing]
• [feature 2 - max 8 words, what you're implementing]
• [feature 3 - max 8 words, what you're implementing]

[Transition text explaining you're starting to build and the overall plan]

[Generate all code files... using CREATE_FILE blocks as instructed below]

[After files, provide a brief summary of what was created]

HARD RULES ABOUT FORMAT:
• NEVER start your response with code fences or CREATE_FILE
• NEVER start with code or file paths
• ALWAYS let the planning text come first
• YOU decide all content. Be the expert. Explain your choices. Guide the user through what you're building and why.

CONTEXT:
- Request Type: ${requestDetection.type}
- Description: ${requestDetection.description}
- Platform: ${isMobileBuild ? 'MOBILE' : 'DESKTOP'}
- Files to scaffold: ${filesBeingGenerated.join(', ')}
- Existing project files: ${existingFilePaths.slice(0, 15).join(', ')}

CRITICAL: USE COMMON SENSE BUILDING
The user may give MINIMAL details. You MUST:
• NEVER refuse to build
• NEVER ask "what should I include?" or "need more details"
• ALWAYS build a COMPLETE, FUNCTIONAL version using common sense
• Include ALL standard features that page type would normally have
• Make it production-ready, not a skeleton or template

INSTRUCTIONS:
Generate COMPLETE, production-ready code for all files. Include:
✓ All necessary imports and exports
✓ Proper TypeScript types and interfaces
✓ Beautiful Tailwind CSS styling with smooth animations and transitions
✓ Working functionality (not just templates)
✓ Responsive design (mobile-first approach)
✓ Clean, professional code structure
✓ ALL common features that type of page would normally have
✓ Real-looking content (never lorem ipsum or placeholders)
✓ Smooth hover effects, fade-in animations, and transitions
✓ Professional animations using Tailwind animate utilities

ANIMATION REQUIREMENTS (when not specified):
• Add smooth transitions to all interactive elements (buttons, links, cards)
• Include hover effects with scale/opacity changes
• Use fade-in animations for content appearing on page load
• Add slide-in animations for modals/sidebars
• Include loading states with skeleton animations where appropriate
• All animations should use Tailwind CSS classes (animate-fade-in, transition-all, etc.)

CRITICAL FILE FORMAT RULES:
You MUST use this exact format for EVERY file:

${isMobileBuild ? `
🚨🚨🚨 FOR MOBILE BUILDS - ABSOLUTE MANDATORY REQUIREMENT 🚨🚨🚨

YOU MUST CREATE THIS FILE FIRST BEFORE ANY OTHER FILES:

CREATE_FILE: mobile/public/preview.html
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Mobile App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  <!-- BUILD THE COMPLETE MOBILE UI HERE WITH REAL CONTENT -->
  <!-- This is what users will see in the mobile preview -->
  <!-- Use Tailwind classes for all styling -->
  <!-- NO React components, NO TSX, just pure HTML -->
  
  ...FULL COMPLETE MOBILE APP UI WITH ALL FEATURES MENTIONED...
  
</body>
</html>
\`\`\`

CRITICAL: The mobile/public/preview.html file is MANDATORY and MUST be created FIRST.
Without this file, the mobile preview will show NOTHING (blank screen).
This is the ONLY file that will display in the mobile preview.

After creating the required HTML preview file above, you MAY optionally create React components:

CREATE_FILE: mobile/src/pages/PageName.tsx
\`\`\`typescript
...valid React TypeScript code...
\`\`\`
` : `
For HTML preview:
CREATE_FILE: public/preview.html
\`\`\`html
...FULL VALID HTML WITH TAILWIND CDN, NO PLACEHOLDERS...
\`\`\`

For pages:
CREATE_FILE: src/pages/PageName.tsx
\`\`\`typescript
...valid React TypeScript code...
\`\`\`
`}

For components:
CREATE_FILE: src/components/ComponentName.tsx
\`\`\`typescript
...real component code...
\`\`\`

For styles:
CREATE_FILE: src/styles/Name.css
\`\`\`css
...real CSS...
\`\`\`

CRITICAL RULES:
• NEVER return code without CREATE_FILE: directive
• NEVER wrap multiple files inside one code block
• One CREATE_FILE block = ONE file only
• Multiple files = multiple separate CREATE_FILE sections
• Each file gets its own CREATE_FILE: directive and code block
${isMobileBuild 
  ? '• ALWAYS generate mobile/public/preview.html as STATIC HTML with Tailwind CDN (REQUIRED)\n• The mobile preview MUST be a complete standalone HTML file that works without React'
  : '• ALWAYS generate public/preview.html as standalone HTML with Tailwind CDN'
}

PAGE NAVIGATION SYSTEM:
When creating new pages, you MUST:
1. Register the page in src/pageRegistry.ts with format:
   export const pages = {
     '/path': 'file/path.html',
   };

2. Update src/router.ts to include the new route WITHOUT breaking existing routes

3. Add navigation buttons to pages for easy navigation:
   HTML: <button onclick="window.location.href='/profile'" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Profile</button>
   React: <Link to="/profile" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Profile</Link>

4. Include a navigation bar on every page with links to other pages

NEVER USE:
• Lorem ipsum or placeholder text
• "Coming soon" or "TODO" comments
• Demo data or example content
• Empty functions or incomplete code

Make it better than a template - make it fully functional and ready to use!`;
};
