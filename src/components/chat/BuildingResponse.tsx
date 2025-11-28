import { useMemo } from "react";
import { FileCode, Image, FileJson, File, Loader2 } from "lucide-react";
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
  const parsed = useMemo(() => parseContent(content), [content]);

  const showDesignVision = parsed.designVision.length > 0;
  const showFeatures = parsed.features.length > 0;
  const showFiles = parsed.files.length > 0;
  const showSummary = !isStreaming && parsed.summary;
  const isComplete = !isStreaming;

  // Track which file is currently being created
  const currentFile = isStreaming && showFiles ? parsed.files[parsed.files.length - 1] : null;

  return (
    <div className="w-full space-y-6 text-white/70">
      {/* Section 1: Intro */}
      {parsed.intro && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-lg leading-relaxed">{parsed.intro}</p>
        </div>
      )}

      {/* Section 2: Design Vision */}
      {showDesignVision && (
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-lg font-semibold text-white/90">Design Vision:</p>
          <ul className="space-y-2.5 ml-1">
            {parsed.designVision.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base animate-fade-in" style={{ animationDelay: `${300 + i * 100}ms` }}>
                <span className="text-white/50 mt-1 text-lg">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 3: Features */}
      {showFeatures && (
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-lg font-semibold text-white/90">Features:</p>
          <ul className="space-y-2.5 ml-1">
            {parsed.features.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base animate-fade-in" style={{ animationDelay: `${500 + i * 100}ms` }}>
                <span className="text-white/50 mt-1 text-lg">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4: Transition Text - Only show on first project */}
      {showFiles && isFirstProject && !isComplete && (
        <p className="text-base text-white/70 italic animate-fade-in" style={{ animationDelay: '600ms' }}>
          Let me start by creating this using a refined and beautifully structured design system.
        </p>
      )}

      {/* Section 5: File Building Animation - Show ONLY while streaming */}
      {showFiles && isStreaming && currentFile && (
        <div className="flex items-center gap-2.5 text-base text-white/80 animate-fade-in">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Creating:</span>
          <span className="font-mono text-sm bg-white/10 px-2 py-0.5 rounded">{currentFile.path}</span>
        </div>
      )}
      
      {/* Section 5b: Files Dropdown - Show ONLY when complete */}
      {showFiles && isComplete && (
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <FilesEditedDropdown files={parsed.files} />
        </div>
      )}

      {/* Section 6: Summary */}
      {showSummary && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-lg leading-relaxed">{parsed.summary}</p>
        </div>
      )}

      {/* Section 7: Next Steps */}
      {isComplete && (
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-lg font-semibold text-white/90">Next Steps</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <span className="text-2xl">🎨</span>
              <div className="text-base leading-relaxed">
                <span className="font-semibold text-white/90">Refine & Customize:</span>
                <span className="text-white/70"> Update colors, edit product lists, or include additional images through Visual Edits or prompts.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <span className="text-2xl">📋</span>
              <div className="text-base leading-relaxed">
                <span className="font-semibold text-white/90">Plan With Prompts:</span>
                <span className="text-white/70"> Switch to plan or design mode to design features such as a shopping cart, filtering tools, or categories.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <span className="text-2xl">☁️</span>
              <div className="text-base leading-relaxed">
                <span className="font-semibold text-white/90">Expand With Backend Tools:</span>
                <span className="text-white/70"> Need product storage, inventory management, or user accounts? UR-DEV Cloud lets you add these capabilities with ease.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 8: Completion Card */}
      {isComplete && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '700ms' }}>
          <CompletionCard projectName={parsed.projectName} />
        </div>
      )}
    </div>
  );
};
