import { useMemo } from "react";
import { FileText, Folder, FileCode, Database, Settings, Package, File, Image, FileJson } from "lucide-react";
import { FilesEditedDropdown } from "./FilesEditedDropdown";
import { CompletionCard } from "./CompletionCard";
import { useChatAnimation } from "@/hooks/useChatAnimation";
import { MessageType, FileMetadata } from "@/types/chat";
import { 
  extractFileMetadata, 
  extractProjectName, 
  extractDesignVision,
  extractFeatures,
  generateIntroText,
  detectBuildAction
} from "@/services/chat/messageClassifier";

interface BuildingResponseProps {
  content: string;
  isStreaming: boolean;
  isFirstProject: boolean;
  messageType?: MessageType;
}

interface ParsedContent {
  intro: string;
  designVision: string[];
  features: string[];
  files: Array<{ path: string; type: string }>;
  summary: string;
  projectName: string;
}

const getFileIcon = (path: string) => {
  if (path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
    return Image;
  }
  if (path.match(/\.(tsx?|jsx?)$/i)) {
    return FileCode;
  }
  if (path.match(/\.(css|scss)$/i)) {
    return Settings;
  }
  if (path.match(/\.json$/i)) {
    return FileJson;
  }
  if (path.includes('package')) {
    return Package;
  }
  if (path.includes('src/')) {
    return Folder;
  }
  return FileText;
};

const parseContent = (content: string): ParsedContent => {
  // Extract intro (first paragraph)
  const introMatch = content.match(/^I'll create\s+(.+?)(?:\n\n|\n(?=Design Vision:)|$)/is);
  const intro = introMatch ? `I'll create ${introMatch[1].trim()}` : "";

  // Extract design vision items
  const designVisionMatch = content.match(/Design Vision:(.+?)(?=Features:|$)/is);
  const designVision = designVisionMatch
    ? designVisionMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[•\-\*]/))
        .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Extract features
  const featuresMatch = content.match(/Features:(.+?)(?=Let me start|$)/is);
  const features = featuresMatch
    ? featuresMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[•\-\*]/))
        .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Extract files from code blocks
  const codeBlockRegex = /```[\w]*\s*(?:\/\/\s*)?([^\n]+)\n/g;
  const files: Array<{ path: string; type: string }> = [];
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const path = match[1].trim();
    if (path && !path.includes("```")) {
      files.push({ path, type: "code" });
    }
  }

  // Extract summary (Created a...)
  const summaryMatch = content.match(/Created\s+a\s+(.+?)(?:\n\n|$)/is);
  const summary = summaryMatch ? `Created a ${summaryMatch[1].trim()}` : "";

  // Extract project name from first line or intro
  const projectName = intro.replace("I'll create ", "").split(".")[0] || "Project";

  return { intro, designVision, features, files, summary, projectName };
};

export const BuildingResponse = ({ 
  content, 
  isStreaming, 
  isFirstProject,
  messageType = 'first-build' 
}: BuildingResponseProps) => {
  // Parse content and extract metadata
  const parsedContent = useMemo(() => parseContent(content), [content]);
  const files = useMemo(() => extractFileMetadata(content), [content]);
  const projectName = useMemo(() => extractProjectName(content), [content]);
  const buildAction = useMemo(() => detectBuildAction(content), [content]);
  
  // Use animation hook
  const { currentFileIndex } = useChatAnimation(files, isStreaming);

  // Generate dynamic intro text
  const introText = useMemo(() => {
    return generateIntroText(messageType, projectName, buildAction);
  }, [messageType, projectName, buildAction]);

  const isComplete = !isStreaming;
  const shouldShowIntro = messageType === 'first-build' || (messageType === 'build' && buildAction);
  const shouldShowFileCreation = isStreaming && files.length > 0;
  const shouldShowDropdown = isComplete && files.length > 0;

  const showDesignVision = parsedContent.designVision.length > 0;
  const showFeatures = parsedContent.features.length > 0;
  const showFiles = parsedContent.files.length > 0;
  const showSummary = !isStreaming && parsedContent.summary;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Introduction */}
      {shouldShowIntro && introText && (
        <div className="typing-animation">
          <p className="text-base text-slate-200 leading-relaxed">
            {introText}
          </p>
        </div>
      )}

      {/* Design Vision */}
      {showDesignVision && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-base font-medium text-white/80 typing-animation">Design Vision:</p>
          <ul className="space-y-2 ml-1">
            {parsedContent.designVision.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-base animate-fade-in typing-animation" style={{ animationDelay: `${400 + i * 100}ms` }}>
                <span className="text-white/40 mt-1">•</span>
                <span className="text-slate-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {showFeatures && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <p className="text-base font-medium text-white/80 typing-animation">Features:</p>
          <ul className="space-y-2 ml-1">
            {parsedContent.features.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-base animate-fade-in typing-animation" style={{ animationDelay: `${600 + i * 100}ms` }}>
                <span className="text-white/40 mt-1">•</span>
                <span className="text-slate-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transition Text - Only on first project */}
      {showFiles && isFirstProject && messageType === 'first-build' && (
        <p className="text-base text-white/60 italic animate-fade-in typing-animation" style={{ animationDelay: '700ms' }}>
          Let me start by creating this using a refined and beautifully structured design system.
        </p>
      )}

      {/* File creation progress - synchronized with streaming */}
      {shouldShowFileCreation && currentFileIndex >= 0 && (
        <div className="space-y-3">
          {files.slice(0, currentFileIndex + 1).map((file, index) => {
            const Icon = getFileIcon(file.path);
            const isCurrentFile = index === currentFileIndex;
            const isCreating = file.status === 'creating';
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 text-base transition-all duration-300 ${
                  isCurrentFile && isCreating ? 'text-white typing-animation' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrentFile && isCreating ? 'animate-pulse' : ''}`} />
                <span>
                  {isCreating ? 'Creating' : 'Created'} {file.path}...
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Files dropdown - after completion */}
      {shouldShowDropdown && (
        <div className="mt-3">
          <FilesEditedDropdown files={parsedContent.files} />
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="space-y-2 animate-fade-in typing-animation" style={{ animationDelay: '900ms' }}>
          <p className="text-base leading-relaxed text-slate-200">{parsedContent.summary}</p>
        </div>
      )}

      {/* Next Steps */}
      {isComplete && (
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <p className="text-base font-medium text-white/80 typing-animation">Next Steps</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 animate-fade-in typing-animation" style={{ animationDelay: '1100ms' }}>
              <span className="text-xl">🎨</span>
              <div className="text-base text-slate-200">
                <span className="font-medium text-white/80">Refine & Customize:</span>
                <span className="text-white/60"> Update colors, edit product lists, or include additional images through Visual Edits or prompts.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in typing-animation" style={{ animationDelay: '1200ms' }}>
              <span className="text-xl">📋</span>
              <div className="text-base text-slate-200">
                <span className="font-medium text-white/80">Plan With Prompts:</span>
                <span className="text-white/60"> Switch to plan or design mode to design features such as a shopping cart, filtering tools, or categories.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in typing-animation" style={{ animationDelay: '1300ms' }}>
              <span className="text-xl">☁️</span>
              <div className="text-base text-slate-200">
                <span className="font-medium text-white/80">Expand With Backend Tools:</span>
                <span className="text-white/60"> Need product storage, inventory management, or user accounts? UR-DEV Cloud lets you add these capabilities with ease.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Card */}
      {isComplete && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '1400ms' }}>
          <CompletionCard projectName={parsedContent.projectName} />
        </div>
      )}
    </div>
  );
};
