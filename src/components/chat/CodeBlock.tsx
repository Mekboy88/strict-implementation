import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode } from '@/utils/syntaxHighlighter';

interface CodeBlockProps {
  code: string;
  language: string;
  filePath?: string;
  isStreaming?: boolean;
}

export const CodeBlock = ({ code, language, filePath, isStreaming = false }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayCount(code.length);
      return;
    }

    const interval = setInterval(() => {
      setDisplayCount((prev) => {
        if (prev < code.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 8); // Faster for code: 8ms per character

    return () => clearInterval(interval);
  }, [code.length, isStreaming, code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get displayed code (slice during streaming, full after)
  const displayedCode = isStreaming ? code.slice(0, displayCount) : code;
  const tokens = highlightCode(displayedCode, language);

  return (
    <div className="w-full max-w-full my-4 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shadow-lg">
      {filePath && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-700">
          <span className="text-sm text-neutral-400 font-mono">📄 {filePath}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-neutral-700 rounded transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-neutral-400" />
            )}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          <code>
            {tokens.map((token, index) => (
              <span key={index} className={token.className}>
                {token.text}
              </span>
            ))}
            {isStreaming && displayCount < code.length && (
              <span className="streaming-cursor inline-block w-1 h-4 bg-primary ml-0.5" />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};
