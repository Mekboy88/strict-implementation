/**
 * Lightweight JSX to createElement transformer
 * Transforms JSX syntax to h() calls without requiring Babel
 */

export function transformJSXToCreateElement(code: string): string {
  let transformed = code;

  // Transform self-closing tags: <Component />
  transformed = transformed.replace(
    /<(\w+)([^>]*?)\/>/g,
    (match, tagName, attrs) => {
      const props = parseAttributes(attrs);
      return `h('${tagName}', ${props})`;
    }
  );

  // Transform opening tags: <Component>
  transformed = transformed.replace(
    /<(\w+)([^>]*?)>/g,
    (match, tagName, attrs) => {
      const props = parseAttributes(attrs);
      return `h('${tagName}', ${props}, `;
    }
  );

  // Transform closing tags: </Component>
  transformed = transformed.replace(
    /<\/(\w+)>/g,
    ')'
  );

  // Transform fragments: <> and </>
  transformed = transformed.replace(/<>/g, "h(Fragment, null, ");
  transformed = transformed.replace(/<\/>/g, ")");

  return transformed;
}

function parseAttributes(attrString: string): string {
  if (!attrString || !attrString.trim()) {
    return 'null';
  }

  const attrs: Record<string, any> = {};
  const attrRegex = /(\w+)=\{([^}]+)\}|(\w+)="([^"]+)"|(\w+)='([^']+)'|(\w+)/g;
  
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    if (match[1]) {
      // Attribute with curly braces: attr={value}
      attrs[match[1]] = match[2];
    } else if (match[3]) {
      // Attribute with double quotes: attr="value"
      attrs[match[3]] = `"${match[4]}"`;
    } else if (match[5]) {
      // Attribute with single quotes: attr='value'
      attrs[match[5]] = `"${match[6]}"`;
    } else if (match[7]) {
      // Boolean attribute: attr
      attrs[match[7]] = 'true';
    }
  }

  if (Object.keys(attrs).length === 0) {
    return 'null';
  }

  const propsString = Object.entries(attrs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return `{ ${propsString} }`;
}

/**
 * Extract component code and prepare for rendering
 */
export function prepareComponentCode(code: string): string {
  // Remove import statements
  let prepared = code.replace(/^import\s+.+?\s+from\s+['"][^'"]+['"];?\s*$/gm, '');
  
  // Remove export statements but keep the code
  prepared = prepared.replace(/^export\s+default\s+/gm, 'return ');
  prepared = prepared.replace(/^export\s+/gm, '');
  
  return prepared;
}
