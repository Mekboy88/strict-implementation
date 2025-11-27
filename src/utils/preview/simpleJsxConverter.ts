/**
 * Simple JSX to jsx() function converter
 * Much more reliable than JSX to HTML conversion
 */

export function convertJsxToJsxCalls(code: string): string {
  // Remove imports
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
  
  // Convert export default to window assignment
  code = code.replace(/export\s+default\s+function\s+(\w+)/, 'function $1');
  code = code.replace(/export\s+default\s+/, 'window.__APP__ = ');
  
  // Convert JSX elements to jsx() calls
  // Self-closing tags: <div /> -> jsx("div", {})
  code = code.replace(/<(\w+)\s*([^>]*?)\s*\/>/g, (match, tag, attrs) => {
    const props = parseAttributes(attrs);
    return `jsx("${tag}", ${props})`;
  });
  
  // Opening tags: <div className="test"> -> jsx("div", { className: "test" }
  code = code.replace(/<(\w+)\s*([^>]*?)>/g, (match, tag, attrs) => {
    const props = parseAttributes(attrs);
    return `jsx("${tag}", ${props}, `;
  });
  
  // Closing tags: </div> -> )
  code = code.replace(/<\/\w+>/g, ')');
  
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
