import { useState, useEffect, useMemo } from "react";
import { FilesEditedDropdown } from "./FilesEditedDropdown";
import { CompletionCard } from "./CompletionCard";
import { TypewriterText } from "./TypewriterText";
import { CodeBlock } from "./CodeBlock";

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
  codeBlocks: Array<{ code: string; language: string; filePath?: string }>;
}

const parseContent = (content: string): ParsedContent => {
  const intro = content.split('\n\n')[0] || '';
  const designVision: string[] = [];
  const features: string[] = [];
  let summary = '';
  let transitionText = '';
  let projectName = '';
  const files: Array<{ path: string; type: string }> = [];
  const codeBlocks: Array<{ code: string; language: string; filePath?: string }> = [];

  const designMatch = content.match(/Design Vision:?\s*\n((?:•[^\n]+\n?)+)/i);
  if (designMatch) {
    designMatch[1].split('\n').forEach(line => {
      const trimmed = line.replace(/^•\s*/, '').trim();
      if (trimmed) designVision.push(trimmed);
    });
  }

  const featuresMatch = content.match(/Features:?\s*\n((?:•[^\n]+\n?)+)/i);
  if (featuresMatch) {
    featuresMatch[1].split('\n').forEach(line => {
      const trimmed = line.replace(/^•\s*/, '').trim();
      if (trimmed) features.push(trimmed);
    });
  }

  const summaryMatch = content.match(/(?:Summary|In summary)[:\s]+([^\n]+)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }

  // Extract code blocks (only React/TypeScript, not HTML)
  const codeBlockRegex = /```(?:typescript|tsx|ts|jsx|javascript|js)?\s*(?:\/\/\s*(.+?))?\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const filePath = match[1]?.trim();
    const code = match[2].trim();
    const language = match[0].match(/```(\w+)/)?.[1] || 'typescript';
    
    // Only include React/TypeScript code, skip HTML
    if (!code.includes('<!DOCTYPE') && !code.includes('<html>')) {
      codeBlocks.push({ code, language, filePath });
      
      if (filePath) {
        const fileExtension = filePath.split('.').pop() || 'tsx';
        files.push({ 
          path: filePath, 
          type: fileExtension 
        });
      }
    }
  }

  return { intro, designVision, features, summary, transitionText, projectName, files, codeBlocks };
};

