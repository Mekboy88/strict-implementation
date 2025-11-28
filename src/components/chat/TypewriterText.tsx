import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speedMs?: number; // lower = faster
  className?: string;
}

export const TypewriterText = ({ text, speedMs = 25, className = "" }: TypewriterTextProps) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
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
