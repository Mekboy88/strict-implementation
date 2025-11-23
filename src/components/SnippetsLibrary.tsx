import { 
  Code2, 
  FileCode, 
  Database, 
  Settings, 
  ChevronRight,
  Copy,
  Sparkles,
  Bot
} from "lucide-react";
import { useState } from "react";

interface Snippet {
  title: string;
  code: string;
  language: string;
}

interface SnippetCategory {
  name: string;
  icon: any;
  snippets: Snippet[];
}

const snippetCategories: SnippetCategory[] = [
  {
    name: "HTML Templates",
    icon: FileCode,
    snippets: [
      {
        title: "Landing Page Hero",
        language: "html",
        code: `<section class="hero">
  <h1>Welcome</h1>
  <p>Your tagline here</p>
  <button>Get Started</button>
</section>`
      },
      {
        title: "Card Component",
        language: "html",
        code: `<div class="card">
  <img src="image.jpg" alt="Card" />
  <h3>Card Title</h3>
  <p>Card description</p>
</div>`
      },
      {
        title: "Navigation Bar",
        language: "html",
        code: `<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>`
      }
    ]
  },
  {
    name: "React Components",
    icon: Code2,
    snippets: [
      {
        title: "Functional Component",
        language: "tsx",
        code: `const MyComponent = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};`
      },
      {
        title: "useState Hook",
        language: "tsx",
        code: `const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>`
      },
      {
        title: "useEffect Hook",
        language: "tsx",
        code: `useEffect(() => {
  // Your effect here
  return () => {
    // Cleanup
  };
}, [dependencies]);`
      }
    ]
  },
  {
    name: "API Calls",
    icon: Database,
    snippets: [
      {
        title: "Fetch GET Request",
        language: "typescript",
        code: `const response = await fetch('/api/data');
const data = await response.json();
console.log(data);`
      },
      {
        title: "Fetch POST Request",
        language: "typescript",
        code: `const response = await fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' }),
});`
      },
      {
        title: "Async Function",
        language: "typescript",
        code: `const fetchData = async () => {
  try {
    const data = await apiCall();
    return data;
  } catch (error) {
    console.error(error);
  }
};`
      }
    ]
  },
  {
    name: "Config Templates",
    icon: Settings,
    snippets: [
      {
        title: "Tailwind Config",
        language: "typescript",
        code: `export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
};`
      },
      {
        title: "Vite Config",
        language: "typescript",
        code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`
      },
      {
        title: "TSConfig",
        language: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}`
      }
    ]
  }
];

const SnippetsLibrary = ({ onSwitchToAssistant }: { onSwitchToAssistant?: () => void }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const copySnippet = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedSnippet(snippet.title);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="h-full bg-ide-sidebar border-l border-ide-border flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b border-ide-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-ide-active" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            AI Snippets
          </h2>
        </div>
        {onSwitchToAssistant && (
          <div className="flex border-t border-ide-border">
            <button
              onClick={onSwitchToAssistant}
              className="flex-1 px-4 py-2 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-ide-hover flex items-center justify-center gap-1"
            >
              <Bot className="w-3 h-3" />
              Chat
            </button>
            <button
              className="flex-1 px-4 py-2 text-xs font-medium bg-ide-editor text-ide-active border-b-2 border-ide-active/50 flex items-center justify-center gap-1"
            >
              <Code2 className="w-3 h-3" />
              Snippets
            </button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {snippetCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.name;

          return (
            <div key={category.name} className="border-b border-ide-border">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-ide-hover transition-colors group"
              >
                <ChevronRight 
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
                <Icon className="w-4 h-4 text-ide-active/70" />
                <span className="text-sm font-medium text-foreground group-hover:text-ide-active transition-colors">
                  {category.name}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {category.snippets.length}
                </span>
              </button>

              {/* Snippets */}
              {isExpanded && (
                <div className="bg-ide-panel">
                  {category.snippets.map((snippet) => (
                    <div
                      key={snippet.title}
                      className="px-4 py-3 border-t border-ide-border hover:bg-ide-hover transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">
                          {snippet.title}
                        </span>
                        <button
                          onClick={() => copySnippet(snippet)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-ide-active/10 rounded transition-all"
                          title="Copy snippet"
                        >
                          <Copy className="w-3 h-3 text-ide-active/70" />
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-muted-foreground bg-ide-editor p-2 rounded border border-ide-border overflow-x-auto">
                        {snippet.code}
                      </pre>
                      {copiedSnippet === snippet.title && (
                        <span className="text-xs text-ide-active/90 mt-1 block">
                          ✓ Copied!
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SnippetsLibrary;
