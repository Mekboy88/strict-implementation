/**
 * Robust JSX to JavaScript Compiler
 * Transforms JSX syntax into React.createElement calls
 */

interface Token {
  type: 'text' | 'tag-open' | 'tag-close' | 'tag-self-close' | 'expression' | 'attribute';
  value: string;
  line: number;
  col: number;
}

export function compileJSX(code: string): string {
  // Remove TypeScript types and interfaces
  code = stripTypeScript(code);
  
  // Find all JSX blocks and transform them
  return transformJSXInCode(code);
}

function stripTypeScript(code: string): string {
  // Remove interface declarations
  code = code.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
  
  // Remove type annotations from parameters and variables
  code = code.replace(/:\s*\w+(\[\])?(\s*\|[^=,;)]+)?(?=[,;)=])/g, '');
  
  // Remove type imports
  code = code.replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"[^'"]+['"]/g, '');
  
  // Remove generic type parameters
  code = code.replace(/<[A-Z]\w*>/g, '');
  
  return code;
}

function transformJSXInCode(code: string): string {
  let result = '';
  let i = 0;
  const MAX_ITERATIONS = code.length * 2; // Safety limit
  let iterations = 0;
  
  while (i < code.length && iterations < MAX_ITERATIONS) {
    iterations++;
    
    // Check if we're at the start of JSX (after return, =>, or parenthesis)
    if (code[i] === '<' && isJSXStart(code, i)) {
      const jsxResult = parseJSXElement(code, i);
      result += jsxResult.code;
      i = jsxResult.endIndex;
    } else {
      result += code[i];
      i++;
    }
  }
  
  if (iterations >= MAX_ITERATIONS) {
    console.error('JSX compiler exceeded iteration limit');
    return code; // Return original code if we hit the limit
  }
  
  return result;
}

function isJSXStart(code: string, index: number): boolean {
  // Check if this < is likely JSX and not a comparison
  const before = code.slice(Math.max(0, index - 20), index).trim();
  
  // Common JSX contexts
  if (before.endsWith('return') || 
      before.endsWith('=>') || 
      before.endsWith('(') ||
      before.endsWith(',') ||
      /\?\s*$/.test(before) ||
      /:\s*$/.test(before)) {
    return true;
  }
  
  // Also check if we're inside JSX (after > of opening tag)
  const lastChar = before[before.length - 1];
  if (lastChar === '>') {
    return true;
  }
  
  return false;
}

function parseJSXElement(code: string, startIndex: number): { code: string; endIndex: number } {
  let i = startIndex;
  const MAX_PARSE_ITERATIONS = 10000;
  let iterations = 0;
  
  // Parse opening tag
  if (code[i] !== '<') {
    throw new Error('Expected < at JSX start');
  }
  
  i++; // skip <
  
  // Get tag name
  let tagName = '';
  while (i < code.length && /[a-zA-Z0-9_.-]/.test(code[i]) && iterations < MAX_PARSE_ITERATIONS) {
    iterations++;
    tagName += code[i];
    i++;
  }
  
  // Parse attributes
  const attributes: { [key: string]: string } = {};
  while (i < code.length && code[i] !== '>' && code[i] !== '/' && iterations < MAX_PARSE_ITERATIONS) {
    iterations++;
    
    // Skip whitespace
    while (i < code.length && /\s/.test(code[i])) i++;
    
    if (code[i] === '>' || code[i] === '/') break;
    
    // Parse attribute name
    let attrName = '';
    while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) {
      attrName += code[i];
      i++;
    }
    
    if (!attrName) break;
    
    // Skip whitespace and =
    while (i < code.length && (/\s/.test(code[i]) || code[i] === '=')) i++;
    
    // Parse attribute value
    let attrValue = '';
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      i++; // skip opening quote
      while (i < code.length && code[i] !== quote) {
        attrValue += code[i];
        i++;
      }
      i++; // skip closing quote
      attributes[attrName] = JSON.stringify(attrValue);
    } else if (code[i] === '{') {
      // JSX expression
      let braceCount = 1;
      i++; // skip {
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        if (code[i] === '}') braceCount--;
        if (braceCount > 0) attrValue += code[i];
        i++;
      }
      attributes[attrName] = attrValue;
    }
  }
  
  // Check for self-closing tag
  if (code[i] === '/' && code[i + 1] === '>') {
    i += 2; // skip />
    const props = Object.keys(attributes).length > 0
      ? `{ ${Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(', ')} }`
      : 'null';
    return {
      code: `React.createElement('${tagName}', ${props})`,
      endIndex: i
    };
  }
  
  i++; // skip >
  
  // Parse children
  const children: string[] = [];
  while (i < code.length && iterations < MAX_PARSE_ITERATIONS) {
    iterations++;
    
    // Check for closing tag
    if (code[i] === '<' && code[i + 1] === '/') {
      // Found closing tag
      i += 2; // skip </
      let closingTag = '';
      while (i < code.length && code[i] !== '>') {
        closingTag += code[i];
        i++;
      }
      i++; // skip >
      break;
    }
    
    // Check for nested JSX element
    if (code[i] === '<') {
      const childResult = parseJSXElement(code, i);
      children.push(childResult.code);
      i = childResult.endIndex;
      continue;
    }
    
    // Check for JSX expression
    if (code[i] === '{') {
      let braceCount = 1;
      i++; // skip {
      let expression = '';
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        if (code[i] === '}') braceCount--;
        if (braceCount > 0) expression += code[i];
        i++;
      }
      children.push(expression.trim());
      continue;
    }
    
    // Text content
    let text = '';
    while (i < code.length && code[i] !== '<' && code[i] !== '{') {
      text += code[i];
      i++;
    }
    
    text = text.trim();
    if (text) {
      children.push(JSON.stringify(text));
    }
  }
  
  if (iterations >= MAX_PARSE_ITERATIONS) {
    console.error('JSX parser exceeded iteration limit');
    return {
      code: `React.createElement('div', null, 'Parse error')`,
      endIndex: i
    };
  }
  
  // Build React.createElement call
  const props = Object.keys(attributes).length > 0
    ? `{ ${Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(', ')} }`
    : 'null';
  
  const childrenStr = children.length > 0 ? `, ${children.join(', ')}` : '';
  
  return {
    code: `React.createElement('${tagName}', ${props}${childrenStr})`,
    endIndex: i
  };
}
