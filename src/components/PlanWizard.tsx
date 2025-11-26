import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShoppingCart, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Briefcase,
  Code,
  Check,
  Database,
  Lock,
  CreditCard,
  Bell,
  Search,
  MessageSquare,
  Image,
  Calendar
} from "lucide-react";

interface PlanWizardProps {
  open: boolean;
  onClose: () => void;
  onGeneratePlan: (planData: PlanData) => void;
}

export interface PlanData {
  projectType: string;
  projectName: string;
  features: string[];
  additionalDetails: string;
}

const projectTypes = [
  { id: "ecommerce", label: "E-commerce Store", icon: ShoppingCart, description: "Online shop with products & checkout" },
  { id: "blog", label: "Blog / CMS", icon: FileText, description: "Content management & articles" },
  { id: "dashboard", label: "Dashboard / Admin", icon: LayoutDashboard, description: "Data visualisation & management" },
  { id: "social", label: "Social Platform", icon: Users, description: "User profiles & social features" },
  { id: "portfolio", label: "Portfolio / Landing", icon: Briefcase, description: "Showcase work & services" },
  { id: "custom", label: "Custom Project", icon: Code, description: "Something unique" },
];

const featureOptions = [
  { id: "auth", label: "User Authentication", icon: Lock },
  { id: "database", label: "Database Integration", icon: Database },
  { id: "payments", label: "Payment Processing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "search", label: "Search Functionality", icon: Search },
  { id: "chat", label: "Chat / Messaging", icon: MessageSquare },
  { id: "media", label: "Media Upload", icon: Image },
  { id: "scheduling", label: "Scheduling / Calendar", icon: Calendar },
];

export const PlanWizard: React.FC<PlanWizardProps> = ({ open, onClose, onGeneratePlan }) => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");

  const resetWizard = () => {
    setStep(1);
    setProjectType("");
    setProjectName("");
    setSelectedFeatures([]);
    setAdditionalDetails("");
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerate = () => {
    onGeneratePlan({
      projectType,
      projectName,
      features: selectedFeatures,
      additionalDetails,
    });
    handleClose();
  };

  const canProceed = () => {
    if (step === 1) return projectType !== "";
    if (step === 2) return projectName.trim() !== "";
    if (step === 3) return true;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-white/10 p-0 gap-0">
        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Create Your Plan</h2>
            <span className="text-xs text-slate-400">Step {step} of 4</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-sky-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6 min-h-[320px]">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">What type of project?</h3>
                <p className="text-xs text-slate-400">Select the category that best describes your project</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-sky-500/20' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-slate-400">{type.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Project Name */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Give your project a name</h3>
                <p className="text-xs text-slate-400">This helps personalise your development plan</p>
              </div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., My Awesome Store, TaskMaster App..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                autoFocus
              />
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {["My Portfolio", "Shop App", "Task Manager", "Blog Site"].map((name) => (
                    <button
                      key={name}
                      onClick={() => setProjectName(name)}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Select key features</h3>
                <p className="text-xs text-slate-400">Choose the features you want in your project</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {featureOptions.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? 'bg-sky-500' : 'bg-white/10'
                      }`}>
                        {isSelected ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Icon className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Any additional details?</h3>
                <p className="text-xs text-slate-400">Share specific requirements or ideas (optional)</p>
              </div>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="e.g., I want a dark theme, the app should support multiple languages, I need integration with Stripe..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 min-h-[120px] resize-none"
              />
              
              {/* Summary */}
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <p className="text-xs font-medium text-sky-300 mb-2">Plan Summary</p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>
                    <span className="text-slate-500">Type:</span>{" "}
                    {projectTypes.find(t => t.id === projectType)?.label}
                  </p>
                  <p>
                    <span className="text-slate-500">Name:</span>{" "}
                    {projectName}
                  </p>
                  <p>
                    <span className="text-slate-500">Features:</span>{" "}
                    {selectedFeatures.length > 0 
                      ? selectedFeatures.map(f => featureOptions.find(fo => fo.id === f)?.label).join(", ")
                      : "None selected"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
