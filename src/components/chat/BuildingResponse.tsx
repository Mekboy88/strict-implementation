import { useState, useEffect } from "react";
import { FileCode, Image, FileJson, File } from "lucide-react";
import { FilesEditedDropdown } from "./FilesEditedDropdown";
import { CompletionCard } from "./CompletionCard";

interface BuildingResponseProps {
  content: string;
  isStreaming: boolean;
  isFirstProject?: boolean;
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
    return <Image className="w-4 h-4" />;
  }
  if (path.match(/\.(tsx?|jsx?|css|scss)$/i)) {
    return <FileCode className="w-4 h-4" />;
  }
  if (path.match(/\.json$/i)) {
    return <FileJson className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
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

export const BuildingResponse = ({ content, isStreaming, isFirstProject = false }: BuildingResponseProps) => {
  const parsed = parseContent(content);
  const [visibleFiles, setVisibleFiles] = useState<number>(0);

  const showDesignVision = parsed.designVision.length > 0;
  const showFeatures = parsed.features.length > 0;
  const showFiles = parsed.files.length > 0;
  const showSummary = !isStreaming && parsed.summary;
  const isComplete = !isStreaming;

  // Animate files appearing one by one
  useEffect(() => {
    if (showFiles && !isStreaming) {
      const timer = setInterval(() => {
        setVisibleFiles(prev => {
          if (prev < parsed.files.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [showFiles, isStreaming, parsed.files.length]);

  return (
    <div className="w-full space-y-6 text-white/70">
      {/* Section 1: Intro */}
      {parsed.intro && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-sm leading-relaxed">{parsed.intro}</p>
        </div>
      )}

      {/* Section 2: Design Vision */}
      {showDesignVision && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-sm font-medium text-white/80">Design Vision:</p>
          <ul className="space-y-1.5 ml-1">
            {parsed.designVision.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm animate-fade-in" style={{ animationDelay: `${400 + i * 100}ms` }}>
                <span className="text-white/40 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 3: Features */}
      {showFeatures && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <p className="text-sm font-medium text-white/80">Features:</p>
          <ul className="space-y-1.5 ml-1">
            {parsed.features.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm animate-fade-in" style={{ animationDelay: `${600 + i * 100}ms` }}>
                <span className="text-white/40 mt-1">•</span>
                <span className="typing-animation">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4: Transition Text - Only show on first project */}
      {showFiles && isFirstProject && (
        <p className="text-sm text-white/60 italic animate-fade-in typing-animation" style={{ animationDelay: '700ms' }}>
          Let me start by creating this using a refined and beautifully structured design system.
        </p>
      )}

      {/* Section 5: Files - Show building process */}
      {showFiles && (
        <div className="space-y-3">
          {parsed.files.slice(0, visibleFiles).map((file, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 text-sm text-white/70 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {getFileIcon(file.path)}
              <span className="typing-animation">Creating {file.path}...</span>
            </div>
          ))}
          {isComplete && visibleFiles === parsed.files.length && (
            <div className="mt-3">
              <FilesEditedDropdown files={parsed.files} />
            </div>
          )}
        </div>
      )}

      {/* Section 6: Summary */}
      {showSummary && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '900ms' }}>
          <p className="text-sm leading-relaxed">{parsed.summary}</p>
        </div>
      )}

      {/* Section 7: Next Steps */}
      {isComplete && (
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <p className="text-sm font-medium text-white/80">Next Steps</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '1100ms' }}>
              <span className="text-lg">🎨</span>
              <div className="text-sm">
                <span className="font-medium text-white/80">Refine & Customize:</span>
                <span className="text-white/60"> Update colors, edit product lists, or include additional images through Visual Edits or prompts.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '1200ms' }}>
              <span className="text-lg">📋</span>
              <div className="text-sm">
                <span className="font-medium text-white/80">Plan With Prompts:</span>
                <span className="text-white/60"> Switch to plan or design mode to design features such as a shopping cart, filtering tools, or categories.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '1300ms' }}>
              <span className="text-lg">☁️</span>
              <div className="text-sm">
                <span className="font-medium text-white/80">Expand With Backend Tools:</span>
                <span className="text-white/60"> Need product storage, inventory management, or user accounts? UR-DEV Cloud lets you add these capabilities with ease.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 8: Completion Card */}
      {isComplete && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '1400ms' }}>
          <CompletionCard projectName={parsed.projectName} />
        </div>
      )}
    </div>
  );
};
