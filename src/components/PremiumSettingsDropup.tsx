import { X, User, Mail, Lock, Github, Key, Trash2, Palette, Type, AlignLeft, Save, WrapText, Brain, Zap, Shield, Wand2, Code2, Download, Upload, RotateCcw, Layout, Clock, Info } from "lucide-react";
import { useState } from "react";

interface PremiumSettingsDropupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumSettingsDropup = ({ isOpen, onClose }: PremiumSettingsDropupProps) => {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [autosave, setAutosave] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [aiModel, setAiModel] = useState("ur-dev-core");
  const [aiSafetyMode, setAiSafetyMode] = useState(true);
  const [aiAutoFix, setAiAutoFix] = useState(false);
  const [aiAutoExplain, setAiAutoExplain] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drop-up Modal */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-4xl animate-[slide-up_180ms_ease-out] opacity-0 [animation-fill-mode:forwards]">
        <div className="bg-ide-panel/95 backdrop-blur-xl rounded-[18px] shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/5">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable Grid */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Account Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide mb-4">Account</h3>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <User className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Profile Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Mail className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Change Email</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Lock className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Github className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Linked Accounts</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/85 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150">
                  <Trash2 className="w-[18px] h-[18px]" />
                  <span className="text-sm">Delete Account</span>
                </button>
              </div>

              {/* Editor Preferences Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide mb-4">Editor Preferences</h3>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme
                  </label>
                  <select 
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full px-3 py-2 bg-ide-sidebar border border-white/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="sapphire">Sapphire</option>
                    <option value="midnight">Midnight</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Size: {fontSize}px
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="24" 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    Line Height: {lineHeight}
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="2.5" 
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-all duration-150">
                  <div className="flex items-center gap-2">
                    <Save className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm text-foreground/85">Autosave</span>
                  </div>
                  <button 
                    onClick={() => setAutosave(!autosave)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${autosave ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autosave ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-all duration-150">
                  <div className="flex items-center gap-2">
                    <WrapText className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm text-foreground/85">Word Wrap</span>
                  </div>
                  <button 
                    onClick={() => setWordWrap(!wordWrap)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${wordWrap ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${wordWrap ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>

              {/* UR-DEV AI Engine Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide mb-4">UR-DEV AI Engine</h3>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Model
                  </label>
                  <select 
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-3 py-2 bg-ide-sidebar border border-white/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ur-dev-core">UR-DEV Core</option>
                    <option value="ur-dev-deep">UR-DEV Deep</option>
                    <option value="chatgpt">ChatGPT</option>
                    <option value="local">Local Model</option>
                  </select>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Zap className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">AI Personality</span>
                </button>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-all duration-150">
                  <div className="flex items-center gap-2">
                    <Shield className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm text-foreground/85">AI Safety Mode</span>
                  </div>
                  <button 
                    onClick={() => setAiSafetyMode(!aiSafetyMode)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${aiSafetyMode ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiSafetyMode ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-all duration-150">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm text-foreground/85">AI Auto-Fix</span>
                  </div>
                  <button 
                    onClick={() => setAiAutoFix(!aiAutoFix)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${aiAutoFix ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiAutoFix ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-all duration-150">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm text-foreground/85">AI Auto-Explain Code</span>
                  </div>
                  <button 
                    onClick={() => setAiAutoExplain(!aiAutoExplain)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${aiAutoExplain ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${aiAutoExplain ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150 border border-primary/20">
                  <Brain className="w-[18px] h-[18px] text-primary" />
                  <span className="text-sm font-medium">AI Diagnose App Issues</span>
                </button>
              </div>

              {/* Project Utilities Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide mb-4">Project Utilities</h3>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Download className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Export Project</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Upload className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Import Project</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Trash2 className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Clear Local State</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Layout className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Reset UI Layout</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <RotateCcw className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Backup & Restore Snapshots</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                  <Clock className="w-[18px] h-[18px] text-primary/70" />
                  <span className="text-sm">Open Preview History</span>
                </button>
              </div>

              {/* About Section */}
              <div className="space-y-3 md:col-span-2">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wide mb-4">About</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                    <Info className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm">Version 1.0.0</span>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                    <Key className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm">Update Notes</span>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/85 hover:bg-primary/5 hover:text-foreground transition-all duration-150">
                    <Code2 className="w-[18px] h-[18px] text-primary/70" />
                    <span className="text-sm">System Logs</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
};

export default PremiumSettingsDropup;