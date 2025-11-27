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
 * Find the position of the matching closing tag for a given opening tag.
 * Expects that the string starts with the opening tag already matched separately.
 */
function findClosingTagPosition(jsx: string, tag: string, startPos: number): number {
  const closingTag = `</${tag}>`;
  let depth = 1; // we've already seen the first opening tag
  let pos = startPos;

  while (pos < jsx.length && depth > 0) {
    // Look for the next opening or closing tag of the same type
    const openIndex = jsx.indexOf(`<${tag}`, pos);
    const closeIndex = jsx.indexOf(closingTag, pos);

    if (closeIndex === -1) {
      // No more closing tags, abort
      return -1;
    }

    if (openIndex !== -1 && openIndex < closeIndex) {
      // Found another nested opening tag before the next close
      depth++;
      pos = openIndex + tag.length + 1;
    } else {
      // Found a closing tag
      depth--;
      if (depth === 0) {
        return closeIndex;
      }
      pos = closeIndex + closingTag.length;
    }
  }

  return -1;
}

/**
 * Parse a JSX element and convert to HTML
 */
function parseJSXElement(jsx: string): string {
  jsx = jsx.trim();

  // Handle empty content
  if (!jsx) return "";

  // Handle self-closing tags: <div /> or <Component />
  const selfClosingMatch = jsx.match(/^<([A-Za-z_][\w]*)\b([^>]*?)\/>/);
  if (selfClosingMatch) {
    const [, tag, attrsStr] = selfClosingMatch;
    const attrs = parseAttributes(attrsStr);
    return `<${tag}${attrs}></${tag}>`;
  }

  // Handle opening tag: <div className="..."> or <Component>
  const openingTagMatch = jsx.match(/^<([A-Za-z_][\w]*)\b([^>]*)>/);
  if (!openingTagMatch) {
    // Not a JSX element, might be text or expression
    if (jsx.startsWith("{") && jsx.endsWith("}")) {
      return '<span class="text-muted-foreground">[dynamic content]</span>';
    }
    // Plain text
    return escapeHtml(jsx);
  }

  const [fullOpeningTag, tag, attrsStr] = openingTagMatch;
  const attrs = parseAttributes(attrsStr);

  // Find the matching closing tag within the *entire* jsx string
  const closingPos = findClosingTagPosition(jsx, tag, fullOpeningTag.length);

  if (closingPos === -1) {
    // No closing tag found; render as empty element to avoid crashing preview
    return `<${tag}${attrs}></${tag}>`;
  }

  // Extract children between the opening and closing tags
  const childrenStr = jsx.slice(fullOpeningTag.length, closingPos);
  const childrenHtml = parseJSXChildren(childrenStr);

  return `<${tag}${attrs}>${childrenHtml}</${tag}>`;
}

/**
 * Parse children (can be multiple sibling elements or text)
 */
function parseJSXChildren(children: string): string {
  children = children.trim();
  if (!children) return "";

  const result: string[] = [];
  let pos = 0;

  while (pos < children.length) {
    // Skip whitespace
    while (pos < children.length && /\s/.test(children[pos])) {
      pos++;
    }

    if (pos >= children.length) break;

    const currentChar = children[pos];

    // JSX element node
    if (currentChar === "<") {
      // Try self-closing element first
      const selfClosing = children.slice(pos).match(/^<([A-Za-z_][\w]*)\b[^>]*\/>/);
      if (selfClosing) {
        const elementStr = selfClosing[0];
        result.push(parseJSXElement(elementStr));
        pos += elementStr.length;
        continue;
      }

      // Regular opening tag with children
      const openingTagMatch = children.slice(pos).match(/^<([A-Za-z_][\w]*)\b([^>]*)>/);
      if (openingTagMatch) {
        const [fullOpeningTag, tag] = openingTagMatch;
        const relativeClosingPos = findClosingTagPosition(children.slice(pos), tag, fullOpeningTag.length);

        if (relativeClosingPos !== -1) {
          const closingTag = `</${tag}>`;
          const elementEnd = pos + relativeClosingPos + closingTag.length;
          const elementStr = children.slice(pos, elementEnd);
          result.push(parseJSXElement(elementStr));
          pos = elementEnd;
          continue;
        }
      }

      // Fallback: just consume until next '>' to avoid infinite loop
      const nextGt = children.indexOf('>', pos);
      if (nextGt === -1) break;
      const fallbackElement = children.slice(pos, nextGt + 1);
      result.push(escapeHtml(fallbackElement));
      pos = nextGt + 1;
      continue;
    }

    // JSX expression node
    if (currentChar === "{") {
      const exprEnd = children.indexOf("}", pos);
      if (exprEnd !== -1) {
        result.push('<span class="text-muted-foreground text-sm">[dynamic]</span>');
        pos = exprEnd + 1;
        continue;
      }
      // Unclosed expression, just break
      break;
    }

    // Plain text node
    let textEnd = pos;
    while (textEnd < children.length && children[textEnd] !== "<" && children[textEnd] !== "{") {
      textEnd++;
    }
    const text = children.slice(pos, textEnd).trim();
    if (text) {
      result.push(escapeHtml(text));
    }
    pos = textEnd;
  }

  return result.join("");
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
