import { Sparkles, Zap, Code2, Palette } from "lucide-react";

interface WelcomeExperienceProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  { icon: Code2, label: 'Landing Page', prompt: 'Create a modern landing page with hero section and features' },
  { icon: Palette, label: 'Dashboard', prompt: 'Build a dashboard with charts and analytics' },
  { icon: Zap, label: 'Login Form', prompt: 'Create a login form with validation' },
  { icon: Sparkles, label: 'Blog', prompt: 'Build a blog with posts and categories' },
];

export const WelcomeExperience = ({ onSuggestionClick }: WelcomeExperienceProps) => {
  return (
    <div className="flex items-center justify-center py-12 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-8 px-4">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/30 animate-bounce">
            <Sparkles className="h-10 w-10 text-sky-400" />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Build Something Amazing?
          </h2>
          
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Tell me what you want to create and I'll build it for you. From landing pages to full applications.
          </p>
        </div>

        {/* Quick Start Suggestions */}
        <div className="space-y-3">
          <p className="text-sm text-slate-500 font-medium">Quick start:</p>
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => onSuggestionClick(suggestion.prompt)}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all hover:scale-105"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-sky-500/20 to-violet-500/20 group-hover:from-sky-500/30 group-hover:to-violet-500/30 transition-colors">
                  <suggestion.icon className="h-6 w-6 text-sky-400" />
                </div>
                <span className="text-sm font-medium text-slate-200 group-hover:text-sky-300 transition-colors">
                  {suggestion.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">
            💡 <span className="font-medium text-slate-300">Tip:</span> Be specific about what you want. 
            Include details about design, functionality, and any specific features you need.
          </p>
        </div>
      </div>
    </div>
  );
};
