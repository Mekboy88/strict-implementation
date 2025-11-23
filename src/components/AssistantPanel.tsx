import { Bot, Send, Lightbulb, Wand2, Bug, BookOpen, Code2, FolderTree, Clock, Copy, FileEdit, ArrowDownUp, FilePlus, FileCode, AlertCircle, Palette, Undo2, Eye, Sparkles, Zap, CodeSquare, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SnippetsLibrary from "./SnippetsLibrary";
import PreviewHistoryPanel from "./PreviewHistoryPanel";
import EnhancedChatInput from "./chat/EnhancedChatInput";
import { Shimmer } from "./chat/Shimmer";
import { FileShimmer } from "./chat/FileShimmer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/useEditorStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { toast } from "@/hooks/use-toast";
import { ChatMessage, createUserMessage, createAssistantMessage, getWelcomeMessage } from "@/services/chat/chatService";

interface AssistantPanelProps {
  explorerOpen?: boolean;
  onToggleExplorer?: () => void;
  onOpenSettings?: () => void;
  viewMode?: 'code' | 'preview';
  onViewModeChange?: (mode: 'code' | 'preview') => void;
  initialPrompt?: string | null;
  activePlatform?: 'web' | 'mobile';
  onBuildComplete?: () => void;
}

type Message = ChatMessage;

const AssistantPanel = ({
  explorerOpen = true,
  onToggleExplorer,
  onOpenSettings,
  viewMode = 'code',
  onViewModeChange,
  initialPrompt,
  activePlatform = 'web',
  onBuildComplete,
}: AssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'snippets' | 'history'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (content: string) => {
    const userMessage = createUserMessage(content);
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = createAssistantMessage(
        "I'm currently a placeholder AI assistant. Full integration with the GPU server is coming soon!"
      );
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
    }, 1000);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
    toast({
      title: "Stopped",
      description: "AI generation stopped",
    });
  };

  return (
    <div className="h-full flex flex-col bg-ide-panel">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-ide-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-ide-active" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveView('chat')}
                  className={activeView === 'chat' ? 'bg-muted' : ''}
                >
                  <Bot className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveView('snippets')}
                  className={activeView === 'snippets' ? 'bg-muted' : ''}
                >
                  <Code2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Snippets</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveView('history')}
                  className={activeView === 'history' ? 'bg-muted' : ''}
                >
                  <Clock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeView === 'chat' && (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-ide-active flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-ide-active text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && <Shimmer />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeView === 'snippets' && <SnippetsLibrary />}
        {activeView === 'history' && <PreviewHistoryPanel onClose={() => setActiveView('chat')} />}
      </div>

      {/* Input */}
      {activeView === 'chat' && (
        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          onOpenSettings={onOpenSettings}
          isStreaming={isStreaming}
          onStopStreaming={handleStopStreaming}
        />
      )}
    </div>
  );
};

export default AssistantPanel;
