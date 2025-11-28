export interface HighlightedToken {
  text: string;
  className: string;
}

export const highlightCode = (code: string, language: string): HighlightedToken[] => {
  const tokens: HighlightedToken[] = [];
  
  // Keywords
  const keywords = /\b(const|let|var|function|return|import|export|default|from|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|async|await|class|extends|interface|type|enum|namespace|public|private|protected|static|readonly|new|this|super)\b/g;
  
  // Strings
  const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  
  // Comments
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  
  // JSX tags
  const jsxTags = /(<\/?[A-Z][a-zA-Z0-9]*|<\/?[a-z][a-zA-Z0-9-]*)/g;
  
  // Types (TypeScript)
  const types = /\b(string|number|boolean|void|any|unknown|never|null|undefined|Array|Promise|Record|Partial|Required|Pick|Omit)\b/g;
  
  // Numbers
  const numbers = /\b\d+\.?\d*\b/g;
  
  // Combine all patterns
  const lines = code.split('\n');
  
  lines.forEach((line, lineIndex) => {
    let processedLine = line;
    const lineTokens: { start: number; end: number; className: string }[] = [];
    
    // Find all matches
    let match;
    
    // Comments (highest priority)
    while ((match = comments.exec(line)) !== null) {
      lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-neutral-500' });
    }
    comments.lastIndex = 0;
    
    // Strings
    while ((match = strings.exec(line)) !== null) {
      if (!isInsideToken(match.index, lineTokens)) {
        lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-orange-400' });
      }
    }
    strings.lastIndex = 0;
    
    // Keywords
    while ((match = keywords.exec(line)) !== null) {
      if (!isInsideToken(match.index, lineTokens)) {
        lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-sky-400' });
      }
    }
    keywords.lastIndex = 0;
    
    // JSX Tags
    while ((match = jsxTags.exec(line)) !== null) {
      if (!isInsideToken(match.index, lineTokens)) {
        lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-sky-400' });
      }
    }
    jsxTags.lastIndex = 0;
    
    // Types
    while ((match = types.exec(line)) !== null) {
      if (!isInsideToken(match.index, lineTokens)) {
        lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-yellow-400' });
      }
    }
    types.lastIndex = 0;
    
    // Numbers
    while ((match = numbers.exec(line)) !== null) {
      if (!isInsideToken(match.index, lineTokens)) {
        lineTokens.push({ start: match.index, end: match.index + match[0].length, className: 'text-orange-300' });
      }
    }
    numbers.lastIndex = 0;
    
    // Sort tokens by start position
    lineTokens.sort((a, b) => a.start - b.start);
    
    // Build tokens
    let currentPos = 0;
    lineTokens.forEach(token => {
      if (currentPos < token.start) {
        tokens.push({ text: line.substring(currentPos, token.start), className: 'text-neutral-200' });
      }
      tokens.push({ text: line.substring(token.start, token.end), className: token.className });
      currentPos = token.end;
    });
    
    if (currentPos < line.length) {
      tokens.push({ text: line.substring(currentPos), className: 'text-neutral-200' });
    }
    
    if (lineIndex < lines.length - 1) {
      tokens.push({ text: '\n', className: '' });
    }
  });
  
  return tokens;
};

const isInsideToken = (position: number, tokens: { start: number; end: number }[]): boolean => {
  return tokens.some(token => position >= token.start && position < token.end);
};
