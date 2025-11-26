import React, { useState } from "react";
import { 
  X, Check, ChevronLeft, ChevronRight, Loader2, 
  Eye, EyeOff, Copy, ExternalLink, AlertCircle,
  CheckCircle2, XCircle, Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SetupField {
  id: string;
  label: string;
  type: "text" | "password" | "url" | "select";
  placeholder: string;
  required: boolean;
  helpText?: string;
  options?: { value: string; label: string }[];
  validation?: RegExp;
  validationMessage?: string;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  fields: SetupField[];
  testConnection?: boolean;
  docUrl?: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  steps: string[];
  completedSteps: number;
  connected: boolean;
}

interface IntegrationSetupWizardProps {
  integration: Integration;
  onClose: () => void;
  onComplete: (integration: Integration, credentials: Record<string, string>) => void;
  onStepComplete: (integration: Integration, stepIndex: number) => void;
}

// Integration-specific setup configurations
const getIntegrationSetup = (integrationId: string): SetupStep[] => {
  const setupConfigs: Record<string, SetupStep[]> = {
    supabase: [
      {
        id: "create-project",
        title: "Create Supabase Project",
        description: "First, create a new project in your Supabase dashboard or use an existing one.",
        fields: [
          { id: "project_url", label: "Project URL", type: "url", placeholder: "https://xxx.supabase.co", required: true, helpText: "Found in Project Settings → API" },
        ],
        docUrl: "https://supabase.com/dashboard",
      },
      {
        id: "api-keys",
        title: "Get API Keys",
        description: "Copy your API keys from the Supabase dashboard.",
        fields: [
          { id: "anon_key", label: "Anon/Public Key", type: "password", placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", required: true, helpText: "Public key for client-side usage" },
          { id: "service_role_key", label: "Service Role Key", type: "password", placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", required: false, helpText: "Optional: For server-side operations only" },
        ],
        testConnection: true,
      },
      {
        id: "configure",
        title: "Configure Tables",
        description: "Set up your database schema and enable Row Level Security.",
        fields: [
          { id: "enable_rls", label: "Enable RLS", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes, enable RLS" }, { value: "no", label: "No, skip for now" }] },
        ],
      },
    ],
    github: [
      {
        id: "authorize",
        title: "Authorize GitHub",
        description: "Connect your GitHub account to enable version control and CI/CD.",
        fields: [],
        docUrl: "https://github.com/settings/applications",
      },
      {
        id: "select-repo",
        title: "Select Repository",
        description: "Choose an existing repository or create a new one for your project.",
        fields: [
          { id: "repo_name", label: "Repository Name", type: "text", placeholder: "my-awesome-app", required: true, validation: /^[a-zA-Z0-9_-]+$/, validationMessage: "Only letters, numbers, hyphens and underscores" },
          { id: "visibility", label: "Visibility", type: "select", placeholder: "Select visibility", required: true, options: [{ value: "public", label: "Public" }, { value: "private", label: "Private" }] },
        ],
      },
      {
        id: "enable-sync",
        title: "Enable Sync",
        description: "Configure automatic sync between your project and GitHub.",
        fields: [
          { id: "auto_deploy", label: "Auto Deploy", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes, deploy on push" }, { value: "no", label: "No, manual deploy" }] },
          { id: "branch", label: "Default Branch", type: "text", placeholder: "main", required: true },
        ],
        testConnection: true,
      },
    ],
    stripe: [
      {
        id: "api-key",
        title: "Add API Keys",
        description: "Enter your Stripe API keys from the Stripe Dashboard.",
        fields: [
          { id: "publishable_key", label: "Publishable Key", type: "password", placeholder: "pk_test_...", required: true, helpText: "Starts with pk_test_ or pk_live_", validation: /^pk_(test|live)_[a-zA-Z0-9]+$/, validationMessage: "Must start with pk_test_ or pk_live_" },
          { id: "secret_key", label: "Secret Key", type: "password", placeholder: "sk_test_...", required: true, helpText: "Starts with sk_test_ or sk_live_", validation: /^sk_(test|live)_[a-zA-Z0-9]+$/, validationMessage: "Must start with sk_test_ or sk_live_" },
        ],
        testConnection: true,
        docUrl: "https://dashboard.stripe.com/apikeys",
      },
      {
        id: "webhooks",
        title: "Configure Webhooks",
        description: "Set up webhook endpoints to receive Stripe events.",
        fields: [
          { id: "webhook_secret", label: "Webhook Signing Secret", type: "password", placeholder: "whsec_...", required: false, helpText: "Optional: For verifying webhook signatures" },
        ],
      },
      {
        id: "test-mode",
        title: "Test Mode",
        description: "Verify your integration is working correctly.",
        fields: [
          { id: "test_mode", label: "Environment", type: "select", placeholder: "Select environment", required: true, options: [{ value: "test", label: "Test Mode" }, { value: "live", label: "Live Mode" }] },
        ],
      },
    ],
    openai: [
      {
        id: "api-key",
        title: "Get API Key",
        description: "Create an API key in your OpenAI dashboard.",
        fields: [
          { id: "api_key", label: "API Key", type: "password", placeholder: "sk-...", required: true, helpText: "Starts with sk-", validation: /^sk-[a-zA-Z0-9]+$/, validationMessage: "Must start with sk-" },
        ],
        testConnection: true,
        docUrl: "https://platform.openai.com/api-keys",
      },
      {
        id: "rate-limits",
        title: "Set Rate Limits",
        description: "Configure usage limits to control costs.",
        fields: [
          { id: "max_tokens", label: "Max Tokens per Request", type: "text", placeholder: "4096", required: false, helpText: "Leave empty for no limit" },
          { id: "monthly_budget", label: "Monthly Budget ($)", type: "text", placeholder: "100", required: false },
        ],
      },
      {
        id: "model",
        title: "Choose Model",
        description: "Select which model to use by default.",
        fields: [
          { id: "default_model", label: "Default Model", type: "select", placeholder: "Select model", required: true, options: [
            { value: "gpt-4o", label: "GPT-4o (Latest)" },
            { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (Faster)" },
          ]},
        ],
      },
    ],
    resend: [
      {
        id: "api-key",
        title: "Add API Key",
        description: "Get your API key from the Resend dashboard.",
        fields: [
          { id: "api_key", label: "API Key", type: "password", placeholder: "re_...", required: true, validation: /^re_[a-zA-Z0-9]+$/, validationMessage: "Must start with re_" },
        ],
        testConnection: true,
        docUrl: "https://resend.com/api-keys",
      },
      {
        id: "domain",
        title: "Verify Domain",
        description: "Add and verify your sending domain.",
        fields: [
          { id: "domain", label: "Sending Domain", type: "text", placeholder: "mail.yourdomain.com", required: true },
          { id: "from_email", label: "Default From Email", type: "text", placeholder: "hello@yourdomain.com", required: true },
        ],
      },
      {
        id: "templates",
        title: "Create Templates",
        description: "Set up email templates for common use cases.",
        fields: [
          { id: "welcome_template", label: "Enable Welcome Email", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
        ],
      },
    ],
    "google-analytics": [
      {
        id: "property",
        title: "Create Property",
        description: "Create a new GA4 property in Google Analytics.",
        fields: [
          { id: "property_name", label: "Property Name", type: "text", placeholder: "My Website", required: true },
        ],
        docUrl: "https://analytics.google.com/",
      },
      {
        id: "tracking",
        title: "Add Tracking ID",
        description: "Enter your GA4 Measurement ID.",
        fields: [
          { id: "measurement_id", label: "Measurement ID", type: "text", placeholder: "G-XXXXXXXXXX", required: true, validation: /^G-[A-Z0-9]+$/, validationMessage: "Must start with G-" },
        ],
        testConnection: true,
      },
      {
        id: "events",
        title: "Configure Events",
        description: "Set up custom events to track.",
        fields: [
          { id: "track_pageviews", label: "Track Pageviews", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
          { id: "track_clicks", label: "Track Button Clicks", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
        ],
      },
    ],
    zapier: [
      {
        id: "zap",
        title: "Create Zap",
        description: "Create a new Zap in your Zapier account.",
        fields: [],
        docUrl: "https://zapier.com/app/zaps",
      },
      {
        id: "webhook",
        title: "Add Webhook",
        description: "Configure the webhook trigger URL.",
        fields: [
          { id: "webhook_url", label: "Webhook URL", type: "url", placeholder: "https://hooks.zapier.com/...", required: true },
        ],
        testConnection: true,
      },
      {
        id: "trigger",
        title: "Configure Trigger",
        description: "Set up when the Zap should trigger.",
        fields: [
          { id: "trigger_event", label: "Trigger On", type: "select", placeholder: "Select trigger", required: true, options: [
            { value: "new_user", label: "New User Created" },
            { value: "form_submit", label: "Form Submitted" },
            { value: "purchase", label: "Purchase Made" },
            { value: "custom", label: "Custom Event" },
          ]},
        ],
      },
    ],
  };

  // Default setup for integrations without specific config
  const defaultSetup: SetupStep[] = [
    {
      id: "credentials",
      title: "Add Credentials",
      description: "Enter your API credentials to connect this integration.",
      fields: [
        { id: "api_key", label: "API Key", type: "password", placeholder: "Enter your API key", required: true },
      ],
      testConnection: true,
    },
    {
      id: "configure",
      title: "Configure Settings",
      description: "Set up your integration preferences.",
      fields: [
        { id: "enabled", label: "Enable Integration", type: "select", placeholder: "Select option", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
      ],
    },
  ];

  return setupConfigs[integrationId] || defaultSetup;
};

export const IntegrationSetupWizard: React.FC<IntegrationSetupWizardProps> = ({
  integration,
  onClose,
  onComplete,
  onStepComplete,
}) => {
  const setupSteps = getIntegrationSetup(integration.id);
  const [currentStep, setCurrentStep] = useState(integration.completedSteps);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentSetupStep = setupSteps[currentStep];
  const isLastStep = currentStep === setupSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
    // Reset test result when credentials change
    setTestResult(null);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    currentSetupStep.fields.forEach(field => {
      const value = formData[field.id] || "";
      
      if (field.required && !value.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.validation && value && !field.validation.test(value)) {
        newErrors[field.id] = field.validationMessage || "Invalid format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateStep()) return;

    setIsTesting(true);
    setTestResult(null);

    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure (in real app, this would call actual API)
    const success = Math.random() > 0.2; // 80% success rate for demo
    setTestResult(success ? "success" : "error");
    setIsTesting(false);

    if (success) {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${integration.name}`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    setIsSaving(true);
    // Simulate saving step progress
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStepComplete(integration, currentStep);
    
    if (isLastStep) {
      onComplete(integration, formData);
      toast({
        title: "Integration Complete!",
        description: `${integration.name} has been successfully connected`,
      });
    } else {
      setCurrentStep(prev => prev + 1);
    }
    setIsSaving(false);
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied to clipboard" });
  };

  const Icon = integration.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Wizard Modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{integration.name} Setup</h2>
              <p className="text-sm text-slate-400">Step {currentStep + 1} of {setupSteps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {setupSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 ${index <= currentStep ? 'text-violet-400' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index < currentStep 
                      ? 'bg-emerald-500 text-white' 
                      : index === currentStep 
                        ? 'bg-violet-500 text-white ring-4 ring-violet-500/30' 
                        : 'bg-white/10 text-slate-500'
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${index === currentStep ? 'text-white' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < setupSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${index < currentStep ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">{currentSetupStep.title}</h3>
            <p className="text-slate-400">{currentSetupStep.description}</p>
            
            {currentSetupStep.docUrl && (
              <a 
                href={currentSetupStep.docUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 mt-2"
              >
                Open Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {currentSetupStep.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                {field.type === "select" ? (
                  <select
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      errors[field.id] ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <option value="" className="bg-neutral-900">{field.placeholder}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value} className="bg-neutral-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={field.type === "password" && !showPasswords[field.id] ? "password" : "text"}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                        errors[field.id] ? 'border-red-500' : 'border-white/10'
                      } ${field.type === "password" ? 'pr-20' : ''}`}
                    />
                    
                    {field.type === "password" && formData[field.id] && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.id)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                          {showPasswords[field.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(formData[field.id])}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {field.helpText && !errors[field.id] && (
                  <p className="text-xs text-slate-500 mt-1">{field.helpText}</p>
                )}
                
                {errors[field.id] && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}

            {/* Empty state for steps without fields */}
            {currentSetupStep.fields.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-violet-400" />
                </div>
                <p className="text-slate-400">
                  Click the link above to complete this step in the external dashboard, then continue.
                </p>
              </div>
            )}
          </div>

          {/* Test Connection */}
          {currentSetupStep.testConnection && currentSetupStep.fields.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {testResult === "success" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {testResult === "error" && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  {testResult === null && !isTesting && (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-500" />
                  )}
                  {isTesting && (
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  )}
                  <span className="text-sm text-slate-300">
                    {testResult === "success" && "Connection verified"}
                    {testResult === "error" && "Connection failed"}
                    {testResult === null && !isTesting && "Test your connection"}
                    {isTesting && "Testing connection..."}
                  </span>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {testResult ? "Test Again" : "Test Connection"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLastStep ? "Complete Setup" : "Continue"}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
