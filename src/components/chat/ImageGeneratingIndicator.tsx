/**
 * Image Generating Indicator Component
 * 
 * Shows visual feedback when AI images are being generated
 */

import { Image } from "lucide-react";

interface ImageGeneratingIndicatorProps {
  prompt: string;
}

export function ImageGeneratingIndicator({ prompt }: ImageGeneratingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-primary/10 border border-primary/20">
      <Image className="h-4 w-4 text-primary animate-pulse" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary">Generating Image</p>
        <p className="text-xs text-muted-foreground truncate">{prompt}</p>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
