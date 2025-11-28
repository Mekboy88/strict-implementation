import { useState, useEffect, useMemo, useRef } from "react";
import { FileCode, Image, FileJson, File } from "lucide-react";
import { FilesEditedDropdown } from "./FilesEditedDropdown";
import { CompletionCard } from "./CompletionCard";
import { TypewriterText } from "./TypewriterText";

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
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [showFileSection, setShowFileSection] = useState(false);
  
  // Use refs to lock content once it appears to prevent re-parsing
  const lockedContentRef = useRef<ParsedContent>({
    intro: "",
    designVision: [],
    features: [],
    files: [],
    summary: "",
    projectName: ""
  });

  // Parse content without side effects in useMemo
  const parsed = useMemo(() => {
    return parseContent(content);
  }, [content]);

  // Lock content sections once they appear (Step 4: Move side effects to useEffect)
  useEffect(() => {
    const locked = lockedContentRef.current;
    
    if (!locked.intro && parsed.intro) {
      locked.intro = parsed.intro;
    }
    if (!locked.projectName && parsed.projectName) {
      locked.projectName = parsed.projectName;
    }
    if (locked.designVision.length === 0 && parsed.designVision.length > 0) {
      locked.designVision = [...parsed.designVision];
    }
    if (locked.features.length === 0 && parsed.features.length > 0) {
      locked.features = [...parsed.features];
    }
    if (locked.files.length === 0 && parsed.files.length > 0) {
      locked.files = [...parsed.files];
    }
    if (!locked.summary && parsed.summary) {
      locked.summary = parsed.summary;
    }
  }, [parsed]);

  // Use locked content for rendering (Step 2: Graceful fallback)
  const displayContent = {
    intro: lockedContentRef.current.intro || parsed.intro,
    designVision: lockedContentRef.current.designVision.length > 0 ? lockedContentRef.current.designVision : parsed.designVision,
    features: lockedContentRef.current.features.length > 0 ? lockedContentRef.current.features : parsed.features,
    files: lockedContentRef.current.files.length > 0 ? lockedContentRef.current.files : parsed.files,
    summary: lockedContentRef.current.summary || parsed.summary,
    projectName: lockedContentRef.current.projectName || parsed.projectName
  };

  // Derive all boolean values BEFORE useEffect hooks
  const hasStructuredContent = displayContent.intro || displayContent.designVision.length > 0 || 
                                displayContent.features.length > 0 || displayContent.files.length > 0;
  const showDesignVision = displayContent.designVision.length > 0;
  const showFeatures = displayContent.features.length > 0;
  const showFiles = displayContent.files.length > 0;
  const showSummary = !isStreaming && displayContent.summary;
  const isComplete = !isStreaming;

  // Show file section after transition text finishes (approximately 3 seconds for the typewriter)
  useEffect(() => {
    if (showFiles && isFirstProject) {
      const timer = setTimeout(() => {
        setShowFileSection(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (showFiles && !isFirstProject) {
      setShowFileSection(true);
    }
  }, [showFiles, isFirstProject]);

  // Sync current file with streaming progress
  useEffect(() => {
    if (isStreaming && showFiles) {
      setCurrentFileIndex(displayContent.files.length - 1);
    }
  }, [displayContent.files.length, isStreaming, showFiles]);
  
  // NOW the early return is safe - all hooks have been called
  if (!hasStructuredContent) {
    return (
      <div className="w-full space-y-3 text-white/70">
        <TypewriterText 
          key="plain-content"
          text={content} 
          className="text-base leading-relaxed break-words" 
          speedMs={20} 
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 text-white/70">
      {/* Section 1: Intro */}
      {displayContent.intro && (
        <div className="space-y-2 animate-fade-in" key="intro">
          <TypewriterText 
            key={`intro-${displayContent.intro.slice(0, 30)}`}
            text={displayContent.intro} 
            className="text-base leading-relaxed break-words" 
            speedMs={20} 
          />
        </div>
      )}

      {/* Section 2: Transition Text - Only show on first project */}
      {isFirstProject && (
        <div className="mt-4" key="transition">
          <TypewriterText
            key="transition-text"
            text="Let me start by creating this using a refined and beautifully structured design system."
            className="text-lg text-white/90 italic break-words"
            speedMs={20}
          />
        </div>
      )}

      {/* Section 3: Design Vision */}
      {showDesignVision && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '300ms' }} key="design-vision">
          <p className="text-base font-medium text-white/80">Design Vision:</p>
          <ul className="space-y-2 ml-1">
            {displayContent.designVision.map((item, i) => (
              <li
                key={`dv-${item.slice(0, 30)}-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <span className="text-white/40 mt-1">•</span>
                <TypewriterText 
                  key={`dv-text-${item.slice(0, 30)}`}
                  text={item} 
                  className="inline" 
                  speedMs={15} 
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4: Features */}
      {showFeatures && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '500ms' }} key="features">
          <p className="text-base font-medium text-white/80">Features:</p>
          <ul className="space-y-2 ml-1">
            {displayContent.features.map((item, i) => (
              <li
                key={`ft-${item.slice(0, 30)}-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <span className="text-white/40 mt-1">•</span>
                <TypewriterText 
                  key={`ft-text-${item.slice(0, 30)}`}
                  text={item} 
                  className="inline" 
                  speedMs={15} 
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 5: Files - Show building process while streaming - ONLY AFTER TRANSITION TEXT */}
      {showFileSection && showFiles && isStreaming && displayContent.files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-medium text-white/80 animate-fade-in typing-animation">
            {getFileIcon(displayContent.files[currentFileIndex]?.path || '')}
            <span className="relative inline-block bg-gradient-to-r from-white/40 via-white to-white/40 bg-[length:200%_100%] animate-shimmer bg-clip-text text-transparent">
              Creating {displayContent.files[currentFileIndex]?.path}...
            </span>
          </div>
        </div>
      )}
      
      {/* Section 5b: Files dropdown - Only show when complete */}
      {showFileSection && showFiles && isComplete && (
        <div className="mt-3">
          <FilesEditedDropdown files={displayContent.files} />
        </div>
      )}

      {/* Section 6: Summary */}
      {showSummary && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '900ms' }} key="summary">
          <TypewriterText 
            key={`summary-${displayContent.summary.slice(0, 30)}`}
            text={displayContent.summary} 
            className="text-base leading-relaxed" 
            speedMs={20} 
          />
        </div>
      )}

      {/* Section 7: Next Steps - Only show on first project */}
      {isComplete && isFirstProject && (
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '1000ms' }} key="next-steps-section">
          <p className="text-base font-medium text-white/80">Next Steps</p>
          <div className="space-y-4">
            <div className="flex items-start animate-fade-in" style={{ animationDelay: '1100ms' }}>
              <div className="text-base">
                <span className="text-lg font-semibold text-white">Refine &amp; Customize: </span>
                <span className="text-white/80">Update colors, edit product lists, or include additional images through Visual Edits or prompts.</span>
              </div>
            </div>
            <div className="flex items-start animate-fade-in" style={{ animationDelay: '1200ms' }}>
              <div className="text-base">
                <span className="text-lg font-semibold text-white">Plan With Prompts: </span>
                <span className="text-white/80">Switch to plan or design mode to design features such as a shopping cart, filtering tools, or categories.</span>
              </div>
            </div>
            <div className="flex items-start animate-fade-in" style={{ animationDelay: '1300ms' }}>
              <div className="text-base">
                <span className="text-lg font-semibold text-white">Expand With Backend Tools: </span>
                <span className="text-white/80">Need product storage, inventory management, or user accounts? UR-DEV Cloud lets you add these capabilities with ease.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 8: Completion Card - Only show on first project */}
      {isComplete && isFirstProject && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '1400ms' }}>
          <CompletionCard projectName={displayContent.projectName} />
        </div>
      )}
    </div>
  );
};
