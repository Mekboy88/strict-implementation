import { Paperclip, Settings2, Wallet, HelpCircle, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

const ChatToolsMenu = ({ isOpen, onClose, onOpenSettings }: ChatToolsMenuProps) => {
  if (!isOpen) return null;

  const tools = [
    { icon: Paperclip, label: "Attach File", action: () => console.log("Attach file") },
    { icon: Settings2, label: "Settings", action: () => { onOpenSettings?.(); onClose(); } },
    { icon: Wallet, label: "Wallet", action: () => console.log("Wallet") },
    { icon: HelpCircle, label: "Help", action: () => console.log("Help") },
    { icon: ShoppingBag, label: "Market", action: () => console.log("Market") },
    { icon: MessageCircle, label: "Community", action: () => console.log("Community") },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Tools Menu */}
      <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
        <div className="mx-4 rounded-2xl bg-ide-sidebar backdrop-blur-xl border border-ide-border/50 shadow-xl">
          <div className="grid grid-cols-3 gap-1 p-2">
            {tools.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={tool.action}
                className="h-16 flex-col gap-1.5 hover:bg-ide-active/5 rounded-xl transition-all duration-200 group"
              >
                <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-ide-active transition-colors" />
                <span className="text-[10px] text-muted-foreground/70 group-hover:text-ide-active/90 transition-colors">
                  {tool.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatToolsMenu;
