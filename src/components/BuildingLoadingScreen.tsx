import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const codeLines = [
  { text: `import { useState, useEffect } from "react";`, color: "#C586C0" },
  { text: `import { Button } from "@/components/ui/button";`, color: "#C586C0" },
  { text: `import { Card } from "@/components/ui/card";`, color: "#C586C0" },
  { text: ``, color: "#D4D4D4" },
  { text: `const HomePage = () => {`, color: "#4EC9B0" },
  { text: `  const [data, setData] = useState([]);`, color: "#9CDCFE" },
  { text: `  `, color: "#D4D4D4" },
  { text: `  useEffect(() => {`, color: "#DCDCAA" },
  { text: `    fetchData();`, color: "#9CDCFE" },
  { text: `  }, []);`, color: "#D4D4D4" },
  { text: ``, color: "#D4D4D4" },
  { text: `  return (`, color: "#C586C0" },
  { text: `    <div className="container mx-auto p-4">`, color: "#4EC9B0" },
  { text: `      <h1 className="text-3xl font-bold mb-6">`, color: "#4EC9B0" },
  { text: `        Welcome to Your App`, color: "#CE9178" },
  { text: `      </h1>`, color: "#4EC9B0" },
  { text: `      <div className="grid gap-4">`, color: "#4EC9B0" },
  { text: `        {data.map((item) => (`, color: "#569CD6" },
  { text: `          <Card key={item.id}>`, color: "#4EC9B0" },
  { text: `            <h2>{item.title}</h2>`, color: "#4EC9B0" },
  { text: `            <p>{item.description}</p>`, color: "#4EC9B0" },
  { text: `          </Card>`, color: "#4EC9B0" },
  { text: `        ))}`, color: "#569CD6" },
  { text: `      </div>`, color: "#4EC9B0" },
  { text: `    </div>`, color: "#4EC9B0" },
  { text: `  );`, color: "#D4D4D4" },
  { text: `};`, color: "#D4D4D4" },
  { text: ``, color: "#D4D4D4" },
  { text: `export default HomePage;`, color: "#C586C0" },
];

const fileSequence = [
  "global.css",
  "index.html",
  "App.tsx",
  "HomePage.tsx",
  "components/Button.tsx",
  "components/Card.tsx",
  "utils/helpers.ts",
  "styles/theme.css",
];

export const BuildingLoadingScreen = () => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState<{ text: string; color: string }[]>([]);

  useEffect(() => {
    // File name rotation - slower to match typing speed
    const fileInterval = setInterval(() => {
      setCurrentFileIndex((prev) => (prev + 1) % fileSequence.length);
    }, 3000); // Slower file rotation - 3 seconds per file

    return () => clearInterval(fileInterval);
  }, []);

  useEffect(() => {
    // Code scrolling animation - much slower for realistic typing
    let lineIndex = 0;
    const codeInterval = setInterval(() => {
      setVisibleLines((prev) => {
        const newLines = [...prev, codeLines[lineIndex % codeLines.length]];
        // Keep more lines visible (20 instead of 12)
        if (newLines.length > 20) {
          return newLines.slice(-20);
        }
        return newLines;
      });
      lineIndex++;
    }, 800); // Much slower - 800ms per line for very realistic typing

    return () => clearInterval(codeInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#05060A] z-50 flex items-center justify-center overflow-hidden">
      {/* Scrolling code with header on top - positioned to the right */}
      <div 
        className="absolute w-full max-w-3xl px-8"
        style={{
          top: "50%",
          left: "60%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header with spinner and file name - at the top of code */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-5 h-5">
            <svg 
              className="w-5 h-5 animate-spin" 
              viewBox="0 -0.5 1001 1001" 
              xmlns="http://www.w3.org/2000/svg"
              fill="#4CB3FF"
              style={{ animationDuration: '3s' }}
            >
              <path d="M497.571 0c-113.684 .267 -227.301 38.887 -319.725 115.892l.188 .188c172.901 -140.335 427.481 -130.06 588.398 30.857 133.878 133.876 163.485 332.604 88.85 495.173 -10.186 29.288 -5.523 50.219 11.974 67.716 20.709 20.709 60.696 23.151 83.847 0 2.643 -2.643 12.187 -14.411 14.694 -24.041 70.849 -180.224 33.479 -393.197 -112.171 -538.846 -98.281 -98.282 -227.211 -147.238 -356.052 -146.935zm-408.137 273.706c-14.532 .36 -29.101 5.592 -39.954 16.445 -2.643 2.644 -12.187 14.41 -14.694 24.041 -70.849 180.223 -33.479 393.197 112.171 538.846 185.003 185.003 478.607 195.322 675.778 31.044l-.188 -.188c-172.901 140.336 -427.481 130.06 -588.398 -30.857 -133.876 -133.878 -163.485 -332.603 -88.85 -495.173 10.186 -29.287 5.523 -50.219 -11.974 -67.716 -11.002 -11.002 -27.423 -16.852 -43.893 -16.445z"/>
            </svg>
          </div>
          <span className="text-lg text-[#D6E4F0] font-medium animate-pulse">
            Generating {fileSequence[currentFileIndex]}
          </span>
        </div>
        <div 
          className="space-y-2 transition-all duration-300"
        >
          {visibleLines.map((line, index) => (
            <div
              key={`${line.text}-${index}-${Date.now()}`}
              className="text-left font-mono text-lg opacity-0 animate-fade-in leading-relaxed"
              style={{
                color: line.color,
                animationDelay: `${index * 80}ms`,
                animationFillMode: "forwards",
                filter: "brightness(1.5) contrast(1.1)",
                textShadow: "0 0 15px rgba(76, 179, 255, 0.4)",
              }}
            >
              <span className="text-[#C0C0C0] mr-4 select-none font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

