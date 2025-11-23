import { Bug, Code2, FileText, Zap, Search, RotateCcw, FilePlus, TestTube } from "lucide-react";

interface SlashCommandPaletteProps {
  onSelect: (command: string) => void;
  onClose: () => void;
}

const SlashCommandPalette = ({ onSelect, onClose }: SlashCommandPaletteProps) => {
  const commands = [
    { id: "/refactor", icon: RotateCcw, label: "Refactor", description: "Improve code structure" },
    { id: "/debug", icon: Bug, label: "Debug", description: "Find and fix issues" },
    { id: "/explain", icon: FileText, label: "Explain", description: "Explain selected code" },
    { id: "/optimize", icon: Zap, label: "Optimize", description: "Improve performance" },
    { id: "/search", icon: Search, label: "Search", description: "Search codebase" },
    { id: "/rewrite", icon: Code2, label: "Rewrite", description: "Rewrite with new approach" },
    { id: "/generate-component", icon: FilePlus, label: "Generate Component", description: "Create new component" },
    { id: "/test", icon: TestTube, label: "Test", description: "Generate test cases" },
    { id: "/fix-errors", icon: Bug, label: "Fix Errors", description: "Auto-fix errors" },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute bottom-full left-4 mb-2 w-80 bg-ide-panel border border-ide-border rounded-lg shadow-xl z-50 animate-scale-in overflow-hidden">
        <div className="px-3 py-2 border-b border-ide-border">
          <p className="text-xs text-muted-foreground">Slash Commands</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {commands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd.id)}
                className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-ide-hover transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-ide-active mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground font-medium">{cmd.label}</div>
                  <div className="text-xs text-muted-foreground">{cmd.description}</div>
                </div>
                <kbd className="px-1.5 py-0.5 bg-ide-sidebar border border-ide-border rounded text-[10px] text-muted-foreground">
                  {cmd.id}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SlashCommandPalette;
