import { useState, useRef, useEffect } from "react";
import { Mic, Sparkles, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MainActionsDrawer from "./MainActionsDrawer";
import ChatToolsMenu from "./ChatToolsMenu";

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void;
  hasSelectedCode?: boolean;
  onOpenSettings?: () => void;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
}

const EnhancedChatInputCopy = ({ 
  onSendMessage, 
  hasSelectedCode = false, 
  onOpenSettings, 
  isStreaming = false, 
  onStopStreaming 
}: EnhancedChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showMainDrawer, setShowMainDrawer] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [sendingSeconds, setSendingSeconds] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const placeholders = isListening 
    ? ["Listening..."]
    : [
        "Tell me what to build… (e.g., 'Create a landing page')",
        "Build a dashboard page…",
        "Create a login page…",
        "Make a contact form…",
      ];

  useEffect(() => {
    if (!isListening) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isListening, placeholders.length]);

  useEffect(() => {
    if (isStreaming) {
      setSendingSeconds(0);
      sendingIntervalRef.current = setInterval(() => {
        setSendingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (sendingIntervalRef.current) {
        clearInterval(sendingIntervalRef.current);
        sendingIntervalRef.current = null;
      }
    }
    
    return () => {
      if (sendingIntervalRef.current) {
        clearInterval(sendingIntervalRef.current);
      }
    };
  }, [isStreaming]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleStopSending = () => {
    onStopStreaming?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative p-4 border-t border-ide-border bg-ide-panel">
      <ChatToolsMenu 
        isOpen={showToolsMenu} 
        onClose={() => setShowToolsMenu(false)}
        onOpenSettings={onOpenSettings}
      />
      
      <MainActionsDrawer
        open={showMainDrawer}
        onOpenChange={setShowMainDrawer}
        onSelectAction={(action) => {
          setMessage(`/${action} `);
          textareaRef.current?.focus();
        }}
      />

      <div className={`relative rounded-2xl border transition-all duration-200 ${
        isFocused ? "border-ide-active shadow-lg" : "border-ide-border"
      }`}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholders[placeholderIndex]}
          className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tools</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowMainDrawer(true)}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStopSending}
                className="h-8"
              >
                Stop ({sendingSeconds}s)
              </Button>
            )}
            
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isStreaming}
              size="sm"
              className="h-8"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatInputCopy;
