/**
 * Lightweight JSX to plain JavaScript transformer
 * Transforms JSX syntax WITHOUT requiring Babel or external CDNs
 */

/**
 * Simple JSX to JavaScript transformer
 * Converts JSX elements to React.createElement calls
 */
export function transformJSXToJS(code: string): string {
  let result = code;
  
  // Remove import statements (they're not needed in the preview iframe)
  result = result.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  
  // Replace export default with window assignment for component detection
  result = result.replace(/export\s+default\s+function\s+(\w+)/g, 'window.$1 = function $1');
  result = result.replace(/export\s+default\s+/g, 'window.DefaultExport = ');
  
  // Simple JSX to createElement transformation
  // This handles basic JSX syntax without needing Babel
  
  // Transform self-closing JSX tags: <div /> or <Component />
  result = result.replace(/<(\w+)([^>]*?)\/>/g, (match, tag, attrs) => {
    const props = parseJSXAttributes(attrs.trim());
    return `React.createElement('${tag}', ${props})`;
  });
  
  // Transform JSX opening tags with attributes: <div className="...">
  result = result.replace(/<(\w+)([^>]*?)>/g, (match, tag, attrs) => {
    const props = parseJSXAttributes(attrs.trim());
    return `React.createElement('${tag}', ${props}, `;
  });
  
  // Transform JSX closing tags: </div>
  result = result.replace(/<\/\w+>/g, ')');
  
  return result;
}

/**
 * Parse JSX attributes into a props object string
 */
function parseJSXAttributes(attrString: string): string {
  if (!attrString) return 'null';
  
  const props: string[] = [];
  
  // Match className="value" or className='value'
  const stringAttrRegex = /(\w+)=["']([^"']+)["']/g;
  let match;
  
  while ((match = stringAttrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2];
    props.push(`${key}: "${value}"`);
  }
  
  // Match attribute={expression}
  const exprAttrRegex = /(\w+)=\{([^}]+)\}/g;
  while ((match = exprAttrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2];
    props.push(`${key}: ${value}`);
  }
  
  if (props.length === 0) return 'null';
  
  return `{ ${props.join(', ')} }`;
}

/**
 * Extract just the component name from code
 */
export function extractComponentName(code: string): string | null {
  // Try to find: export default function ComponentName
  let match = code.match(/export\s+default\s+function\s+(\w+)/);
  if (match) return match[1];
  
  // Try to find: function ComponentName
  match = code.match(/function\s+(\w+)\s*\(/);
  if (match) return match[1];
  
  // Try to find: const ComponentName = 
  match = code.match(/const\s+(\w+)\s*=/);
  if (match) return match[1];
  
  return null;
}
