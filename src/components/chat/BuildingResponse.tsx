import { useState, useEffect, useMemo, useRef } from "react";
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
  transitionText: string;
  files: Array<{ path: string; type: string }>;
  summary: string;
  projectName: string;
}

const parseContent = (content: string): ParsedContent => {
  // Extract intro (first paragraph)
  const introMatch = content.match(/^(.+?)(?:\n\n|\n(?=Design Vision:)|$)/is);
  const intro = introMatch ? introMatch[1].trim() : "";

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
  const featuresMatch = content.match(/Features:(.+?)(?=\n\n|CREATE_FILE|```|$)/is);
  const features = featuresMatch
    ? featuresMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[•\-\*]/))
        .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Extract transition text (any text between Features and first file/code block)
  const transitionMatch = content.match(/Features:(?:.|\n)+?\n\n(.+?)(?=CREATE_FILE|```|$)/is);
  const transitionText = transitionMatch ? transitionMatch[1].trim() : "";

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

  // Extract summary (after all files)
  const summaryMatch = content.match(/(?:```[\s\S]+?```[\s\S]*?)+\n\n(.+?)$/is);
  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  // Extract project name from first line or intro
  const projectName = intro.split(/[.!?]/)[0].replace(/^(I'll create|Building|Creating)\s+/i, "").trim() || "Project";

  return { intro, designVision, features, transitionText, files, summary, projectName };
};

export const BuildingResponse = ({ content, isStreaming, isFirstProject = false }: BuildingResponseProps) => {
  const [showFileSection, setShowFileSection] = useState(false);
  
  // Use refs to lock content once it appears to prevent re-parsing
  const lockedContentRef = useRef<ParsedContent>({
    intro: "",
    designVision: [],
    features: [],
    transitionText: "",
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
    if (!locked.transitionText && parsed.transitionText) {
      locked.transitionText = parsed.transitionText;
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
    transitionText: lockedContentRef.current.transitionText || parsed.transitionText,
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

  // Show file section after features finish
  useEffect(() => {
    if (showFiles) {
      const timer = setTimeout(() => {
        setShowFileSection(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showFiles]);
  
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


      {/* Section 3: Transition Text - AI generated */}
      {displayContent.transitionText && (
        <div className="mt-4 animate-fade-in" key="transition">
          <TypewriterText
            key={`transition-${displayContent.transitionText.slice(0, 30)}`}
            text={displayContent.transitionText}
            className="text-lg text-white/90 italic break-words"
            speedMs={20}
          />
        </div>
      )}

      {/* Section 4: Design Vision */}
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

      {/* Section 5: Features */}
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

      {/* Section 6: Files dropdown - Only show when complete */}
      {showFileSection && showFiles && isComplete && (
        <div className="mt-3">
          <FilesEditedDropdown files={displayContent.files} />
        </div>
      )}

      {/* Section 7: Summary */}
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


      {/* Section 8: Completion Card - Only show on first project */}
      {isComplete && isFirstProject && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '1400ms' }}>
          <CompletionCard projectName={displayContent.projectName} />
        </div>
      )}
    </div>
  );
};
