import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speedMs?: number; // lower = faster
  className?: string;
}

// Typewriter that keeps progress when text grows (streaming)
export const TypewriterText = ({ text, speedMs = 25, className = "" }: TypewriterTextProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    // If the text changed completely (not just appended), restart animation
    if (!text.startsWith(prevTextRef.current)) {
      setVisibleCount(0);
    }
    prevTextRef.current = text;

    if (!text) return;

    const total = text.length;
    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= total) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [text, speedMs]);

  return (
    <p className={className}>
      {text.slice(0, visibleCount)}
    </p>
  );
};
