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
import { streamChat, ChatMessage as StreamChatMessage } from "@/services/chat/chatStreamService";

// Format message content with code highlighting
const formatMessageContent = (content: string): string => {
  // Extract code blocks and format them
  const codeBlockRegex = /```(\w+)?:?([^\n]*)\n([\s\S]*?)```/g;
  
  let formatted = content.replace(codeBlockRegex, (match, lang, path, code) => {
    const fileName = path.trim();
    return `<div class="my-3 rounded-lg overflow-hidden bg-slate-800/50">
      ${fileName ? `<div class="bg-slate-800/70 px-3 py-1.5 text-xs text-slate-300 font-mono">${escapeHtml(fileName)}</div>` : ''}
      <pre class="bg-slate-900/50 p-3 overflow-x-auto"><code class="text-sm text-slate-200 font-mono leading-relaxed">${escapeHtml(code.trim())}</code></pre>
    </div>`;
  });
  
  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-800/50 px-1.5 py-0.5 rounded text-sm text-slate-200 font-mono">$1</code>');
  
  // Remove bold markdown symbols and just use regular text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');
  formatted = formatted.replace(/\*([^*]+)\*/g, '$1');
  
  // Remove any remaining markdown symbols
  formatted = formatted.replace(/[_~]/g, '');
  
  // Format newlines
  formatted = formatted.replace(/\n\n/g, '<br><br>');
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

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

    // Convert messages to API format
    const apiMessages: StreamChatMessage[] = messages
      .filter(m => m.role !== 'assistant' || m.content !== getWelcomeMessage().content)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
    apiMessages.push({ role: 'user', content });

    // Gather project context
    const { activeFile, fileContent } = useEditorStore.getState();
    const { getAllFiles } = useFileSystemStore.getState();
    
    const projectFiles = getAllFiles()
      .filter(f => f.type === 'file')
      .map(f => ({ path: f.path, type: f.type }));

    const context = {
      currentFile: activeFile ? {
        path: activeFile,
        content: fileContent,
      } : undefined,
      projectFiles,
      activePlatform,
    };

    let assistantContent = '';

    try {
      await streamChat({
        messages: apiMessages,
        context,
        onDelta: (delta) => {
          assistantContent += delta;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && last.id.startsWith('streaming-')) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { ...createAssistantMessage(assistantContent), id: 'streaming-' + Date.now() }];
          });
        },
        onDone: () => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, id: `msg-${Date.now()}` } : m
              );
            }
            return prev;
          });
          setIsStreaming(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to get AI response",
            variant: "destructive",
          });
          setIsStreaming(false);
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to AI service",
        variant: "destructive",
      });
      setIsStreaming(false);
    }
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
                  <div className="w-7 h-7 rounded-full bg-slate-700/70 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
                <div
                  className={`w-full ${
                    message.role === 'user'
                      ? 'bg-slate-700/40 px-4 py-3 rounded-2xl'
                      : ''
                  }`}
                >
                  <div 
                    className="text-[13px] text-slate-200 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content)
                    }}
                  />
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
