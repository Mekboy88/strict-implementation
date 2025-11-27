/**
 * Simple JSX to jsx() function converter
 * Converts JSX syntax to jsx() function calls for preview runtime
 */

export function convertJsxToJsxCalls(code: string): string {
  // Remove imports
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
  code = code.replace(/import\s+['"].*?['"];?\s*/g, '');
  
  // Convert export default to window assignment
  code = code.replace(/export\s+default\s+function\s+(\w+)/, 'function $1');
  code = code.replace(/export\s+default\s+/, 'window.__APP__ = ');
  
  // Process JSX from inside out
  let previousCode = '';
  let iterations = 0;
  const maxIterations = 50; // Prevent infinite loops
  
  while (code !== previousCode && iterations < maxIterations) {
    previousCode = code;
    iterations++;
    
    // Self-closing tags: <div /> -> jsx("div", {})
    code = code.replace(/<(\w+)\s*([^>]*?)\s*\/>/g, (match, tag, attrs) => {
      const props = parseAttributes(attrs);
      return `jsx("${tag}", ${props})`;
    });
    
    // Match innermost paired tags with their content
    // Pattern: <tag attrs>content</tag> where content has no nested tags of same type
    code = code.replace(/<(\w+)\s*([^>]*?)>([^<]*?)<\/\1>/g, (match, tag, attrs, content) => {
      const props = parseAttributes(attrs);
      const textContent = content.trim();
      
      if (textContent) {
        // Escape quotes in text content
        const escapedText = textContent.replace(/"/g, '\\"');
        return `jsx("${tag}", ${props}, "${escapedText}")`;
      }
      return `jsx("${tag}", ${props})`;
    });
  }
  
  return code;
}

function parseAttributes(attrString: string): string {
  if (!attrString.trim()) return '{}';
  
  const props: Record<string, string> = {};
  
  // Match attribute="value" or attribute={value}
  const attrRegex = /(\w+)=(?:{([^}]+)}|"([^"]+)")/g;
  let match;
  
  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, jsValue, strValue] = match;
    if (jsValue) {
      props[key] = jsValue;
    } else if (strValue) {
      props[key] = `"${strValue}"`;
    }
  }
  
  if (Object.keys(props).length === 0) return '{}';
  
  const propsStr = Object.entries(props)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  
  return `{ ${propsStr} }`;
}

export function extractComponentName(code: string): string {
  // Try to find function name
  const functionMatch = code.match(/function\s+(\w+)/);
  if (functionMatch) return functionMatch[1];
  
  // Try const/let assignment
  const constMatch = code.match(/(?:const|let)\s+(\w+)\s*=/);
  if (constMatch) return constMatch[1];
  
  return 'App';
}
