/**
 * Simplified JSX Compiler with Proper Error Handling
 * Transforms JSX to React.createElement with component support
 */

export function compileJSX(code: string): string {
  try {
    // Step 1: Remove TypeScript artifacts
    code = stripTypeScript(code);
    
    // Step 2: Transform JSX
    code = transformJSX(code);
    
    return code;
  } catch (error) {
    console.error('[JSX Compiler] Error:', error);
    // Return safe fallback
    return `function Page() { return React.createElement('div', null, 'JSX Compilation Error: ${error instanceof Error ? error.message : String(error)}'); }`;
  }
}

function stripTypeScript(code: string): string {
  // Remove interface/type declarations
  code = code.replace(/interface\s+\w+\s*\{[^}]*\}/gs, '');
  code = code.replace(/type\s+\w+\s*=\s*[^;]+;/gs, '');
  
  // Remove type annotations from function params: (x: Type)
  code = code.replace(/\(\s*\{([^}]+)\}\s*:\s*\{[^}]+\}\s*\)/g, '({ $1 })');
  code = code.replace(/\(\s*(\w+)\s*:\s*[^)]+\)/g, '($1)');
  
  // Remove return type annotations: ): Type =>
  code = code.replace(/\):\s*\w+(\[\])?\s*(=>|{)/g, ') $2');
  
  // Remove variable type annotations: const x: Type =
  code = code.replace(/:\s*\w+(\[\])?\s*=/g, ' =');
  
  return code;
}

function transformJSX(code: string): string {
  let result = '';
  let i = 0;
  
  while (i < code.length) {
    // Look for JSX opening: < followed by letter
    if (code[i] === '<' && i + 1 < code.length && /[a-zA-Z]/.test(code[i + 1])) {
      try {
        const jsxResult = parseJSXElement(code, i);
        result += jsxResult.code;
        i = jsxResult.endIndex;
      } catch (error) {
        console.error('[JSX Parser] Error at position', i, ':', error);
        // Skip the problematic character and continue
        result += code[i];
        i++;
      }
    } else {
      result += code[i];
      i++;
    }
  }
  
  return result;
}

function parseJSXElement(code: string, startIndex: number): { code: string; endIndex: number } {
  let i = startIndex + 1; // Skip '<'
  
  // Get tag name
  let tagName = '';
  while (i < code.length && /[a-zA-Z0-9_.]/.test(code[i])) {
    tagName += code[i];
    i++;
  }
  
  if (!tagName) {
    throw new Error('Invalid JSX: no tag name');
  }
  
  // Skip whitespace
  while (i < code.length && /\s/.test(code[i])) i++;
  
  // Parse attributes
  const attributes: Record<string, string> = {};
  while (i < code.length && code[i] !== '>' && code[i] !== '/') {
    // Skip whitespace
    while (i < code.length && /\s/.test(code[i])) i++;
    
    if (code[i] === '>' || code[i] === '/') break;
    
    // Get attribute name
    let attrName = '';
    while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) {
      attrName += code[i];
      i++;
    }
    
    if (!attrName) break;
    
    // Skip whitespace and '='
    while (i < code.length && (/\s/.test(code[i]) || code[i] === '=')) i++;
    
    // Get attribute value
    if (code[i] === '"' || code[i] === "'") {
      // String value
      const quote = code[i];
      i++;
      let attrValue = '';
      while (i < code.length && code[i] !== quote) {
        attrValue += code[i];
        i++;
      }
      i++; // Skip closing quote
      attributes[attrName] = JSON.stringify(attrValue);
    } else if (code[i] === '{') {
      // Expression value
      i++; // Skip '{'
      let braceCount = 1;
      let expr = '';
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        else if (code[i] === '}') braceCount--;
        if (braceCount > 0) expr += code[i];
        i++;
      }
      attributes[attrName] = expr.trim();
    }
  }
  
  // Check for self-closing tag
  if (code[i] === '/' && code[i + 1] === '>') {
    i += 2;
    return {
      code: buildCreateElement(tagName, attributes, []),
      endIndex: i
    };
  }
  
  // Skip '>'
  if (code[i] === '>') i++;
  
  // Parse children
  const children: string[] = [];
  while (i < code.length) {
    // Check for closing tag
    if (code[i] === '<' && code[i + 1] === '/') {
      i += 2; // Skip '</'
      // Skip tag name
      while (i < code.length && code[i] !== '>') i++;
      i++; // Skip '>'
      break;
    }
    
    // Nested JSX element
    if (code[i] === '<' && /[a-zA-Z]/.test(code[i + 1])) {
      const childResult = parseJSXElement(code, i);
      children.push(childResult.code);
      i = childResult.endIndex;
      continue;
    }
    
    // Expression {  }
    if (code[i] === '{') {
      i++; // Skip '{'
      let braceCount = 1;
      let expr = '';
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        else if (code[i] === '}') braceCount--;
        if (braceCount > 0) expr += code[i];
        i++;
      }
      children.push(expr.trim());
      continue;
    }
    
    // Text content
    let text = '';
    while (i < code.length && code[i] !== '<' && code[i] !== '{') {
      text += code[i];
      i++;
    }
    const trimmed = text.trim();
    if (trimmed) {
      children.push(JSON.stringify(trimmed));
    }
  }
  
  return {
    code: buildCreateElement(tagName, attributes, children),
    endIndex: i
  };
}

function buildCreateElement(
  tagName: string,
  attributes: Record<string, string>,
  children: string[]
): string {
  // CRITICAL: Uppercase = component (identifier), lowercase = HTML element (string)
  const tagArg = /^[A-Z]/.test(tagName) ? tagName : `'${tagName}'`;
  
  // Build props object
  const props = Object.keys(attributes).length > 0
    ? `{ ${Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(', ')} }`
    : 'null';
  
  // Build children arguments
  const childrenStr = children.length > 0 ? ', ' + children.join(', ') : '';
  
  return `React.createElement(${tagArg}, ${props}${childrenStr})`;
}
