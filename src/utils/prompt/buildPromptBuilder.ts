/**
 * Build Prompt Builder
 * 
 * Constructs comprehensive AI prompts for code generation with context,
 * requirements, and structured instructions for consistent output.
 * 
 * @module utils/prompt/buildPromptBuilder
 */

import { DetectedRequest } from "../requestTypeDetector";
import { generateBlueprintContext } from "./blueprintInjector";
import { qualityTiers, mandatoryFeatures, visualChecklist } from "@/config/qualityStandards";
import { designPatterns } from "@/config/designPatterns";
import { componentExamples } from "@/config/componentExamples";

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
  
  // Auto-detect and inject blueprint context
  const blueprintContext = generateBlueprintContext(userMessage);
  
  return `${userMessage}

${blueprintContext}

CONTEXT:
- Request Type: ${requestDetection.type}
- Description: ${requestDetection.description}
- Platform: ${isMobileBuild ? 'MOBILE' : 'DESKTOP'}
- Files to scaffold: ${filesBeingGenerated.join(', ')}
- Existing project files: ${existingFilePaths.slice(0, 15).join(', ')}

🚨 PROFESSIONAL QUALITY STANDARDS (MANDATORY) 🚨

You MUST build to PROFESSIONAL or PREMIUM quality tier. Basic quality is NOT acceptable.

🎨 VISUAL POLISH REQUIREMENTS:
${qualityTiers.professional.uiRequirements.map(req => `  • ${req}`).join('\n')}

Additional Premium Elements (when appropriate):
${qualityTiers.premium.uiRequirements.slice(7).map(req => `  • ${req}`).join('\n')}

✨ ANIMATION REQUIREMENTS:
${qualityTiers.professional.animationRequirements.map(req => `  • ${req}`).join('\n')}

📊 DATA RICHNESS:
${qualityTiers.professional.dataRichness.map(req => `  • ${req}`).join('\n')}

🧩 COMPONENT DEPTH:
${qualityTiers.professional.componentDepth.map(req => `  • ${req}`).join('\n')}

💎 MANDATORY FEATURES:

RESPONSIVE DESIGN:
${mandatoryFeatures.responsive.requirements.map(r => `  • ${r}`).join('\n')}

DARK MODE:
${mandatoryFeatures.darkMode.requirements.map(r => `  • ${r}`).join('\n')}

ACCESSIBILITY:
${mandatoryFeatures.accessibility.requirements.map(r => `  • ${r}`).join('\n')}

LOADING STATES:
${mandatoryFeatures.states.loading.map(r => `  • ${r}`).join('\n')}

EMPTY STATES:
${mandatoryFeatures.states.empty.map(r => `  • ${r}`).join('\n')}

ERROR STATES:
${mandatoryFeatures.states.error.map(r => `  • ${r}`).join('\n')}

🎯 HIGH-QUALITY COMPONENT EXAMPLES:

Glass-morphism Card Example:
${componentExamples.cards.productCard}

Modern Button Example (use this pattern):
<button className="${designPatterns.buttons.primary.classes} ${designPatterns.buttons.primary.hover} ${designPatterns.buttons.primary.active} ${designPatterns.buttons.primary.transition}">
  Click Me
</button>

Professional Form Example:
${componentExamples.forms.loginForm}

CRITICAL: USE COMMON SENSE BUILDING
The user may give MINIMAL details. You MUST:
• NEVER refuse to build
• NEVER ask "what should I include?" or "need more details"
• ALWAYS build a COMPLETE, FUNCTIONAL version using common sense
• Include ALL standard features that page type would normally have
• Make it production-ready, not a skeleton or template
• Follow the PROFESSIONAL QUALITY STANDARDS above

VISUAL QUALITY CHECKLIST (MANDATORY):
${visualChecklist.map(item => item).join('\n')}

INSTRUCTIONS:
Generate COMPLETE, PROFESSIONAL-GRADE, production-ready code following all quality standards above. Include:
✓ Glass-morphism cards with backdrop-blur and borders
✓ Gradient backgrounds and buttons
✓ Soft shadows (shadow-xl, shadow-2xl)
✓ All necessary imports and exports
✓ Proper TypeScript types and interfaces
✓ Smooth animations (hover:scale-105, animate-fade-in)
✓ Transitions on all interactive elements (transition-all duration-300)
✓ Responsive design at all breakpoints
✓ Dark mode support
✓ Loading, empty, and error states
✓ Minimum 5-8 realistic data items
✓ NO lorem ipsum or placeholder text
✓ Professional component architecture

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
