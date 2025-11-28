import { useEffect, useState } from 'react';
import { filterCodeBlocks } from '@/utils/chat/codeBlockFilter';

interface StreamingTextProps {
  content: string;
  isComplete: boolean;
}

export const StreamingText = ({ content, isComplete }: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Display text as it arrives, filtering out code blocks
  useEffect(() => {
    const filtered = filterCodeBlocks(content);
    setDisplayedText(filtered.text);
  }, [content]);

  // Blink cursor while streaming
  useEffect(() => {
    if (isComplete) {
      setShowCursor(false);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
      {displayedText}
      {!isComplete && (
        <span className={`inline-block w-[2px] h-5 bg-primary ml-0.5 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </div>
  );
};
