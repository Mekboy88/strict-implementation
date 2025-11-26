import React, { useState } from "react";
import { X, Check, ChevronRight, Search, Zap, Database, Github, CreditCard, Mail, BarChart3, Cloud, MessageSquare, Shield, Server, Brain, Smartphone, Globe, Layers, ArrowRight, Lock, Unlock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IntegrationSetupWizard } from "./integrations/IntegrationSetupWizard";

interface IntegrationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  color: string;
  steps: string[];
  completedSteps: number;
  connected: boolean;
  popular?: boolean;
}

const integrations: Integration[] = [
  // Core Infrastructure
  { id: "supabase", name: "Supabase", description: "Database, Auth & Storage", icon: Database, category: "Core", color: "emerald", steps: ["Create project", "Get API keys", "Configure tables"], completedSteps: 0, connected: false, popular: true },
  { id: "github", name: "GitHub", description: "Version control & CI/CD", icon: Github, category: "Core", color: "slate", steps: ["Authorize app", "Select repository", "Enable sync"], completedSteps: 0, connected: false, popular: true },
  
  // Payments
  { id: "stripe", name: "Stripe", description: "Payment processing", icon: CreditCard, category: "Payments", color: "violet", steps: ["Add API key", "Configure webhooks", "Test mode"], completedSteps: 0, connected: false, popular: true },
  { id: "paypal", name: "PayPal", description: "Alternative payments", icon: CreditCard, category: "Payments", color: "blue", steps: ["Connect account", "Set up IPN", "Configure checkout"], completedSteps: 0, connected: false },
  { id: "lemonsqueezy", name: "Lemon Squeezy", description: "Digital product payments", icon: CreditCard, category: "Payments", color: "yellow", steps: ["Create store", "Add API key", "Configure products"], completedSteps: 0, connected: false },
  
  // AI & ML
  { id: "openai", name: "OpenAI", description: "GPT models & DALL-E", icon: Brain, category: "AI", color: "emerald", steps: ["Get API key", "Set rate limits", "Choose model"], completedSteps: 0, connected: false, popular: true },
  { id: "anthropic", name: "Claude", description: "Anthropic AI models", icon: Brain, category: "AI", color: "orange", steps: ["Get API key", "Configure model", "Set limits"], completedSteps: 0, connected: false },
  { id: "google-ai", name: "Google AI", description: "Gemini & PaLM models", icon: Brain, category: "AI", color: "blue", steps: ["Enable API", "Get credentials", "Select model"], completedSteps: 0, connected: false },
  { id: "replicate", name: "Replicate", description: "Run ML models", icon: Brain, category: "AI", color: "pink", steps: ["Create account", "Add API token", "Choose models"], completedSteps: 0, connected: false },
  
  // Email & Communication
  { id: "resend", name: "Resend", description: "Email for developers", icon: Mail, category: "Email", color: "slate", steps: ["Add API key", "Verify domain", "Create templates"], completedSteps: 0, connected: false, popular: true },
  { id: "sendgrid", name: "SendGrid", description: "Email delivery", icon: Mail, category: "Email", color: "blue", steps: ["Create account", "Add API key", "Verify sender"], completedSteps: 0, connected: false },
  { id: "mailchimp", name: "Mailchimp", description: "Email marketing", icon: Mail, category: "Email", color: "yellow", steps: ["Connect account", "Select audience", "Configure forms"], completedSteps: 0, connected: false },
  { id: "twilio", name: "Twilio", description: "SMS & Voice", icon: MessageSquare, category: "Email", color: "red", steps: ["Add credentials", "Get phone number", "Configure messaging"], completedSteps: 0, connected: false },
  
  // Analytics & Monitoring
  { id: "google-analytics", name: "Google Analytics", description: "Web analytics", icon: BarChart3, category: "Analytics", color: "orange", steps: ["Create property", "Add tracking ID", "Configure events"], completedSteps: 0, connected: false, popular: true },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics", icon: BarChart3, category: "Analytics", color: "violet", steps: ["Create project", "Add token", "Set up events"], completedSteps: 0, connected: false },
  { id: "segment", name: "Segment", description: "Customer data platform", icon: BarChart3, category: "Analytics", color: "emerald", steps: ["Create workspace", "Add write key", "Configure sources"], completedSteps: 0, connected: false },
  { id: "sentry", name: "Sentry", description: "Error monitoring", icon: Shield, category: "Analytics", color: "pink", steps: ["Create project", "Add DSN", "Configure alerts"], completedSteps: 0, connected: false },
  { id: "logrocket", name: "LogRocket", description: "Session replay", icon: BarChart3, category: "Analytics", color: "indigo", steps: ["Create project", "Add app ID", "Install SDK"], completedSteps: 0, connected: false },
  
  // Storage & CDN
  { id: "cloudflare", name: "Cloudflare", description: "CDN & R2 Storage", icon: Cloud, category: "Storage", color: "orange", steps: ["Add zone", "Configure DNS", "Enable features"], completedSteps: 0, connected: false },
  { id: "aws-s3", name: "AWS S3", description: "Object storage", icon: Cloud, category: "Storage", color: "yellow", steps: ["Create bucket", "Add credentials", "Set permissions"], completedSteps: 0, connected: false },
  { id: "uploadthing", name: "UploadThing", description: "File uploads", icon: Cloud, category: "Storage", color: "red", steps: ["Create app", "Add API key", "Configure uploads"], completedSteps: 0, connected: false },
  
  // Authentication
  { id: "auth0", name: "Auth0", description: "Identity platform", icon: Lock, category: "Auth", color: "orange", steps: ["Create tenant", "Configure app", "Set up rules"], completedSteps: 0, connected: false },
  { id: "clerk", name: "Clerk", description: "User management", icon: Shield, category: "Auth", color: "violet", steps: ["Create app", "Add keys", "Configure auth"], completedSteps: 0, connected: false },
  { id: "firebase-auth", name: "Firebase Auth", description: "Google authentication", icon: Shield, category: "Auth", color: "yellow", steps: ["Create project", "Enable providers", "Add config"], completedSteps: 0, connected: false },
  
  // CMS & Content
  { id: "contentful", name: "Contentful", description: "Headless CMS", icon: Layers, category: "CMS", color: "blue", steps: ["Create space", "Add API keys", "Define models"], completedSteps: 0, connected: false },
  { id: "sanity", name: "Sanity", description: "Content platform", icon: Layers, category: "CMS", color: "red", steps: ["Create project", "Configure schema", "Add token"], completedSteps: 0, connected: false },
  { id: "strapi", name: "Strapi", description: "Open source CMS", icon: Layers, category: "CMS", color: "indigo", steps: ["Deploy instance", "Create types", "Configure API"], completedSteps: 0, connected: false },
  
  // Automation
  { id: "zapier", name: "Zapier", description: "Workflow automation", icon: Zap, category: "Automation", color: "orange", steps: ["Create Zap", "Add webhook", "Configure trigger"], completedSteps: 0, connected: false, popular: true },
  { id: "n8n", name: "n8n", description: "Workflow automation", icon: Zap, category: "Automation", color: "pink", steps: ["Connect instance", "Create workflow", "Enable MCP"], completedSteps: 0, connected: false },
  { id: "make", name: "Make", description: "Visual automation", icon: Zap, category: "Automation", color: "violet", steps: ["Create scenario", "Add webhook", "Configure modules"], completedSteps: 0, connected: false },
  
  // Hosting & Deploy
  { id: "vercel", name: "Vercel", description: "Frontend deployment", icon: Globe, category: "Hosting", color: "slate", steps: ["Connect repo", "Configure build", "Set domain"], completedSteps: 0, connected: false },
  { id: "netlify", name: "Netlify", description: "Web hosting", icon: Globe, category: "Hosting", color: "teal", steps: ["Import project", "Configure build", "Set domain"], completedSteps: 0, connected: false },
  { id: "railway", name: "Railway", description: "App platform", icon: Server, category: "Hosting", color: "violet", steps: ["Create project", "Add services", "Configure deploy"], completedSteps: 0, connected: false },
];

