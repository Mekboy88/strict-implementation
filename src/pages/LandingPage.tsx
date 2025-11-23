import { useState, useEffect, useRef } from "react";
import { Code, Zap, TrendingUp, Palette, ArrowRight, Sparkles, Monitor, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import supabaseLogo from "@/assets/supabase-logo-icon.svg";
import githubLogo from "@/assets/github-mark.svg";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const [promptValue, setPromptValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);
  const [detectedType, setDetectedType] = useState<'web' | 'mobile'>('web');
  const [displayedType, setDisplayedType] = useState<'web' | 'mobile'>('web');
  const [previewText, setPreviewText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const analyzeTimeoutRef = useRef<NodeJS.Timeout>();
  const typeChangeTimeoutRef = useRef<NodeJS.Timeout>();

  const placeholders = [
    "Build a landing page...",
    "Create a dashboard...",
    "Design a signup form...",
    "Make a blog layout...",
    "Build a pricing page...",
    "Create a nav menu..."
  ];

  // Auth state listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is admin or owner
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['owner', 'admin'])
          .maybeSingle();
        
        setIsAdmin(!!data);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['owner', 'admin'])
          .maybeSingle();
        
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSignInPopup &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        signInButtonRef.current &&
        !signInButtonRef.current.contains(event.target as Node)
      ) {
        setShowSignInPopup(false);
      }
      
      const avatarMenu = document.getElementById("avatar-menu");
      const avatarButton = document.getElementById("avatar-button");
      if (avatarMenu && avatarButton && !avatarMenu.contains(event.target as Node) && !avatarButton.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSignInPopup, showAvatarMenu]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      setShowAvatarMenu(false);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderOpacity(0);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setPlaceholderOpacity(1);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Instant platform detection as user types
  useEffect(() => {
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }

    if (typeChangeTimeoutRef.current) {
      clearTimeout(typeChangeTimeoutRef.current);
    }

    if (promptValue.trim().length === 0) {
      setDetectedType('web');
      setDisplayedType('web');
      setPreviewText('');
      return;
    }

    // Quick instant detection while typing
    const lowerPrompt = promptValue.toLowerCase();
    const mobileKeywords = ['mobile', 'ios', 'android', 'phone', 'smartphone', 'tablet', 'mobile app', 'phone app', 'app for mobile', 'app for phone'];
    const isMobile = mobileKeywords.some(keyword => lowerPrompt.includes(keyword));
    
    // Update internal detection immediately
    const newDetectedType = isMobile ? 'mobile' : 'web';
    setDetectedType(newDetectedType);

    // Wait 1 second after user stops typing to update the displayed indicator
    typeChangeTimeoutRef.current = setTimeout(() => {
      setDisplayedType(newDetectedType);
    }, 1000);

    setIsAnalyzing(true);

    // Short 500ms delay for AI analysis to get better preview text
    analyzeTimeoutRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('prompt-analyzer', {
          body: { prompt: promptValue }
        });

        if (!error && data) {
          // Update with AI detection results
          const aiDetectedType = data.detectedType || newDetectedType;
          setDetectedType(aiDetectedType);
          
          // Update displayed type smoothly after user stops typing
          if (typeChangeTimeoutRef.current) {
            clearTimeout(typeChangeTimeoutRef.current);
          }
          typeChangeTimeoutRef.current = setTimeout(() => {
            setDisplayedType(aiDetectedType);
          }, 1000);
          
          setPreviewText(data.preview || '');
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500); // Fast 500ms for responsive feel

    return () => {
      if (analyzeTimeoutRef.current) {
        clearTimeout(analyzeTimeoutRef.current);
      }
      if (typeChangeTimeoutRef.current) {
        clearTimeout(typeChangeTimeoutRef.current);
      }
    };
  }, [promptValue]);

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Smart UI Builder",
      description: "Generate beautiful layouts instantly with clean, production-ready code."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Error-Free Code Assist",
      description: "UR-DEV analyzes and fixes your code while keeping everything aligned."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Scalable Projects",
      description: "Handle complex files and long projects without slowing down."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Theme & Style Engine",
      description: "Create consistent themes, palettes, and animations for your projects."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060A] via-[#0B111A] to-[#05060A] text-[#D6E4F0]">
      {/* Navbar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(5, 6, 10, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#ffffff12] transition-opacity duration-[350ms] ease-in-out"
          style={{ opacity: scrolled ? 1 : 0 }}
        />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4CB3FF] to-[#87C7FF] bg-clip-text text-transparent">
              UR-DEV
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <button className="text-sm text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                Features
              </button>
              <button className="text-sm text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                Docs
              </button>
              <button className="text-sm text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                Pricing
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            {user ? (
              <button
                id="avatar-button"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 relative"
                style={{
                  background: "#4CB3FF",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(76, 179, 255, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <Button
                ref={signInButtonRef}
                variant="ghost"
                size="sm"
                className="text-[#8FA3B7] hover:text-[#D6E4F0] hover:bg-[#ffffff08]"
                onClick={() => setShowSignInPopup(!showSignInPopup)}
              >
                Sign In
              </Button>
            )}
            
            {/* Sign In Popup */}
            {showSignInPopup && (
              <div
                ref={popupRef}
                className="absolute top-[calc(100%+8px)] right-0 w-[320px] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.55)] animate-in fade-in slide-in-from-top-2 duration-[220ms]"
                style={{
                  background: "#0B111A",
                  border: "1px solid #ffffff12",
                }}
              >
                <div className="p-5 space-y-3">
                  {/* Email Login */}
                  <button
                    onClick={() => {
                      setShowSignInPopup(false);
                      navigate("/login");
                    }}
                    className="w-full h-[42px] rounded-[10px] font-medium text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(76,179,255,0.38)]"
                    style={{ background: "#4CB3FF" }}
                  >
                    Continue with Email
                  </button>

                  {/* Separator */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-[1px]" style={{ background: "#ffffff12" }}></div>
                    <span className="text-xs" style={{ color: "#8FA3B7" }}>or</span>
                    <div className="flex-1 h-[1px]" style={{ background: "#ffffff12" }}></div>
                  </div>

                  {/* Google Login */}
                  <button
                    onClick={() => console.log("Google login placeholder")}
                    className="w-full h-[42px] rounded-[10px] bg-white text-black font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* GitHub Login */}
                  <button
                    onClick={() => console.log("GitHub login placeholder")}
                    className="w-full h-[42px] rounded-[10px] font-medium text-white flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ background: "#1A1A1A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2A2A2A")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1A1A")}
                  >
                    <img src={githubLogo} alt="GitHub" className="w-5 h-5 invert" />
                    Continue with GitHub
                  </button>
                </div>
              </div>
            )}
            
            {/* Avatar Menu Dropdown */}
            {showAvatarMenu && user && (
              <div
                id="avatar-menu"
                className="absolute top-[calc(100%+8px)] right-[60px] w-[220px] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.55)] animate-in fade-in slide-in-from-top-2 duration-[220ms]"
                style={{
                  background: "#0B111A",
                  border: "1px solid #ffffff12",
                }}
              >
                <div className="p-4">
                  {/* User Info */}
                  <div className="mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <p className="text-sm font-medium truncate" style={{ color: "#D6E4F0" }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Launch IDE Button */}
                  <button
                    onClick={() => {
                      setShowAvatarMenu(false);
                      navigate("/ide");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 mb-2"
                    style={{ color: "#D6E4F0" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Launch IDE
                  </button>

                  {/* Admin Settings Button - Visible for all authenticated users */}
                  <button
                    onClick={() => {
                      setShowAvatarMenu(false);
                      navigate("/admin/login");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 mb-2 flex items-center gap-2"
                    style={{ color: "#4CB3FF" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(76, 179, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Settings
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2"
                    style={{ color: "#D6E4F0" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
            
            <Button
              size="sm"
              className="bg-[#4CB3FF] hover:bg-[#3DA3EF] text-white"
              onClick={() => navigate("/ide")}
            >
              Launch IDE
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-96 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            What will you{" "}
            <span className="bg-gradient-to-r from-[#4CB3FF] to-[#87C7FF] bg-clip-text text-transparent">
              create today?
            </span>
          </h1>
          <p className="text-xl text-[#8FA3B7] max-w-2xl mx-auto leading-relaxed mb-12">
            Build powerful apps, UIs, and tools with UR-DEV's AI-driven workspace.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div
              className="px-8 py-4 rounded-full bg-[#0B111A] border border-[#ffffff15] text-[#D6E4F0] text-lg font-medium pointer-events-none"
            >
              Create a website
            </div>
            <div
              className="px-8 py-4 rounded-full bg-[#0B111A] border border-[#ffffff15] text-[#D6E4F0] text-lg font-medium pointer-events-none"
            >
              Build a mobile app
            </div>
            <div
              className="px-8 py-4 rounded-full bg-[#0B111A] border border-[#ffffff15] text-[#D6E4F0] text-lg font-medium pointer-events-none"
            >
              Design a dashboard
            </div>
          </div>
        </div>
      </section>

      {/* Main Prompt Box */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#0B111A] border border-[#ffffff15] rounded-2xl p-6 shadow-[0_8px_32px_rgba(76,179,255,0.1)] hover:shadow-[0_8px_32px_rgba(76,179,255,0.2)] transition-all duration-300">
            <div className="flex flex-col gap-4">
              <textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent text-[#D6E4F0] resize-none outline-none min-h-[120px] text-lg"
                style={{
                  color: 'hsl(210, 40%, 85%)',
                }}
              />
              <style>{`
                textarea::placeholder {
                  color: hsl(210, 20%, 60%);
                  opacity: ${placeholderOpacity};
                  transition: opacity 0.3s ease-in-out;
                }
              `}</style>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pt-4 border-t border-[#ffffff10]">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPromptValue('');
                        setDetectedType('web');
                        setPreviewText('');
                      }}
                      className="text-[#8FA3B7] hover:text-[#D6E4F0] hover:bg-[#ffffff08]"
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8FA3B7] hover:text-[#D6E4F0] hover:bg-[#ffffff08]"
                    >
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8FA3B7] hover:text-[#D6E4F0] hover:bg-[#ffffff08] relative"
                    >
                      Plan
                      {/* Animated Type Indicator */}
                      {promptValue.trim() && (
                        <div 
                          key={displayedType}
                          className="absolute -right-40 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B111A] border border-[#ffffff15] z-50 transition-all duration-500 ease-in-out"
                          style={{
                            boxShadow: displayedType === 'mobile' 
                              ? '0 0 12px rgba(76, 179, 255, 0.3)' 
                              : '0 0 8px rgba(76, 179, 255, 0.15)',
                            transition: 'all 0.5s ease-in-out'
                          }}
                        >
                          {displayedType === 'mobile' ? (
                            <>
                              <Smartphone className="w-4 h-4 text-[#4CB3FF] transition-all duration-500" />
                              <span className="text-xs text-[#4CB3FF] font-medium transition-all duration-500">Mobile</span>
                            </>
                          ) : (
                            <>
                              <Monitor className="w-4 h-4 text-[#87C7FF] transition-all duration-500" />
                              <span className="text-xs text-[#87C7FF] font-medium transition-all duration-500">Desktop</span>
                            </>
                          )}
                        </div>
                      )}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (promptValue.trim()) {
                        navigate("/ide", { 
                          state: { 
                            initialPrompt: promptValue.trim(),
                            detectedType: displayedType,
                            showBuildingAnimation: true
                          } 
                        });
                      } else {
                        navigate('/ide');
                      }
                    }}
                    className="bg-[#4CB3FF] hover:bg-[#3DA3EF] text-white px-6"
                  >
                    Build with UR-DEV
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-[#0B111A] border border-[#ffffff15] rounded-xl p-6 hover:border-[#4CB3FF] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(76,179,255,0.15)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4CB3FF]/20 to-[#87C7FF]/10 flex items-center justify-center mb-4 text-[#4CB3FF] group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#D6E4F0] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#8FA3B7] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="px-6 py-24 border-t border-[#ffffff08]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Build smarter,{" "}
              <span className="text-[#4CB3FF]">not harder</span>
            </h2>
            <p className="text-lg text-[#8FA3B7] leading-relaxed mb-6">
              UR-DEV understands your intent and generates clean, maintainable code that follows best practices. No more wrestling with boilerplate or repetitive tasks.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Instant component generation with full styling</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Automatic error detection and fixes</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Smart refactoring suggestions</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#4CB3FF]/10 to-[#87C7FF]/5 border border-[#ffffff15] rounded-2xl p-8 h-96 flex items-center justify-center">
            <Code className="w-32 h-32 text-[#4CB3FF]/30" />
          </div>
        </div>
      </section>

      {/* Content Section 2 */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-br from-[#4CB3FF]/10 to-[#87C7FF]/5 border border-[#ffffff15] rounded-2xl p-8 h-96 flex items-center justify-center">
            <TrendingUp className="w-32 h-32 text-[#4CB3FF]/30" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6">
              Your workflow—{" "}
              <span className="text-[#4CB3FF]">accelerated</span>
            </h2>
            <p className="text-lg text-[#8FA3B7] leading-relaxed mb-6">
              From prototype to production in record time. UR-DEV adapts to your development style and scales with your project's complexity.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Real-time collaboration ready</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Git integration for version control</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Deploy anywhere with one click</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Content Section 3 */}
      <section className="px-6 py-24 border-t border-[#ffffff08]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Stay in{" "}
              <span className="text-[#4CB3FF]">control</span>
            </h2>
            <p className="text-lg text-[#8FA3B7] leading-relaxed mb-6">
              Every change is transparent, reviewable, and reversible. UR-DEV suggests improvements while you maintain full authority over your codebase.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Clear diff views for every edit</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Undo/redo with complete history</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Safe mode prevents breaking changes</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#4CB3FF]/10 to-[#87C7FF]/5 border border-[#ffffff15] rounded-2xl p-8 h-96 flex items-center justify-center">
            <Palette className="w-32 h-32 text-[#4CB3FF]/30" />
          </div>
        </div>
      </section>

      {/* Content Section 4 */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-br from-[#4CB3FF]/10 to-[#87C7FF]/5 border border-[#ffffff15] rounded-2xl p-8 h-96 flex items-center justify-center">
            <Sparkles className="w-32 h-32 text-[#4CB3FF]/30" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6">
              Create your own{" "}
              <span className="text-[#4CB3FF]">design language</span>
            </h2>
            <p className="text-lg text-[#8FA3B7] leading-relaxed mb-6">
              Define custom themes, component patterns, and style systems. UR-DEV learns your preferences and applies them consistently across your entire project.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Custom color palettes and tokens</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Reusable component libraries</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#4CB3FF] mt-1 flex-shrink-0" />
                <span className="text-[#8FA3B7]">Consistent spacing and typography</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to build something{" "}
            <span className="text-[#4CB3FF]">amazing?</span>
          </h2>
          <p className="text-xl text-[#8FA3B7] mb-12">
            Join thousands of developers building faster with UR-DEV
          </p>
          <Button
            size="lg"
            className="bg-[#4CB3FF] hover:bg-[#3DA3EF] text-white px-12 py-6 text-lg"
            onClick={() => navigate("/")}
          >
            Start Building Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ffffff08] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-[#D6E4F0] mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-[#8FA3B7]">
                <li><button className="hover:text-[#D6E4F0] transition-colors">Features</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Pricing</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Changelog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#D6E4F0] mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-[#8FA3B7]">
                <li><button className="hover:text-[#D6E4F0] transition-colors">Documentation</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Tutorials</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Examples</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#D6E4F0] mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-[#8FA3B7]">
                <li><button className="hover:text-[#D6E4F0] transition-colors">About</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Blog</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Careers</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#D6E4F0] mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-[#8FA3B7]">
                <li><button className="hover:text-[#D6E4F0] transition-colors">Privacy</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Terms</button></li>
                <li><button className="hover:text-[#D6E4F0] transition-colors">Security</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#ffffff08] flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-[#8FA3B7]">
              © 2024 UR-DEV. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <button className="text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                <img src={githubLogo} alt="GitHub" className="w-5 h-5 brightness-0 invert opacity-60 hover:opacity-100" />
              </button>
              <button className="text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                Twitter
              </button>
              <button className="text-[#8FA3B7] hover:text-[#D6E4F0] transition-colors">
                Discord
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
