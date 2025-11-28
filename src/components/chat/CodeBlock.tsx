import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode } from '@/utils/syntaxHighlighter';

interface CodeBlockProps {
  code: string;
  language: string;
  filePath?: string;
}

export const CodeBlock = ({ code, language, filePath }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokens = highlightCode(code, language);

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800/80 shadow-lg">
      {filePath && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-700">
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
        <pre className="font-mono text-sm leading-relaxed">
          <code>
            {tokens.map((token, index) => (
              <span key={index} className={token.className}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
