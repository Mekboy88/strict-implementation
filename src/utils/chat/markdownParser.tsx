import React from 'react';

interface ParsedElement {
  type: 'paragraph' | 'list' | 'heading' | 'text';
  content: React.ReactNode;
  level?: number;
}

export const parseMarkdown = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const elements: ParsedElement[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Pattern for **bold**, *italic*, and `code`
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matched = match[0];
      if (matched.startsWith('**') && matched.endsWith('**')) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-semibold text-blue-100">
            {matched.slice(2, -2)}
          </strong>
        );
      } else if (matched.startsWith('*') && matched.endsWith('*')) {
        // Italic
        parts.push(
          <em key={match.index} className="italic">
            {matched.slice(1, -1)}
          </em>
        );
      } else if (matched.startsWith('`') && matched.endsWith('`')) {
        // Inline code
        parts.push(
          <code key={match.index} className="chat-code">
            {matched.slice(1, -1)}
          </code>
        );
      }

      lastIndex = match.index + matched.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const flushList = () => {
    if (currentList) {
      elements.push({
        type: 'list',
        content: currentList.type === 'ul' ? (
          <ul className="chat-list">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <ol className="chat-list chat-list-ordered">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        )
      });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Empty line - flush list and add spacing
    if (!line) {
      flushList();
      continue;
    }

    // Heading (### Header)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      elements.push({
        type: 'heading',
        level,
        content: parseInlineMarkdown(headingMatch[2])
      });
      continue;
    }

    // Unordered list (• or - or *)
    const bulletMatch = line.match(/^[•\-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(bulletMatch[1]));
      continue;
    }

    // Ordered list (1. or 2. etc)
    const numberMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(numberMatch[1]));
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push({
      type: 'paragraph',
      content: parseInlineMarkdown(line)
    });
  }

  // Flush any remaining list
  flushList();

  // Convert to React nodes
  return elements.map((element, idx) => {
    if (element.type === 'list') {
      return <div key={idx} className="my-3">{element.content}</div>;
    }
    
    if (element.type === 'heading') {
      const HeadingTag = `h${element.level || 3}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={idx} className="chat-heading mt-4 mb-2">
          {element.content}
        </HeadingTag>
      );
    }
    
    if (element.type === 'paragraph') {
      return (
        <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
          {element.content}
        </p>
      );
    }
    
    return null;
  });
};
