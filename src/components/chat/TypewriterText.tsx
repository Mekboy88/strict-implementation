import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speedMs?: number; // lower = faster
  className?: string;
}

// Simple, stable typewriter: each instance types its own text once, independent of others
export const TypewriterText = ({ text, speedMs = 25, className = "" }: TypewriterTextProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const initialTextRef = useRef(text);
  const hasStarted = useRef(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const fullText = initialTextRef.current ?? "";
    if (!fullText) return;

    // Don't restart if already started
    if (hasStarted.current) return;
    hasStarted.current = true;

    setVisibleCount(0);

    const total = fullText.length;
    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= total) {
          window.clearInterval(interval);
          hasCompleted.current = true;
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => {
      window.clearInterval(interval);
    };
    // Run only once per mount so it doesn't restart when parents re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedMs]);

  const fullText = initialTextRef.current ?? "";

  // If already completed, show full text immediately
  if (hasCompleted.current) {
    return <p className={className}>{fullText}</p>;
  }

  return (
    <p className={className}>
      {fullText.slice(0, visibleCount)}
    </p>
  );
};