export const BuildingResponse = ({ content, isStreaming, isFirstProject = false }: BuildingResponseProps) => {
  const [showFileSection, setShowFileSection] = useState(false);
  
  // Use state to lock content once it appears to prevent re-parsing and shaking
  const [lockedContent, setLockedContent] = useState<ParsedContent>({
    intro: "",
    designVision: [],
    features: [],
    transitionText: "",
    files: [],
    summary: "",
    projectName: "",
    codeBlocks: []
  });

  // Parse content without side effects in useMemo
  const parsed = useMemo(() => {
    return parseContent(content);
  }, [content]);

  // Lock content sections ONLY when they are complete
  useEffect(() => {
    // Check if sections are complete by looking for next section markers
    const hasDesignVision = content.includes('Design Vision:');
    const hasFeatures = content.includes('Features:');
    const hasCodeBlocks = content.includes('```');
    
    setLockedContent(prev => {
      const updated = { ...prev };
      
      // Only lock intro when Design Vision section starts (meaning intro is complete)
      if (!prev.intro && parsed.intro && hasDesignVision) {
        updated.intro = parsed.intro;
      }
      
      // Only lock Design Vision when Features section starts
      if (prev.designVision.length === 0 && parsed.designVision.length > 0 && hasFeatures) {
        updated.designVision = [...parsed.designVision];
      }
      
      // Only lock Features when code blocks start
      if (prev.features.length === 0 && parsed.features.length > 0 && hasCodeBlocks) {
        updated.features = [...parsed.features];
      }
      
      // Only lock transition text when code blocks start
      if (!prev.transitionText && parsed.transitionText && hasCodeBlocks) {
        updated.transitionText = parsed.transitionText;
      }
      
      // Lock files when code blocks exist
      if (prev.files.length === 0 && parsed.files.length > 0) {
        updated.files = [...parsed.files];
      }
      
      // Lock code blocks when they exist
      if (prev.codeBlocks.length === 0 && parsed.codeBlocks.length > 0 && !isStreaming) {
        updated.codeBlocks = [...parsed.codeBlocks];
      }
      
      // Only lock summary when streaming is done
      if (!prev.summary && parsed.summary && !isStreaming) {
        updated.summary = parsed.summary;
      }
      
      // Lock project name when intro is locked
      if (!prev.projectName && parsed.projectName && updated.intro) {
        updated.projectName = parsed.projectName;
      }
      
      return updated;
    });
  }, [parsed, content, isStreaming]);

  // Only show sections when they're locked (complete) or when streaming is done
  const displayContent = {
    intro: lockedContent.intro || (!isStreaming ? parsed.intro : ''),
    designVision: lockedContent.designVision.length > 0 
      ? lockedContent.designVision 
      : (!isStreaming ? parsed.designVision : []),
    features: lockedContent.features.length > 0 
      ? lockedContent.features 
      : (!isStreaming ? parsed.features : []),
    transitionText: lockedContent.transitionText || (!isStreaming ? parsed.transitionText : ''),
    files: lockedContent.files.length > 0 
      ? lockedContent.files 
      : (!isStreaming ? parsed.files : []),
    summary: lockedContent.summary || (!isStreaming ? parsed.summary : ''),
    projectName: lockedContent.projectName || (!isStreaming ? parsed.projectName : ''),
    codeBlocks: lockedContent.codeBlocks.length > 0
      ? lockedContent.codeBlocks
      : (!isStreaming ? parsed.codeBlocks : []),
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
      <div className="w-full space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-base text-blue-100">Thinking...</span>
        </div>
      </div>
    );
  }

  // NOW the early return is safe - all hooks have been called
  if (!hasStructuredContent) {
    // Strip code blocks before displaying fallback - NEVER show code in chat
    const cleanFallback = content.replace(/```[\s\S]*?```/g, '').trim();
    
    return (
      <div className="w-full space-y-6">
        <TypewriterText 
          key="plain-content"
          text={cleanFallback} 
          className="text-base leading-relaxed break-words text-blue-50"
          speedMs={20} 
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Section 1: Intro */}
      {displayContent.intro && (
        <div className="space-y-2 animate-fade-in" key="intro">
          <TypewriterText 
            key="intro"
            text={displayContent.intro} 
            className="text-base leading-relaxed break-words text-blue-50"
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
            className="text-lg italic break-words text-blue-100"
            speedMs={20}
          />
        </div>
      )}

      {/* Section 4: Design Vision */}
      {showDesignVision && (
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '300ms' }} key="design-vision">
          <p className="text-base font-medium text-blue-100">Design Vision:</p>
          <ul className="space-y-3 ml-1">
            {displayContent.designVision.map((item, i) => (
              <li
                key={`dv-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <span className="text-blue-200/40 mt-1">•</span>
                <TypewriterText 
                  key={`dv-text-${i}`}
                  text={item} 
                  className="inline text-blue-50"
                  speedMs={15} 
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 5: Features */}
      {showFeatures && (
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '500ms' }} key="features">
          <p className="text-base font-medium text-blue-100">Features:</p>
          <ul className="space-y-3 ml-1">
            {displayContent.features.map((item, i) => (
              <li
                key={`ft-${i}`}
                className="flex items-start gap-2 text-base animate-fade-in"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <span className="text-blue-200/40 mt-1">•</span>
                <TypewriterText 
                  key={`ft-text-${i}`}
                  text={item} 
                  className="inline text-blue-50"
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

      {/* Section 7: Code Blocks */}
      {displayContent.codeBlocks.length > 0 && (
        <div className="space-y-4" key="code-blocks">
          {displayContent.codeBlocks.map((block, index) => (
            <CodeBlock 
              key={`code-${index}`}
              code={block.code}
              language={block.language}
              filePath={block.filePath}
            />
          ))}
        </div>
      )}

      {/* Section 8: Summary */}
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


      {/* Section 9: Completion Card - Only show on first project */}
      {isComplete && isFirstProject && (
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '1400ms' }}>
          <CompletionCard projectName={displayContent.projectName} />
        </div>
      )}
    </div>
  );
};
