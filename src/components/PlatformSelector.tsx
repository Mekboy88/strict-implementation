import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, Layers, ArrowRight, Sparkles, Zap, Globe, X } from "lucide-react";

interface PlatformSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (platform: "website" | "mobile" | "both") => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<"website" | "mobile" | "both" | null>(null);

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      setSelectedPlatform(null);
    } else {
      setIsAnimating(false);
    }
  }, [open]);

  const handleSelect = (platform: "website" | "mobile" | "both") => {
    setSelectedPlatform(platform);
    setTimeout(() => {
      onSelect(platform);
    }, 300);
  };

  if (!open) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        isAnimating ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all z-50"
      >
        <X className="h-5 w-5" />
      </button>

      <div 
        className="relative w-full max-w-6xl mx-4 flex items-center justify-center gap-4 md:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Website Frame - Animates from left */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            isAnimating 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 -translate-x-20 scale-90"
          } ${selectedPlatform === "mobile" ? "opacity-30 scale-95" : ""}`}
          style={{ transitionDelay: isAnimating ? "100ms" : "0ms" }}
        >
          <button
            onClick={() => handleSelect("website")}
            className={`group relative block transition-all duration-300 ${
              selectedPlatform === "website" ? "ring-2 ring-cyan-400 ring-offset-4 ring-offset-black rounded-2xl" : ""
            }`}
          >
            {/* Desktop Frame Preview */}
            <div className="relative w-64 sm:w-80 md:w-96 rounded-2xl border border-gray-600 bg-neutral-800 p-3 shadow-[0_0_60px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_80px_rgba(6,182,212,0.3)] group-hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500/60"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500/60"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500/60"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-full bg-neutral-700 px-3 py-0.5 text-[8px] text-neutral-400">
                    your-app.com
                  </div>
                </div>
              </div>
              <div className="aspect-video rounded-lg bg-neutral-900 border border-neutral-700 overflow-hidden">
                <div className="p-3 space-y-2">
                  <div className="h-3 w-24 bg-cyan-500/30 rounded"></div>
                  <div className="h-2 w-full bg-neutral-700 rounded"></div>
                  <div className="h-2 w-3/4 bg-neutral-700 rounded"></div>
                  <div className="flex gap-2 mt-3">
                    <div className="h-6 w-16 bg-cyan-500/40 rounded"></div>
                    <div className="h-6 w-16 bg-neutral-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card */}
            <div className={`absolute -bottom-28 left-1/2 -translate-x-1/2 w-72 p-4 rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-sm transition-all duration-500 ${
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`} style={{ transitionDelay: isAnimating ? "400ms" : "0ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20">
                  <Monitor className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Website Only</h3>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3">
                Perfect for landing pages, web apps, dashboards, and SaaS platforms.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[9px]">
                  <Globe className="h-2.5 w-2.5" /> SEO Ready
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[9px]">
                  <Zap className="h-2.5 w-2.5" /> Fast Deploy
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Text & Both Option */}
        <div 
          className={`flex flex-col items-center justify-center transition-all duration-700 ${
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: isAnimating ? "200ms" : "0ms" }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Choose Your Platform</h2>
            <p className="text-sm text-neutral-400">Select what you want to build</p>
          </div>

          {/* Both Option */}
          <button
            onClick={() => handleSelect("both")}
            className={`group relative p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400/60 bg-white/5 hover:bg-purple-500/10 transition-all duration-300 ${
              selectedPlatform === "both" ? "border-purple-400 bg-purple-500/20 ring-2 ring-purple-400/50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Monitor className="h-6 w-6 text-cyan-400" />
                <Smartphone className="h-4 w-4 text-purple-400 absolute -bottom-1 -right-1" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Build Both</span>
                  <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[9px] text-purple-300 font-medium">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">Web + Mobile generated together</p>
              </div>
            </div>
            
            {/* Sparkle effect */}
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-purple-400 animate-pulse" />
          </button>

          {/* Arrow indicators */}
          <div className="hidden md:flex items-center justify-center gap-8 mt-6">
            <ArrowRight className="h-4 w-4 text-neutral-600 rotate-180" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">or choose one</span>
            <ArrowRight className="h-4 w-4 text-neutral-600" />
          </div>
        </div>

        {/* Mobile Frame - Animates from right */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            isAnimating 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-20 scale-90"
          } ${selectedPlatform === "website" ? "opacity-30 scale-95" : ""}`}
          style={{ transitionDelay: isAnimating ? "100ms" : "0ms" }}
        >
          <button
            onClick={() => handleSelect("mobile")}
            className={`group relative block transition-all duration-300 ${
              selectedPlatform === "mobile" ? "ring-2 ring-purple-400 ring-offset-4 ring-offset-black rounded-[2rem]" : ""
            }`}
          >
            {/* Mobile Frame Preview */}
            <div className="relative w-40 sm:w-48 md:w-56 rounded-[2rem] border-4 border-neutral-700 bg-neutral-900 shadow-[0_0_60px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] group-hover:border-purple-500/50 transition-all">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-900 rounded-b-2xl z-20"></div>
              
              {/* Screen */}
              <div className="aspect-[9/19.5] rounded-[1.7rem] bg-neutral-900 border border-neutral-700 overflow-hidden">
                <div className="p-3 pt-10 space-y-2.5 flex flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="h-4 w-4 rounded bg-purple-500/30"></div>
                    <span className="text-[8px] font-semibold text-white">Your App</span>
                  </div>
                  
                  {/* Mobile Content */}
                  <div className="space-y-2">
                    <div className="h-2.5 w-20 mx-auto bg-purple-500/30 rounded"></div>
                    <div className="h-2 w-full bg-neutral-700 rounded"></div>
                    <div className="h-2 w-3/4 mx-auto bg-neutral-700 rounded"></div>
                  </div>
                  
                  {/* Mobile Cards */}
                  <div className="space-y-1.5 flex-1 mt-2">
                    <div className="h-8 bg-neutral-800 rounded-lg border border-neutral-700" />
                    <div className="h-8 bg-neutral-800 rounded-lg border border-neutral-700" />
                    <div className="h-8 bg-neutral-800 rounded-lg border border-neutral-700" />
                  </div>
                </div>
              </div>
              
              {/* Home indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full"></div>
            </div>

            {/* Feature Card */}
            <div className={`absolute -bottom-28 left-1/2 -translate-x-1/2 w-72 p-4 rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-sm transition-all duration-500 ${
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`} style={{ transitionDelay: isAnimating ? "400ms" : "0ms" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <Smartphone className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Mobile Only</h3>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3">
                Native-feel iOS & Android apps with smooth gestures and native features.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[9px]">
                  <Layers className="h-2.5 w-2.5" /> App Store Ready
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[9px]">
                  <Zap className="h-2.5 w-2.5" /> Native Feel
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
