# UR-DEV Core Files System

## Overview

This document describes the **18 Core Files** that MUST ALWAYS EXIST in any UR-DEV project to ensure the Live Preview NEVER fails.

## Critical Architecture

The UR-DEV IDE uses a Live Preview system that requires specific files to be present at all times. If ANY of these files are missing, the preview will fail or show a blank screen.

## The 18 Essential Files

### 1️⃣ Main Entry (CRITICAL)
**`src/app/page.tsx`**
- **Required:** YES
- **Purpose:** The main entry point that LivePreview renders
- **Why:** Without this, preview shows blank screen
- **Auto-created:** Always on project init

### 2️⃣ App Wrapper
**`src/app/layout.tsx`**
- **Required:** YES
- **Purpose:** Wraps the entire application
- **Why:** Provides root HTML structure
- **Auto-created:** Always on project init

### 3️⃣ Global Styles
**`src/app/globals.css`**
- **Required:** YES
- **Purpose:** Tailwind CSS imports and base styles
- **Why:** Without this, no styling works
- **Auto-created:** Always on project init

### 4️⃣ Tailwind Config
**`tailwind.config.js`**
**`postcss.config.js`**
- **Required:** YES
- **Purpose:** Configure Tailwind CSS
- **Why:** Required for Tailwind to process styles

### 5️⃣ AI System Prompt
**`src/config/aiSystemPrompt.ts`**
- **Required:** YES
- **Purpose:** Contains permanent AI rules
- **Why:** Controls all AI code generation behavior
- **Auto-created:** Always on project init

### 6️⃣ File System Store
**`src/stores/useFileSystemStore.ts`**
- **Required:** YES
- **Purpose:** Stores all project files
- **Why:** Needed for preview + AI generation

### 7️⃣ Editor Store
**`src/stores/useEditorStore.ts`**
- **Required:** YES
- **Purpose:** Manages active file and editor state
- **Why:** Required for file editing and AI context

### 8️⃣ Preview Store
**`src/stores/usePreviewStore.ts`**
- **Required:** YES
- **Purpose:** Manages preview state
- **Why:** Signals when preview fails for auto-recovery

### 9️⃣ Live Preview Engine
**`src/components/LivePreview.tsx`**
- **Required:** YES
- **Purpose:** Renders code in iframe
- **Why:** Core preview functionality

### 🔟 Editor Panel
**`src/components/EditorPanel.tsx`**
- **Required:** YES
- **Purpose:** Contains LivePreview and editor UI
- **Why:** Mounts the preview component

### 1️⃣1️⃣ Chat Panel
**`src/components/ChatPanel.tsx`**
**`src/lib/aiClient.ts`**
- **Required:** YES
- **Purpose:** AI chat interface
- **Why:** Required for AI → Code workflow

### 1️⃣2️⃣ Default Fallback Page
**`src/app/default-page.tsx`**
- **Required:** YES
- **Purpose:** Backup page when main page fails
- **Why:** Prevents complete preview failure

### 1️⃣3️⃣ Emergency Fallback
**`src/app/_fallback/page.tsx`**
- **Required:** YES
- **Purpose:** Last resort fallback
- **Why:** Absolute safety net

### 1️⃣4️⃣ App Root Wrapper
**`src/components/AppRoot.tsx`**
- **Required:** RECOMMENDED
- **Purpose:** Universal app wrapper with error boundary
- **Why:** Prevents crashes from propagating

### 1️⃣5️⃣ Error Boundary
**`src/components/ErrorBoundary.tsx`**
- **Required:** RECOMMENDED
- **Purpose:** Catches React errors
- **Why:** Prevents preview hard crashes

### 1️⃣6️⃣ System Toast
**`src/components/SystemToast.tsx`**
- **Required:** NO
- **Purpose:** Shows system notifications
- **Why:** Improves UX during auto-recovery

### 1️⃣7️⃣ Safe Render Utilities
**`src/utils/safeRender.ts`**
- **Required:** NO
- **Purpose:** Safe parsing and rendering helpers
- **Why:** Prevents crashes from bad data

### 1️⃣8️⃣ Project Initializer
**`src/utils/projectInitializer.ts`**
- **Required:** YES
- **Purpose:** Auto-creates all core files
- **Why:** Ensures system never breaks

## Auto-Initialization

All core files are automatically created when:

1. **New project is created**
2. **Project is loaded and files are missing**
3. **Preview detects missing files**

The system uses `src/utils/projectInitializer.ts` to:
- Check which core files exist
- Auto-create missing required files
- Show toast notification on recovery

## How It Works

```typescript
// 1. On project load
const missingFiles = getMissingCoreFiles(projectFiles);

// 2. Auto-create missing files
missingFiles.forEach(coreFile => {
  createFile(coreFile);
});

// 3. Preview always has what it needs
// ✅ Preview never fails!
```

## Benefits

✅ **Zero Preview Failures** - All required files always exist
✅ **Auto-Recovery** - System heals itself automatically  
✅ **Better UX** - Users never see blank screens
✅ **AI Safety** - AI always has proper entry points
✅ **Error Prevention** - Error boundaries catch issues

## Maintenance

When adding new critical functionality:

1. Add the file to `CORE_PROJECT_FILES` in `projectInitializer.ts`
2. Set `required: true` for essential files
3. System will auto-create it going forward

## Testing

To test the system:

1. Delete `src/app/page.tsx` manually
2. Refresh the preview
3. System should auto-create it within seconds
4. Preview should display correctly

## Summary

The 18-file system ensures UR-DEV **NEVER** has a blank preview. Every essential file is auto-created, monitored, and recovered if missing.

**The preview ALWAYS works. Always.**
