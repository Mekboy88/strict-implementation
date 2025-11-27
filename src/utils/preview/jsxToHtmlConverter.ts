/**
 * JSX to Static HTML Converter
 * Converts JSX code directly to HTML strings for CDN-free preview
 * No JavaScript execution needed in iframe
 */

interface ConversionResult {
  html: string;
  success: boolean;
  error?: string;
}

/**
 * Convert JSX code to static HTML
 * Handles: elements, attributes, className, style objects, text content
 * Ignores: event handlers, dynamic expressions (shows placeholders)
 */
export function convertJSXToHTML(jsxCode: string, filename: string): ConversionResult {
  try {
    // Extract the JSX from the return statement of the component
    const jsxMatch = jsxCode.match(/return\s*\(?([\s\S]*?)\)?[;\s]*\}[\s]*$/m);
    if (!jsxMatch) {
      return { 
        html: '', 
        success: false, 
        error: 'Could not find JSX return statement' 
      };
    }

    let jsx = jsxMatch[1].trim();
    
    // Remove parentheses if wrapped
    if (jsx.startsWith('(') && jsx.endsWith(')')) {
      jsx = jsx.slice(1, -1).trim();
    }

    // Convert JSX to HTML
    const html = parseJSXElement(jsx);
    
    return { html, success: true };
  } catch (error) {
    console.error('JSX to HTML conversion error:', error);
    return { 
      html: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Parse a JSX element and convert to HTML
 */
function parseJSXElement(jsx: string): string {
  jsx = jsx.trim();
  
  // Handle empty content
  if (!jsx) return '';
  
  // Handle self-closing tags: <div />
  const selfClosingMatch = jsx.match(/^<(\w+)([^>]*?)\/>/);
  if (selfClosingMatch) {
    const [, tag, attrsStr] = selfClosingMatch;
    const attrs = parseAttributes(attrsStr);
    return `<${tag}${attrs}></${tag}>`;
  }
  
  // Handle opening tag: <div className="...">
  const openingTagMatch = jsx.match(/^<(\w+)([^>]*?)>/);
  if (!openingTagMatch) {
    // Not a JSX element, might be text or expression
    if (jsx.startsWith('{') && jsx.endsWith('}')) {
      return '<span class="text-muted-foreground">[dynamic content]</span>';
    }
    // Plain text
    return escapeHtml(jsx);
  }
  
  const [fullOpeningTag, tag, attrsStr] = openingTagMatch;
  const attrs = parseAttributes(attrsStr);
  
  // Find the matching closing tag
  const closingTag = `</${tag}>`;
  let depth = 1;
  let pos = fullOpeningTag.length;
  let closingPos = -1;
  
  while (pos < jsx.length && depth > 0) {
    if (jsx.slice(pos).startsWith(`<${tag}`)) {
      // Another opening tag of same type
      const nextChar = jsx[pos + tag.length + 1];
      if (nextChar === ' ' || nextChar === '>' || nextChar === '/') {
        depth++;
        pos += tag.length + 1;
      } else {
        pos++;
      }
    } else if (jsx.slice(pos).startsWith(closingTag)) {
      depth--;
      if (depth === 0) {
        closingPos = pos;
        break;
      }
      pos += closingTag.length;
    } else {
      pos++;
    }
  }
  
  if (closingPos === -1) {
    // No closing tag found
    return `<${tag}${attrs}></${tag}>`;
  }
  
  // Extract children
  const childrenStr = jsx.slice(fullOpeningTag.length, closingPos);
  const childrenHtml = parseJSXChildren(childrenStr);
  
  return `<${tag}${attrs}>${childrenHtml}</${tag}>`;
}

/**
 * Parse children (can be multiple sibling elements or text)
 */
function parseJSXChildren(children: string): string {
  children = children.trim();
  if (!children) return '';
  
  const result: string[] = [];
  let pos = 0;
  
  while (pos < children.length) {
    // Skip whitespace
    while (pos < children.length && /\s/.test(children[pos])) {
      pos++;
    }
    
    if (pos >= children.length) break;
    
    // Check if we're at a JSX element
    if (children[pos] === '<') {
      // Find the end of this element
      const elementStart = pos;
      let elementEnd = pos;
      let depth = 0;
      let inTag = false;
      
      while (elementEnd < children.length) {
        const char = children[elementEnd];
        
        if (char === '<') {
          if (children[elementEnd + 1] === '/') {
            // Closing tag
            if (depth === 0) {
              // Find end of closing tag
              const closeTagEnd = children.indexOf('>', elementEnd);
              if (closeTagEnd !== -1) {
                elementEnd = closeTagEnd + 1;
                break;
              }
            } else {
              depth--;
            }
          } else {
            // Opening tag
            if (inTag) {
              depth++;
            }
            inTag = true;
          }
        } else if (char === '>') {
          if (children[elementEnd - 1] === '/') {
            // Self-closing
            if (depth === 0) {
              elementEnd++;
              break;
            }
          }
          inTag = false;
        }
        
        elementEnd++;
      }
      
      const elementStr = children.slice(elementStart, elementEnd);
      result.push(parseJSXElement(elementStr));
      pos = elementEnd;
    } else if (children[pos] === '{') {
      // JSX expression - show placeholder
      const exprEnd = children.indexOf('}', pos);
      if (exprEnd !== -1) {
        result.push('<span class="text-muted-foreground text-sm">[dynamic]</span>');
        pos = exprEnd + 1;
      } else {
        pos++;
      }
    } else {
      // Plain text
      let textEnd = pos;
      while (textEnd < children.length && children[textEnd] !== '<' && children[textEnd] !== '{') {
        textEnd++;
      }
      const text = children.slice(pos, textEnd).trim();
      if (text) {
        result.push(escapeHtml(text));
      }
      pos = textEnd;
    }
  }
  
  return result.join('');
}

/**
 * Parse JSX attributes and convert to HTML attributes
 */
function parseAttributes(attrsStr: string): string {
  if (!attrsStr.trim()) return '';
  
  const attrs: string[] = [];
  const attrRegex = /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})|(\w+)(?=\s|$)/g;
  let match;
  
  while ((match = attrRegex.exec(attrsStr)) !== null) {
    const [, name, stringValue, singleQuoteValue, exprValue, boolAttr] = match;
    
    if (boolAttr) {
      // Boolean attribute
      attrs.push(boolAttr);
      continue;
    }
    
    const attrName = name;
    const attrValue = stringValue || singleQuoteValue || exprValue;
    
    // Skip event handlers
    if (attrName.startsWith('on')) continue;
    
    // Convert className to class
    if (attrName === 'className') {
      attrs.push(`class="${escapeHtml(attrValue)}"`);
      continue;
    }
    
    // Handle style object (simplified - just ignore for now)
    if (attrName === 'style' && exprValue) {
      // Parse style object like { color: 'red', fontSize: '16px' }
      const styleStr = parseStyleObject(exprValue);
      if (styleStr) {
        attrs.push(`style="${styleStr}"`);
      }
      continue;
    }
    
    // Regular attribute
    attrs.push(`${attrName}="${escapeHtml(attrValue)}"`);
  }
  
  return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
}

/**
 * Parse style object to inline CSS string
 */
function parseStyleObject(styleExpr: string): string {
  try {
    // Simple parser for style objects like { color: 'red', fontSize: '16px' }
    const styles: string[] = [];
    const styleRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = styleRegex.exec(styleExpr)) !== null) {
      const [, prop, value] = match;
      // Convert camelCase to kebab-case
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      styles.push(`${cssProp}: ${value}`);
    }
    
    return styles.join('; ');
  } catch {
    return '';
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

/**
 * Extract component name from code
 */
export function extractComponentName(code: string): string | null {
  // Try: export default function ComponentName
  let match = code.match(/export\s+default\s+function\s+(\w+)/);
  if (match) return match[1];
  
  // Try: function ComponentName
  match = code.match(/function\s+(\w+)\s*\(/);
  if (match) return match[1];
  
  // Try: const ComponentName = 
  match = code.match(/const\s+(\w+)\s*=/);
  if (match) return match[1];
  
  return null;
}
