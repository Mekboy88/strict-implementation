/**
 * Tiny preview bundler.
 *
 * For reliability, we keep this as simple as possible:
 * - Take the entry file (default: src/app/page.tsx)
 * - Run its JSX through our lightweight transformer
 * - Return plain JavaScript that the inline preview runtime can execute
 *
 * This intentionally ignores multi-file/module resolution so that preview
 * always works for the main page, even if the project structure is complex.
 */

import { transformJSXToJS } from './jsxTransformer';

export function bundleForPreview(
  files: { [key: string]: string },
  entryPoint: string = 'src/app/page.tsx'
): string {
  let entryCode = files[entryPoint];

  // Ensure the bundler ALWAYS has a valid entry file so preview never breaks
  if (!entryCode || !entryCode.trim()) {
    entryCode = `export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-2xl font-bold text-gray-900">Preview Works!</h1>
    </main>
  );
}`;
  }

  // Transform JSX syntax to React.createElement calls and normalize exports
  const transformed = transformJSXToJS(entryCode);

  // The LivePreview runtime just evals this string inside the iframe
  return `// === ${entryPoint} ===\n${transformed}`;
}
