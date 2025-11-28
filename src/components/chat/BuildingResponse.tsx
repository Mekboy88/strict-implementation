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
  // FIRST: Strip ALL code blocks from content before parsing text
  const cleanContent = content.replace(/```[\s\S]*?```/g, '[CODE_BLOCK]');
  
  // Extract intro (first paragraph) - stop at Design Vision, Features, or code markers
  const introMatch = cleanContent.match(/^(.+?)(?:\n\n|\n(?=Design Vision:)|(?=Features:)|(?=\[CODE_BLOCK\])|$)/is);
  const intro = introMatch ? introMatch[1].trim() : "";

  // Extract design vision items
  const designVisionMatch = cleanContent.match(/Design Vision:(.+?)(?=Features:|$)/is);
  const designVision = designVisionMatch
    ? designVisionMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[•\-\*]/))
        .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Extract features
  const featuresMatch = cleanContent.match(/Features:(.+?)(?=\n\n|CREATE_FILE|\[CODE_BLOCK\]|$)/is);
  const features = featuresMatch
    ? featuresMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[•\-\*]/))
        .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Extract transition text (any text between Features and first code block marker)
  const transitionMatch = cleanContent.match(/Features:(?:.|\n)+?\n\n(.+?)(?=\[CODE_BLOCK\]|$)/is);
  const transitionText = transitionMatch ? transitionMatch[1].trim() : "";

  // Extract files from ORIGINAL content (not cleaned) to preserve file paths
  const codeBlockRegex = /```[\w]*\s*(?:\/\/\s*)?([^\n]+)\n/g;
  const files: Array<{ path: string; type: string }> = [];
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const path = match[1].trim();
    if (path && !path.includes("```")) {
      files.push({ path, type: "code" });
    }
  }

  // Extract summary (after all code block markers) - clean any remaining code
  const summaryMatch = cleanContent.match(/\[CODE_BLOCK\](?:\s*\[CODE_BLOCK\])*\s*\n\n(.+?)$/is);
  const summary = summaryMatch 
    ? summaryMatch[1].replace(/```[\s\S]*?```/g, '').replace(/\[CODE_BLOCK\]/g, '').trim()
    : "";

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

  // Lock content sections ONLY when they are complete
  useEffect(() => {
    const locked = lockedContentRef.current;
    
    // Check if sections are complete by looking for next section markers
    const hasDesignVision = content.includes('Design Vision:');
    const hasFeatures = content.includes('Features:');
    const hasCodeBlocks = content.includes('```');
    
    // Only lock intro when Design Vision section starts (meaning intro is complete)
    if (!locked.intro && parsed.intro && hasDesignVision) {
      locked.intro = parsed.intro;
    }
    
    // Only lock Design Vision when Features section starts
    if (locked.designVision.length === 0 && parsed.designVision.length > 0 && hasFeatures) {
      locked.designVision = [...parsed.designVision];
    }
    
    // Only lock Features when code blocks start
    if (locked.features.length === 0 && parsed.features.length > 0 && hasCodeBlocks) {
      locked.features = [...parsed.features];
    }
    
    // Only lock transition text when code blocks start
    if (!locked.transitionText && parsed.transitionText && hasCodeBlocks) {
      locked.transitionText = parsed.transitionText;
    }
    
    // Lock files when code blocks exist
    if (locked.files.length === 0 && parsed.files.length > 0) {
      locked.files = [...parsed.files];
    }
    
    // Only lock summary when streaming is done
    if (!locked.summary && parsed.summary && !isStreaming) {
      locked.summary = parsed.summary;
    }
    
    // Lock project name when intro is locked
    if (!locked.projectName && parsed.projectName && locked.intro) {
      locked.projectName = parsed.projectName;
    }
  }, [parsed, content, isStreaming]);

  // Only show sections when they're locked (complete) or when streaming is done
  const displayContent = {
    intro: lockedContentRef.current.intro || (!isStreaming ? parsed.intro : ''),
    designVision: lockedContentRef.current.designVision.length > 0 
      ? lockedContentRef.current.designVision 
      : (!isStreaming ? parsed.designVision : []),
    features: lockedContentRef.current.features.length > 0 
      ? lockedContentRef.current.features 
      : (!isStreaming ? parsed.features : []),
    transitionText: lockedContentRef.current.transitionText || (!isStreaming ? parsed.transitionText : ''),
    files: lockedContentRef.current.files.length > 0 
      ? lockedContentRef.current.files 
      : (!isStreaming ? parsed.files : []),
    summary: lockedContentRef.current.summary || (!isStreaming ? parsed.summary : ''),
    projectName: lockedContentRef.current.projectName || (!isStreaming ? parsed.projectName : ''),
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
  
  // Show loading indicator while waiting for content
  if (isStreaming && !displayContent.intro) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
          <span className="text-base text-gray-400">Thinking...</span>
        </div>
      </div>
    );
  }

  // NOW the early return is safe - all hooks have been called
  if (!hasStructuredContent) {
    // Strip code blocks before displaying fallback - NEVER show code in chat
    const cleanFallback = content.replace(/```[\s\S]*?```/g, '').trim();
    
    return (
      <div className="w-full space-y-3">
        <TypewriterText 
          key="plain-content"
          text={cleanFallback} 
          className={`text-base leading-relaxed break-words ${isStreaming ? 'text-gray-400' : 'text-blue-50'}`}
          speedMs={20} 
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Section 1: Intro */}
      {displayContent.intro && (
        <div className="space-y-2 animate-fade-in" key="intro">
          <TypewriterText 
            key="intro"
            text={displayContent.intro} 
            className={`text-base leading-relaxed break-words ${isStreaming ? 'text-gray-400' : 'text-blue-50'}`}
            speedMs={20} 
          />
        </div>
      )}


      {/* Section 3: Transition Text - AI generated */}
      {displayContent.transitionText && (
        <div className="mt-4 animate-fade-in" key="transition">
          <TypewriterText
            key="transition"
            text={displayContent.transitionText}
            className={`text-lg italic break-words ${isStreaming ? 'text-gray-400' : 'text-blue-100'}`}
            speedMs={20}
          />
        </div>
      )}

      {/* Section 4: Design Vision */}
      {showDesignVision && (
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '300ms' }} key="design-vision">
          <p className={`text-base font-medium ${isStreaming ? 'text-gray-400' : 'text-blue-100'}`}>Design Vision:</p>
          <ul className="space-y-2 ml-1">
            {displayContent.designVision.map((item, i) => (
              <li
                key={`dv-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <span className={isStreaming ? 'text-gray-500 mt-1' : 'text-blue-200/40 mt-1'}>•</span>
                <TypewriterText 
                  key={`dv-text-${i}`}
                  text={item} 
                  className={`inline ${isStreaming ? 'text-gray-400' : 'text-blue-50'}`}
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
          <p className={`text-base font-medium ${isStreaming ? 'text-gray-400' : 'text-blue-100'}`}>Features:</p>
          <ul className="space-y-2 ml-1">
            {displayContent.features.map((item, i) => (
              <li
                key={`ft-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <span className={isStreaming ? 'text-gray-500 mt-1' : 'text-blue-200/40 mt-1'}>•</span>
                <TypewriterText 
                  key={`ft-text-${i}`}
                  text={item} 
                  className={`inline ${isStreaming ? 'text-gray-400' : 'text-blue-50'}`}
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
            key="summary"
            text={displayContent.summary} 
            className="text-base leading-relaxed text-blue-50"
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