const categories = [
  { id: "all", name: "All Integrations", icon: Layers },
  { id: "Core", name: "Core", icon: Database },
  { id: "Payments", name: "Payments", icon: CreditCard },
  { id: "AI", name: "AI & ML", icon: Brain },
  { id: "Email", name: "Email & SMS", icon: Mail },
  { id: "Analytics", name: "Analytics", icon: BarChart3 },
  { id: "Storage", name: "Storage", icon: Cloud },
  { id: "Auth", name: "Authentication", icon: Shield },
  { id: "CMS", name: "CMS", icon: Layers },
  { id: "Automation", name: "Automation", icon: Zap },
  { id: "Hosting", name: "Hosting", icon: Globe },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  slate: { bg: "bg-slate-500/20", border: "border-slate-500/50", text: "text-slate-400", glow: "shadow-slate-500/20" },
  violet: { bg: "bg-violet-500/20", border: "border-violet-500/50", text: "text-violet-400", glow: "shadow-violet-500/20" },
  blue: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400", glow: "shadow-blue-500/20" },
  yellow: { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-400", glow: "shadow-orange-500/20" },
  pink: { bg: "bg-pink-500/20", border: "border-pink-500/50", text: "text-pink-400", glow: "shadow-pink-500/20" },
  red: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-400", glow: "shadow-red-500/20" },
  indigo: { bg: "bg-indigo-500/20", border: "border-indigo-500/50", text: "text-indigo-400", glow: "shadow-indigo-500/20" },
  teal: { bg: "bg-teal-500/20", border: "border-teal-500/50", text: "text-teal-400", glow: "shadow-teal-500/20" },
};

export const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ open, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [localIntegrations, setLocalIntegrations] = useState(integrations);
  const [wizardIntegration, setWizardIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = localIntegrations.filter(i => {
    const matchesCategory = selectedCategory === "all" || i.category === selectedCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularIntegrations = localIntegrations.filter(i => i.popular);
  const connectedCount = localIntegrations.filter(i => i.connected).length;

  const handleStartSetup = (integration: Integration) => {
    setWizardIntegration(integration);
  };

  const handleStepComplete = (integration: Integration, stepIndex: number) => {
    setLocalIntegrations(prev => prev.map(i => {
      if (i.id === integration.id) {
        return {
          ...i,
          completedSteps: stepIndex + 1,
        };
      }
      return i;
    }));
    // Update selected integration if it's the same
    if (selectedIntegration?.id === integration.id) {
      setSelectedIntegration(prev => prev ? { ...prev, completedSteps: stepIndex + 1 } : null);
    }
  };

  const handleSetupComplete = (integration: Integration, credentials: Record<string, string>) => {
    setLocalIntegrations(prev => prev.map(i => {
      if (i.id === integration.id) {
        return {
          ...i,
          completedSteps: i.steps.length,
          connected: true,
        };
      }
      return i;
    }));
    // Update selected integration
    if (selectedIntegration?.id === integration.id) {
      setSelectedIntegration(prev => prev ? { ...prev, completedSteps: integration.steps.length, connected: true } : null);
    }
    setWizardIntegration(null);
    // Here you would save credentials to Supabase
    console.log("Integration completed:", integration.id, credentials);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full h-full max-w-[1600px] max-h-[900px] m-4 rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Integrations Hub</h2>
              <p className="text-xs text-slate-400">{connectedCount} connected · {localIntegrations.length} available</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="w-64 pl-10 pr-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100%-73px)]">
          {/* Left Sidebar - Categories */}
          <div className="w-56 border-r border-white/10 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Categories</p>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = category.id === "all" 
                  ? localIntegrations.length 
                  : localIntegrations.filter(i => i.category === category.id).length;
                const isActive = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Integrations Grid */}
            <ScrollArea className="flex-1 p-6">
              {/* Popular Section */}
              {selectedCategory === "all" && !searchQuery && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Popular Integrations
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {popularIntegrations.map((integration) => {
                      const Icon = integration.icon;
                      const colors = colorClasses[integration.color];
                      const progress = (integration.completedSteps / integration.steps.length) * 100;
                      
                      return (
                        <button
                          key={integration.id}
                          onClick={() => setSelectedIntegration(integration)}
                          className={`relative p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg ${colors.glow} transition-all text-left group`}
                        >
                          {integration.connected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <h4 className="text-sm font-medium text-white mb-1">{integration.name}</h4>
                          <p className="text-xs text-slate-400 mb-3">{integration.description}</p>
                          
                          {/* Progress bar */}
                          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                            <div 
                              className={`h-full ${integration.connected ? 'bg-emerald-500' : 'bg-violet-500'} transition-all`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {integration.completedSteps}/{integration.steps.length} steps
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Integrations */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4">
                  {selectedCategory === "all" ? "All Integrations" : categories.find(c => c.id === selectedCategory)?.name}
                  <span className="text-slate-500 ml-2">({filteredIntegrations.length})</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {filteredIntegrations.map((integration) => {
                    const Icon = integration.icon;
                    const colors = colorClasses[integration.color];
                    const progress = (integration.completedSteps / integration.steps.length) * 100;
                    
                    return (
                      <button
                        key={integration.id}
                        onClick={() => setSelectedIntegration(integration)}
                        className={`relative p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all text-left group`}
                      >
                        {integration.connected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <h4 className="text-sm font-medium text-white mb-1">{integration.name}</h4>
                        <p className="text-xs text-slate-400 mb-3">{integration.description}</p>
                        
                        {/* Progress bar */}
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full ${integration.connected ? 'bg-emerald-500' : 'bg-violet-500'} transition-all`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {integration.completedSteps}/{integration.steps.length} steps
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>

            {/* Right Panel - Integration Details */}
            {selectedIntegration && (
              <div className="w-80 border-l border-white/10 p-6 bg-white/[0.02]">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl ${colorClasses[selectedIntegration.color].bg} flex items-center justify-center`}>
                    <selectedIntegration.icon className={`w-7 h-7 ${colorClasses[selectedIntegration.color].text}`} />
                  </div>
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{selectedIntegration.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{selectedIntegration.description}</p>
                
                {/* Status */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                  selectedIntegration.connected 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-500/20 text-slate-300'
                }`}>
                  {selectedIntegration.connected ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Not Connected
                    </>
                  )}
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Setup Steps</p>
                  <div className="space-y-2">
                    {selectedIntegration.steps.map((step, index) => {
                      const isCompleted = index < selectedIntegration.completedSteps;
                      const isCurrent = index === selectedIntegration.completedSteps;
                      
                      return (
                        <div 
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            isCompleted 
                              ? 'border-emerald-500/30 bg-emerald-500/10' 
                              : isCurrent
                                ? 'border-violet-500/30 bg-violet-500/10'
                                : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : isCurrent
                                ? 'bg-violet-500 text-white'
                                : 'bg-white/10 text-slate-400'
                          }`}>
                            {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                          </div>
                          <span className={`text-sm ${
                            isCompleted ? 'text-emerald-300' : isCurrent ? 'text-violet-300' : 'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                {!selectedIntegration.connected && (
                  <button
                    onClick={() => handleStartSetup(selectedIntegration)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    {selectedIntegration.completedSteps === 0 ? 'Start Setup' : 'Continue Setup'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                
                {selectedIntegration.connected && (
                  <button 
                    onClick={() => handleStartSetup(selectedIntegration)}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Manage Integration
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Visual Workflow Connections (decorative) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Your App</span>
          <ArrowRight className="w-3 h-3" />
          <span>{connectedCount} Integrations Connected</span>
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {wizardIntegration && (
        <IntegrationSetupWizard
          integration={wizardIntegration}
          onClose={() => setWizardIntegration(null)}
          onComplete={handleSetupComplete}
          onStepComplete={handleStepComplete}
        />
      )}
    </div>
  );
};
