import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // General Settings
  const [platformName, setPlatformName] = useState("UR-DEV");
  const [platformDescription, setPlatformDescription] = useState("AI-Powered Development Platform");
  const [platformDomain, setPlatformDomain] = useState("youaredev.dev");
  const [timezone, setTimezone] = useState("UTC");
  const [defaultLanguage, setDefaultLanguage] = useState("en");

  // Authentication Settings
  const [enableEmailSignup, setEnableEmailSignup] = useState(true);
  const [enableGoogleOAuth, setEnableGoogleOAuth] = useState(false);
  const [enableGithubOAuth, setEnableGithubOAuth] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requirePasswordSpecialChar, setRequirePasswordSpecialChar] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(24);
  const [enable2FA, setEnable2FA] = useState(false);

  // Email Configuration
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("notifications@youaredev.dev");
  const [smtpFromAddress, setSmtpFromAddress] = useState("UR-DEV <noreply@youaredev.dev>");

  // AI Configuration
  const [defaultAIModel, setDefaultAIModel] = useState("gpt-5.1");
  const [aiTemperature, setAiTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [aiRateLimit, setAiRateLimit] = useState(100);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [chatTestOpen, setChatTestOpen] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testingChat, setTestingChat] = useState(false);

  // Storage Settings
  const [maxStoragePerUser, setMaxStoragePerUser] = useState(1000);
  const [allowedFileTypes, setAllowedFileTypes] = useState(".jpg, .png, .pdf, .doc, .docx");
  const [maxFileSize, setMaxFileSize] = useState(10);

  // Credit System
  const [defaultCreditsPerUser, setDefaultCreditsPerUser] = useState(100);
  const [creditResetSchedule, setCreditResetSchedule] = useState("monthly");

  // Branding & Appearance
  const [platformLogo, setPlatformLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4CB3FF");
  const [secondaryColor, setSecondaryColor] = useState("#6B7280");
  const [customCSS, setCustomCSS] = useState("");
  const [enableDarkMode, setEnableDarkMode] = useState(true);

  // Legal & Compliance
  const [tosMode, setTosMode] = useState<"editor" | "url">("editor");
  const [tosContent, setTosContent] = useState("");
  const [tosUrl, setTosUrl] = useState("");
  const [privacyMode, setPrivacyMode] = useState<"editor" | "url">("editor");
  const [privacyContent, setPrivacyContent] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [cookieConsentEnabled, setCookieConsentEnabled] = useState(true);
  const [cookieConsentMessage, setCookieConsentMessage] = useState("We use cookies to improve your experience on our site.");
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [copyrightText, setCopyrightText] = useState("© 2024 UR-DEV. All rights reserved.");

  // Notification System
  const [welcomeEmailTemplate, setWelcomeEmailTemplate] = useState("Welcome to our platform! We're excited to have you here.");
  const [resetPasswordTemplate, setResetPasswordTemplate] = useState("Click the link below to reset your password.");
  const [alertEmailTemplate, setAlertEmailTemplate] = useState("Important alert: {{message}}");
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState("instant");
  const [maxNotificationsPerHour, setMaxNotificationsPerHour] = useState(10);

  // Backup & Recovery
  const [backupSchedule, setBackupSchedule] = useState("daily");
  const [backupTime, setBackupTime] = useState("02:00");
  const [backupRetentionDays, setBackupRetentionDays] = useState(30);
  const [backupStorageLocation, setBackupStorageLocation] = useState("supabase");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupCompression, setBackupCompression] = useState(true);
  const [includeUserData, setIncludeUserData] = useState(true);
  const [includeFileStorage, setIncludeFileStorage] = useState(true);

  // API & Developer Settings
  const [apiRateLimitPerMinute, setApiRateLimitPerMinute] = useState(60);
  const [apiRateLimitPerHour, setApiRateLimitPerHour] = useState(1000);
  const [apiKeysEnabled, setApiKeysEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [corsOrigins, setCorsOrigins] = useState("*");
  const [apiDocUrl, setApiDocUrl] = useState("https://youaredev.dev/docs/api");

  // Third-Party Integrations
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [sentryDsn, setSentryDsn] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [githubClientId, setGithubClientId] = useState("");
  const [githubClientSecret, setGithubClientSecret] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [cdnProvider, setCdnProvider] = useState("cloudflare");
  const [cdnUrl, setCdnUrl] = useState("");

  // Localization & Regional
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>(["en"]);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [timeZoneDisplay, setTimeZoneDisplay] = useState("local");
  const [restrictedCountries, setRestrictedCountries] = useState("");
  const [enableAutoTranslation, setEnableAutoTranslation] = useState(false);

  // Performance & Optimization
  const [browserCacheDuration, setBrowserCacheDuration] = useState(86400);
  const [apiCacheDuration, setApiCacheDuration] = useState(3600);
  const [imageCompressionQuality, setImageCompressionQuality] = useState(85);
  const [enableWebP, setEnableWebP] = useState(true);
  const [enableLazyLoading, setEnableLazyLoading] = useState(true);
  const [cdnEnabled, setCdnEnabled] = useState(false);
  const [enableJsMinification, setEnableJsMinification] = useState(true);
  const [enableCssMinification, setEnableCssMinification] = useState(true);
  const [enableGzip, setEnableGzip] = useState(true);

  // Feature Flags
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("We're currently performing scheduled maintenance. Please check back soon.");
  const [enableComments, setEnableComments] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableFileUploads, setEnableFileUploads] = useState(true);
  const [enableSocialSharing, setEnableSocialSharing] = useState(true);
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(false);
  const [betaUserEmails, setBetaUserEmails] = useState("");
  const [abTestingEnabled, setAbTestingEnabled] = useState(false);
  const [abTestVariant, setAbTestVariant] = useState("50/50");

  // Security Advanced Settings
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [ipBlacklist, setIpBlacklist] = useState("");
  const [corsAllowedOrigins, setCorsAllowedOrigins] = useState("*");
  const [corsAllowedMethods, setCorsAllowedMethods] = useState("GET, POST, PUT, DELETE, OPTIONS");
  const [cspEnabled, setCspEnabled] = useState(false);
  const [cspDirectives, setCspDirectives] = useState("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  const [sslEnforced, setSslEnforced] = useState(true);
  const [tlsVersion, setTlsVersion] = useState("1.2");
  const [auditLogRetention, setAuditLogRetention] = useState(90);

  useEffect(() => {
    const checkAccess = async () => {
      const adminAuth = sessionStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        navigate("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        sessionStorage.removeItem('admin_authenticated');
        navigate("/admin/login");
        return;
      }

      // Load AI settings from database
      const { data: aiConfig } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'ai_config')
        .maybeSingle();

      if (aiConfig) {
        const config = aiConfig.setting_value as any;
        const savedModel = config.model || "gpt-5.1";
        console.log('✅ Loaded AI model from database:', savedModel);
        setDefaultAIModel(savedModel);
        setAiTemperature(config.temperature || 0.3);
        setMaxTokens(config.maxTokens || 4000);
        setAiRateLimit(config.rateLimit || 100);
      } else {
        console.log('⚠️ No AI config in database, using default: gpt-5.1');
      }

      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  const handleSaveSettings = async (section: string) => {
    try {
      if (section === "AI") {
        const isGpt5Family = defaultAIModel.startsWith("gpt-5");
        const effectiveTemperature = isGpt5Family ? 0.0 : aiTemperature;

        console.log("💾 Saving AI configuration to database...");
        console.log("Selected model:", defaultAIModel);
        console.log("Requested temperature:", aiTemperature);
        console.log("Effective temperature (saved):", effectiveTemperature);
        console.log("Max tokens:", maxTokens);
        console.log("Rate limit:", aiRateLimit);

        if (isGpt5Family && aiTemperature !== 0) {
          console.warn(
            "⚠️ GPT-5 family selected – overriding UI temperature to 0.0 for API compatibility."
          );
        }
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Save AI settings to database for real-time edge function access
        const { data: upsertData, error } = await supabase
          .from("platform_settings")
          .upsert({
            setting_key: "ai_config",
            setting_value: {
              model: defaultAIModel,
              temperature: effectiveTemperature,
              maxTokens: maxTokens,
              rateLimit: aiRateLimit,
            },
            updated_by: user?.id,
          }, {
            onConflict: "setting_key",
          })
          .select();

        if (error) {
          console.error('❌ Error saving AI settings:', error);
          toast({
            title: "Error",
            description: `Failed to save AI settings: ${error.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('✅ AI configuration saved to database:', upsertData);
        
        // Verify the save by reading back
        const { data: verifyData, error: verifyError } = await supabase
          .from('platform_settings')
          .select('setting_value')
          .eq('setting_key', 'ai_config')
          .single();
          
        if (verifyError) {
          console.error('❌ Verification failed:', verifyError);
        } else {
          const savedModel = (verifyData.setting_value as any).model;
          console.log('✅ VERIFIED: Database now contains model:', savedModel);
          
          if (savedModel !== defaultAIModel) {
            console.error('❌ WARNING: Model mismatch! Expected:', defaultAIModel, 'Got:', savedModel);
          }
        }

        console.log('🚀 Edge function will now use model:', defaultAIModel);

        // Store API key reminder if provided
        if (openaiApiKey && openaiApiKey.trim()) {
          localStorage.setItem("openai_api_key_temp", openaiApiKey);
          toast({
            title: "API Key Note",
            description: "For security, store your OpenAI API key in Supabase Secrets using the Cloud tab.",
          });
        }
      }
    if (section === "Branding") {
      localStorage.setItem("platform_logo", platformLogo);
      localStorage.setItem("platform_favicon", favicon);
      localStorage.setItem("primary_color", primaryColor);
      localStorage.setItem("secondary_color", secondaryColor);
      localStorage.setItem("custom_css", customCSS);
      localStorage.setItem("dark_mode_enabled", String(enableDarkMode));
    }
    if (section === "Legal") {
      localStorage.setItem("tos_mode", tosMode);
      localStorage.setItem("tos_content", tosContent);
      localStorage.setItem("tos_url", tosUrl);
      localStorage.setItem("privacy_mode", privacyMode);
      localStorage.setItem("privacy_content", privacyContent);
      localStorage.setItem("privacy_url", privacyUrl);
      localStorage.setItem("cookie_consent_enabled", String(cookieConsentEnabled));
      localStorage.setItem("cookie_consent_message", cookieConsentMessage);
      localStorage.setItem("gdpr_enabled", String(gdprEnabled));
      localStorage.setItem("copyright_text", copyrightText);
    }
    if (section === "Notifications") {
      localStorage.setItem("welcome_email_template", welcomeEmailTemplate);
      localStorage.setItem("reset_password_template", resetPasswordTemplate);
      localStorage.setItem("alert_email_template", alertEmailTemplate);
      localStorage.setItem("push_notifications_enabled", String(pushNotificationsEnabled));
      localStorage.setItem("in_app_notifications_enabled", String(inAppNotificationsEnabled));
      localStorage.setItem("sms_enabled", String(smsEnabled));
      localStorage.setItem("twilio_account_sid", twilioAccountSid);
      localStorage.setItem("twilio_auth_token", twilioAuthToken);
      localStorage.setItem("twilio_phone_number", twilioPhoneNumber);
      localStorage.setItem("notification_frequency", notificationFrequency);
      localStorage.setItem("max_notifications_per_hour", String(maxNotificationsPerHour));
    }
    if (section === "Backup") {
      localStorage.setItem("backup_schedule", backupSchedule);
      localStorage.setItem("backup_time", backupTime);
      localStorage.setItem("backup_retention_days", String(backupRetentionDays));
      localStorage.setItem("backup_storage_location", backupStorageLocation);
      localStorage.setItem("auto_backup_enabled", String(autoBackupEnabled));
      localStorage.setItem("backup_compression", String(backupCompression));
      localStorage.setItem("include_user_data", String(includeUserData));
      localStorage.setItem("include_file_storage", String(includeFileStorage));
    }
    if (section === "API") {
      localStorage.setItem("api_rate_limit_per_minute", String(apiRateLimitPerMinute));
      localStorage.setItem("api_rate_limit_per_hour", String(apiRateLimitPerHour));
      localStorage.setItem("api_keys_enabled", String(apiKeysEnabled));
      localStorage.setItem("webhook_url", webhookUrl);
      localStorage.setItem("webhook_secret", webhookSecret);
      localStorage.setItem("cors_origins", corsOrigins);
      localStorage.setItem("api_doc_url", apiDocUrl);
    }
    if (section === "Integrations") {
      localStorage.setItem("google_analytics_id", googleAnalyticsId);
      localStorage.setItem("sentry_dsn", sentryDsn);
      localStorage.setItem("stripe_publishable_key", stripePublishableKey);
      localStorage.setItem("stripe_secret_key", stripeSecretKey);
      localStorage.setItem("github_client_id", githubClientId);
      localStorage.setItem("github_client_secret", githubClientSecret);
      localStorage.setItem("google_client_id", googleClientId);
      localStorage.setItem("google_client_secret", googleClientSecret);
      localStorage.setItem("cdn_provider", cdnProvider);
      localStorage.setItem("cdn_url", cdnUrl);
    }
    if (section === "Localization") {
      localStorage.setItem("supported_languages", JSON.stringify(supportedLanguages));
      localStorage.setItem("default_currency", defaultCurrency);
      localStorage.setItem("date_format", dateFormat);
      localStorage.setItem("time_format", timeFormat);
      localStorage.setItem("timezone_display", timeZoneDisplay);
      localStorage.setItem("restricted_countries", restrictedCountries);
      localStorage.setItem("enable_auto_translation", String(enableAutoTranslation));
    }
    if (section === "Performance") {
      localStorage.setItem("browser_cache_duration", String(browserCacheDuration));
      localStorage.setItem("api_cache_duration", String(apiCacheDuration));
      localStorage.setItem("image_compression_quality", String(imageCompressionQuality));
      localStorage.setItem("enable_webp", String(enableWebP));
      localStorage.setItem("enable_lazy_loading", String(enableLazyLoading));
      localStorage.setItem("cdn_enabled", String(cdnEnabled));
      localStorage.setItem("enable_js_minification", String(enableJsMinification));
      localStorage.setItem("enable_css_minification", String(enableCssMinification));
      localStorage.setItem("enable_gzip", String(enableGzip));
    }
    if (section === "FeatureFlags") {
      localStorage.setItem("maintenance_mode", String(maintenanceMode));
      localStorage.setItem("maintenance_message", maintenanceMessage);
      localStorage.setItem("enable_comments", String(enableComments));
      localStorage.setItem("enable_notifications", String(enableNotifications));
      localStorage.setItem("enable_file_uploads", String(enableFileUploads));
      localStorage.setItem("enable_social_sharing", String(enableSocialSharing));
      localStorage.setItem("beta_features_enabled", String(betaFeaturesEnabled));
      localStorage.setItem("beta_user_emails", betaUserEmails);
      localStorage.setItem("ab_testing_enabled", String(abTestingEnabled));
      localStorage.setItem("ab_test_variant", abTestVariant);
    }
    if (section === "Security") {
      localStorage.setItem("ip_whitelist", ipWhitelist);
      localStorage.setItem("ip_blacklist", ipBlacklist);
      localStorage.setItem("cors_allowed_origins", corsAllowedOrigins);
      localStorage.setItem("cors_allowed_methods", corsAllowedMethods);
      localStorage.setItem("csp_enabled", String(cspEnabled));
      localStorage.setItem("csp_directives", cspDirectives);
      localStorage.setItem("ssl_enforced", String(sslEnforced));
      localStorage.setItem("tls_version", tlsVersion);
      localStorage.setItem("audit_log_retention", String(auditLogRetention));
    }
    
    // Show success message with specific details for AI settings
    if (section === "AI") {
      toast({
        title: "AI Settings Saved ✅",
        description: `Model ${defaultAIModel} is now active. Your edge function will use this model for all requests.`,
      });
    } else {
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlatformLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("idle");
    
    try {
      // Test the connection through our edge function with the configured model
      const { data, error } = await supabase.functions.invoke('ai', {
        body: {
          prompt: "Say 'hello' if you can hear me.",
          systemPrompt: "You are a helpful assistant. Respond with just 'hello'.",
          testMode: true
        }
      });

      if (error || data?.error) {
        setConnectionStatus("error");
        toast({
          title: "Connection failed",
          description: data?.response || error?.message || "Could not connect to AI service",
          variant: "destructive"
        });
      } else {
        setConnectionStatus("success");
        toast({
          title: "Connection successful ✓",
          description: `OpenAI API is working properly with model: ${defaultAIModel}`,
        });
      }
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Connection failed",
        description: "Could not reach AI service",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestChat = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a test message.",
        variant: "destructive",
      });
      return;
    }

    setTestingChat(true);
    setTestResponse("");

    try {
      // Call YOUR edge function (not OpenAI directly)
      const { data, error } = await supabase.functions.invoke('ai', {
        body: {
          prompt: testMessage,
          systemPrompt: "You are a helpful assistant.",
          model: defaultAIModel,
          testMode: false
        }
      });

      if (error || data?.error) {
        setTestResponse(`Error: ${data?.response || error?.message || "Failed to get response"}`);
        toast({
          title: "Chat Test Failed",
          description: data?.response || error?.message || "Unable to get response from AI.",
          variant: "destructive",
        });
      } else {
        setTestResponse(data.response);
        toast({
          title: "AI Response Received",
          description: `Chat test successful with ${defaultAIModel}!`,
        });
      }
    } catch (error) {
      setTestResponse("Error: Connection failed.");
      toast({
        title: "Connection Error",
        description: "Unable to reach your AI edge function.",
        variant: "destructive",
      });
    } finally {
      setTestingChat(false);
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
    
    // Load branding settings
    const savedLogo = localStorage.getItem("platform_logo");
    const savedFavicon = localStorage.getItem("platform_favicon");
    const savedPrimaryColor = localStorage.getItem("primary_color");
    const savedSecondaryColor = localStorage.getItem("secondary_color");
    const savedCustomCSS = localStorage.getItem("custom_css");
    const savedDarkMode = localStorage.getItem("dark_mode_enabled");
    
    if (savedLogo) setPlatformLogo(savedLogo);
    if (savedFavicon) setFavicon(savedFavicon);
    if (savedPrimaryColor) setPrimaryColor(savedPrimaryColor);
    if (savedSecondaryColor) setSecondaryColor(savedSecondaryColor);
    if (savedCustomCSS) setCustomCSS(savedCustomCSS);
    if (savedDarkMode) setEnableDarkMode(savedDarkMode === "true");

    // Load legal settings
    const savedTosMode = localStorage.getItem("tos_mode");
    const savedTosContent = localStorage.getItem("tos_content");
    const savedTosUrl = localStorage.getItem("tos_url");
    const savedPrivacyMode = localStorage.getItem("privacy_mode");
    const savedPrivacyContent = localStorage.getItem("privacy_content");
    const savedPrivacyUrl = localStorage.getItem("privacy_url");
    const savedCookieConsent = localStorage.getItem("cookie_consent_enabled");
    const savedCookieMessage = localStorage.getItem("cookie_consent_message");
    const savedGdpr = localStorage.getItem("gdpr_enabled");
    const savedCopyright = localStorage.getItem("copyright_text");

    if (savedTosMode) setTosMode(savedTosMode as "editor" | "url");
    if (savedTosContent) setTosContent(savedTosContent);
    if (savedTosUrl) setTosUrl(savedTosUrl);
    if (savedPrivacyMode) setPrivacyMode(savedPrivacyMode as "editor" | "url");
    if (savedPrivacyContent) setPrivacyContent(savedPrivacyContent);
    if (savedPrivacyUrl) setPrivacyUrl(savedPrivacyUrl);
    if (savedCookieConsent) setCookieConsentEnabled(savedCookieConsent === "true");
    if (savedCookieMessage) setCookieConsentMessage(savedCookieMessage);
    if (savedGdpr) setGdprEnabled(savedGdpr === "true");
    if (savedCopyright) setCopyrightText(savedCopyright);

    // Load notification settings
    const savedWelcomeEmail = localStorage.getItem("welcome_email_template");
    const savedResetPassword = localStorage.getItem("reset_password_template");
    const savedAlertEmail = localStorage.getItem("alert_email_template");
    const savedPushNotifications = localStorage.getItem("push_notifications_enabled");
    const savedInAppNotifications = localStorage.getItem("in_app_notifications_enabled");
    const savedSms = localStorage.getItem("sms_enabled");
    const savedTwilioSid = localStorage.getItem("twilio_account_sid");
    const savedTwilioToken = localStorage.getItem("twilio_auth_token");
    const savedTwilioPhone = localStorage.getItem("twilio_phone_number");
    const savedFrequency = localStorage.getItem("notification_frequency");
    const savedMaxNotifications = localStorage.getItem("max_notifications_per_hour");

    if (savedWelcomeEmail) setWelcomeEmailTemplate(savedWelcomeEmail);
    if (savedResetPassword) setResetPasswordTemplate(savedResetPassword);
    if (savedAlertEmail) setAlertEmailTemplate(savedAlertEmail);
    if (savedPushNotifications) setPushNotificationsEnabled(savedPushNotifications === "true");
    if (savedInAppNotifications) setInAppNotificationsEnabled(savedInAppNotifications === "true");
    if (savedSms) setSmsEnabled(savedSms === "true");
    if (savedTwilioSid) setTwilioAccountSid(savedTwilioSid);
    if (savedTwilioToken) setTwilioAuthToken(savedTwilioToken);
    if (savedTwilioPhone) setTwilioPhoneNumber(savedTwilioPhone);
    if (savedFrequency) setNotificationFrequency(savedFrequency);
    if (savedMaxNotifications) setMaxNotificationsPerHour(Number(savedMaxNotifications));

    // Load backup settings
    const savedBackupSchedule = localStorage.getItem("backup_schedule");
    const savedBackupTime = localStorage.getItem("backup_time");
    const savedBackupRetention = localStorage.getItem("backup_retention_days");
    const savedBackupStorage = localStorage.getItem("backup_storage_location");
    const savedAutoBackup = localStorage.getItem("auto_backup_enabled");
    const savedBackupCompression = localStorage.getItem("backup_compression");
    const savedIncludeUserData = localStorage.getItem("include_user_data");
    const savedIncludeFileStorage = localStorage.getItem("include_file_storage");

    if (savedBackupSchedule) setBackupSchedule(savedBackupSchedule);
    if (savedBackupTime) setBackupTime(savedBackupTime);
    if (savedBackupRetention) setBackupRetentionDays(Number(savedBackupRetention));
    if (savedBackupStorage) setBackupStorageLocation(savedBackupStorage);
    if (savedAutoBackup) setAutoBackupEnabled(savedAutoBackup === "true");
    if (savedBackupCompression) setBackupCompression(savedBackupCompression === "true");
    if (savedIncludeUserData) setIncludeUserData(savedIncludeUserData === "true");
    if (savedIncludeFileStorage) setIncludeFileStorage(savedIncludeFileStorage === "true");

    // Load API settings
    const savedApiRateMinute = localStorage.getItem("api_rate_limit_per_minute");
    const savedApiRateHour = localStorage.getItem("api_rate_limit_per_hour");
    const savedApiKeysEnabled = localStorage.getItem("api_keys_enabled");
    const savedWebhookUrl = localStorage.getItem("webhook_url");
    const savedWebhookSecret = localStorage.getItem("webhook_secret");
    const savedCorsOrigins = localStorage.getItem("cors_origins");
    const savedApiDocUrl = localStorage.getItem("api_doc_url");

    if (savedApiRateMinute) setApiRateLimitPerMinute(Number(savedApiRateMinute));
    if (savedApiRateHour) setApiRateLimitPerHour(Number(savedApiRateHour));
    if (savedApiKeysEnabled) setApiKeysEnabled(savedApiKeysEnabled === "true");
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedWebhookSecret) setWebhookSecret(savedWebhookSecret);
    if (savedCorsOrigins) setCorsOrigins(savedCorsOrigins);
    if (savedApiDocUrl) setApiDocUrl(savedApiDocUrl);

    // Load integration settings
    const savedGoogleAnalytics = localStorage.getItem("google_analytics_id");
    const savedSentryDsn = localStorage.getItem("sentry_dsn");
    const savedStripePublishable = localStorage.getItem("stripe_publishable_key");
    const savedStripeSecret = localStorage.getItem("stripe_secret_key");
    const savedGithubClientId = localStorage.getItem("github_client_id");
    const savedGithubClientSecret = localStorage.getItem("github_client_secret");
    const savedGoogleClientId = localStorage.getItem("google_client_id");
    const savedGoogleClientSecret = localStorage.getItem("google_client_secret");
    const savedCdnProvider = localStorage.getItem("cdn_provider");
    const savedCdnUrl = localStorage.getItem("cdn_url");

    if (savedGoogleAnalytics) setGoogleAnalyticsId(savedGoogleAnalytics);
    if (savedSentryDsn) setSentryDsn(savedSentryDsn);
    if (savedStripePublishable) setStripePublishableKey(savedStripePublishable);
    if (savedStripeSecret) setStripeSecretKey(savedStripeSecret);
    if (savedGithubClientId) setGithubClientId(savedGithubClientId);
    if (savedGithubClientSecret) setGithubClientSecret(savedGithubClientSecret);
    if (savedGoogleClientId) setGoogleClientId(savedGoogleClientId);
    if (savedGoogleClientSecret) setGoogleClientSecret(savedGoogleClientSecret);
    if (savedCdnProvider) setCdnProvider(savedCdnProvider);
    if (savedCdnUrl) setCdnUrl(savedCdnUrl);

    // Load localization settings
    const savedLanguages = localStorage.getItem("supported_languages");
    const savedCurrency = localStorage.getItem("default_currency");
    const savedDateFormat = localStorage.getItem("date_format");
    const savedTimeFormat = localStorage.getItem("time_format");
    const savedTimezoneDisplay = localStorage.getItem("timezone_display");
    const savedRestrictedCountries = localStorage.getItem("restricted_countries");
    const savedAutoTranslation = localStorage.getItem("enable_auto_translation");

    if (savedLanguages) setSupportedLanguages(JSON.parse(savedLanguages));
    if (savedCurrency) setDefaultCurrency(savedCurrency);
    if (savedDateFormat) setDateFormat(savedDateFormat);
    if (savedTimeFormat) setTimeFormat(savedTimeFormat);
    if (savedTimezoneDisplay) setTimeZoneDisplay(savedTimezoneDisplay);
    if (savedRestrictedCountries) setRestrictedCountries(savedRestrictedCountries);
    if (savedAutoTranslation) setEnableAutoTranslation(savedAutoTranslation === "true");

    // Load performance settings
    const savedBrowserCache = localStorage.getItem("browser_cache_duration");
    const savedApiCache = localStorage.getItem("api_cache_duration");
    const savedImageQuality = localStorage.getItem("image_compression_quality");
    const savedWebP = localStorage.getItem("enable_webp");
    const savedLazyLoading = localStorage.getItem("enable_lazy_loading");
    const savedCdnEnabled = localStorage.getItem("cdn_enabled");
    const savedJsMinification = localStorage.getItem("enable_js_minification");
    const savedCssMinification = localStorage.getItem("enable_css_minification");
    const savedGzip = localStorage.getItem("enable_gzip");

    if (savedBrowserCache) setBrowserCacheDuration(Number(savedBrowserCache));
    if (savedApiCache) setApiCacheDuration(Number(savedApiCache));
    if (savedImageQuality) setImageCompressionQuality(Number(savedImageQuality));
    if (savedWebP) setEnableWebP(savedWebP === "true");
    if (savedLazyLoading) setEnableLazyLoading(savedLazyLoading === "true");
    if (savedCdnEnabled) setCdnEnabled(savedCdnEnabled === "true");
    if (savedJsMinification) setEnableJsMinification(savedJsMinification === "true");
    if (savedCssMinification) setEnableCssMinification(savedCssMinification === "true");
    if (savedGzip) setEnableGzip(savedGzip === "true");

    // Load feature flags
    const savedMaintenanceMode = localStorage.getItem("maintenance_mode");
    const savedMaintenanceMessage = localStorage.getItem("maintenance_message");
    const savedComments = localStorage.getItem("enable_comments");
    const savedNotifications = localStorage.getItem("enable_notifications");
    const savedFileUploads = localStorage.getItem("enable_file_uploads");
    const savedSocialSharing = localStorage.getItem("enable_social_sharing");
    const savedBetaFeatures = localStorage.getItem("beta_features_enabled");
    const savedBetaEmails = localStorage.getItem("beta_user_emails");
    const savedAbTesting = localStorage.getItem("ab_testing_enabled");
    const savedAbVariant = localStorage.getItem("ab_test_variant");

    if (savedMaintenanceMode) setMaintenanceMode(savedMaintenanceMode === "true");
    if (savedMaintenanceMessage) setMaintenanceMessage(savedMaintenanceMessage);
    if (savedComments) setEnableComments(savedComments === "true");
    if (savedNotifications) setEnableNotifications(savedNotifications === "true");
    if (savedFileUploads) setEnableFileUploads(savedFileUploads === "true");
    if (savedSocialSharing) setEnableSocialSharing(savedSocialSharing === "true");
    if (savedBetaFeatures) setBetaFeaturesEnabled(savedBetaFeatures === "true");
    if (savedBetaEmails) setBetaUserEmails(savedBetaEmails);
    if (savedAbTesting) setAbTestingEnabled(savedAbTesting === "true");
    if (savedAbVariant) setAbTestVariant(savedAbVariant);

    // Load security settings
    const savedIpWhitelist = localStorage.getItem("ip_whitelist");
    const savedIpBlacklist = localStorage.getItem("ip_blacklist");
    const savedSecurityCorsOrigins = localStorage.getItem("cors_allowed_origins");
    const savedCorsMethods = localStorage.getItem("cors_allowed_methods");
    const savedCspEnabled = localStorage.getItem("csp_enabled");
    const savedCspDirectives = localStorage.getItem("csp_directives");
    const savedSslEnforced = localStorage.getItem("ssl_enforced");
    const savedTlsVersion = localStorage.getItem("tls_version");
    const savedAuditRetention = localStorage.getItem("audit_log_retention");

    if (savedIpWhitelist) setIpWhitelist(savedIpWhitelist);
    if (savedIpBlacklist) setIpBlacklist(savedIpBlacklist);
    if (savedSecurityCorsOrigins) setCorsAllowedOrigins(savedSecurityCorsOrigins);
    if (savedCorsMethods) setCorsAllowedMethods(savedCorsMethods);
    if (savedCspEnabled) setCspEnabled(savedCspEnabled === "true");
    if (savedCspDirectives) setCspDirectives(savedCspDirectives);
    if (savedSslEnforced) setSslEnforced(savedSslEnforced === "true");
    if (savedTlsVersion) setTlsVersion(savedTlsVersion);
    if (savedAuditRetention) setAuditLogRetention(Number(savedAuditRetention));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #06080D, #0B111A)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#4CB3FF" }}></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#D6E4F0" }}>
          Platform Configuration ⚙️
        </h1>
        <p className="text-sm mt-2" style={{ color: "#8FA3B7" }}>
          Manage platform-wide settings and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
          <TabsTrigger value="general" style={{ color: "#D6E4F0" }}>General</TabsTrigger>
          <TabsTrigger value="branding" style={{ color: "#D6E4F0" }}>Branding</TabsTrigger>
          <TabsTrigger value="legal" style={{ color: "#D6E4F0" }}>Legal</TabsTrigger>
          <TabsTrigger value="notifications" style={{ color: "#D6E4F0" }}>Notifications</TabsTrigger>
          <TabsTrigger value="backup" style={{ color: "#D6E4F0" }}>Backup</TabsTrigger>
          <TabsTrigger value="api" style={{ color: "#D6E4F0" }}>API</TabsTrigger>
          <TabsTrigger value="integrations" style={{ color: "#D6E4F0" }}>Integrations</TabsTrigger>
          <TabsTrigger value="localization" style={{ color: "#D6E4F0" }}>Localization</TabsTrigger>
          <TabsTrigger value="performance" style={{ color: "#D6E4F0" }}>Performance</TabsTrigger>
          <TabsTrigger value="features" style={{ color: "#D6E4F0" }}>Feature Flags</TabsTrigger>
          <TabsTrigger value="security" style={{ color: "#D6E4F0" }}>Security</TabsTrigger>
          <TabsTrigger value="auth" style={{ color: "#D6E4F0" }}>Authentication</TabsTrigger>
          <TabsTrigger value="email" style={{ color: "#D6E4F0" }}>Email</TabsTrigger>
          <TabsTrigger value="ai" style={{ color: "#D6E4F0" }}>AI</TabsTrigger>
          <TabsTrigger value="storage" style={{ color: "#D6E4F0" }}>Storage</TabsTrigger>
          <TabsTrigger value="credits" style={{ color: "#D6E4F0" }}>Credits</TabsTrigger>
        </TabsList>


        {/* Branding & Appearance Settings */}
        <TabsContent value="branding">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Platform Logo</Label>
              <div className="flex items-center gap-4">
                {platformLogo && (
                  <img src={platformLogo} alt="Platform Logo" className="h-16 w-auto rounded" />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs mt-1" style={{ color: "#8FA3B7" }}>
                    Upload your platform logo (PNG, JPG, SVG recommended)
                  </p>
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Favicon</Label>
              <div className="flex items-center gap-4">
                {favicon && (
                  <img src={favicon} alt="Favicon" className="h-8 w-8 rounded" />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs mt-1" style={{ color: "#8FA3B7" }}>
                    Upload your favicon (16x16 or 32x32 pixels, .ico or .png)
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Primary Brand Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-10"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25" }}
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#4CB3FF"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Secondary Brand Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-20 h-10"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25" }}
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#6B7280"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Enable Dark Mode for Users</Label>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow users to switch between light and dark themes</p>
              </div>
              <Switch
                checked={enableDarkMode}
                onCheckedChange={setEnableDarkMode}
              />
            </div>

            {/* Custom CSS */}
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Custom CSS/Styling</Label>
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                rows={8}
                placeholder="/* Add your custom CSS here */
body {
  font-family: 'Inter', sans-serif;
}

.custom-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}"
                style={{ 
                  background: "#0A0F17", 
                  borderColor: "#ffffff25", 
                  color: "#D6E4F0",
                  fontFamily: "monospace",
                  fontSize: "13px"
                }}
              />
              <p className="text-xs" style={{ color: "#8FA3B7" }}>
                Add custom CSS to override default styles (use with caution)
              </p>
            </div>

            <Button onClick={() => handleSaveSettings("Branding")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Branding Settings
            </Button>
          </div>
        </TabsContent>

        {/* Legal & Compliance Settings */}
        <TabsContent value="legal">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Terms of Service */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Terms of Service</Label>
                <div className="flex gap-2">
                  <Button
                    variant={tosMode === "editor" ? "default" : "outline"}
                    onClick={() => setTosMode("editor")}
                    style={{ 
                      background: tosMode === "editor" ? "#4CB3FF" : "transparent",
                      color: tosMode === "editor" ? "#ffffff" : "#D6E4F0",
                      borderColor: "#ffffff25"
                    }}
                  >
                    Text Editor
                  </Button>
                  <Button
                    variant={tosMode === "url" ? "default" : "outline"}
                    onClick={() => setTosMode("url")}
                    style={{ 
                      background: tosMode === "url" ? "#4CB3FF" : "transparent",
                      color: tosMode === "url" ? "#ffffff" : "#D6E4F0",
                      borderColor: "#ffffff25"
                    }}
                  >
                    External URL
                  </Button>
                </div>
              </div>

              {tosMode === "editor" ? (
                <div className="space-y-2">
                  <Textarea
                    value={tosContent}
                    onChange={(e) => setTosContent(e.target.value)}
                    rows={10}
                    placeholder="Enter your Terms of Service content here..."
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Write your complete Terms of Service document
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={tosUrl}
                    onChange={(e) => setTosUrl(e.target.value)}
                    placeholder="https://example.com/terms-of-service"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Link to your external Terms of Service page
                  </p>
                </div>
              )}
            </div>

            {/* Privacy Policy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Privacy Policy</Label>
                <div className="flex gap-2">
                  <Button
                    variant={privacyMode === "editor" ? "default" : "outline"}
                    onClick={() => setPrivacyMode("editor")}
                    style={{ 
                      background: privacyMode === "editor" ? "#4CB3FF" : "transparent",
                      color: privacyMode === "editor" ? "#ffffff" : "#D6E4F0",
                      borderColor: "#ffffff25"
                    }}
                  >
                    Text Editor
                  </Button>
                  <Button
                    variant={privacyMode === "url" ? "default" : "outline"}
                    onClick={() => setPrivacyMode("url")}
                    style={{ 
                      background: privacyMode === "url" ? "#4CB3FF" : "transparent",
                      color: privacyMode === "url" ? "#ffffff" : "#D6E4F0",
                      borderColor: "#ffffff25"
                    }}
                  >
                    External URL
                  </Button>
                </div>
              </div>

              {privacyMode === "editor" ? (
                <div className="space-y-2">
                  <Textarea
                    value={privacyContent}
                    onChange={(e) => setPrivacyContent(e.target.value)}
                    rows={10}
                    placeholder="Enter your Privacy Policy content here..."
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Write your complete Privacy Policy document
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={privacyUrl}
                    onChange={(e) => setPrivacyUrl(e.target.value)}
                    placeholder="https://example.com/privacy-policy"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Link to your external Privacy Policy page
                  </p>
                </div>
              )}
            </div>

            {/* Cookie Consent */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Cookie Consent</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Cookie Consent Banner</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Show cookie consent popup to users</p>
                </div>
                <Switch
                  checked={cookieConsentEnabled}
                  onCheckedChange={setCookieConsentEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Cookie Consent Message</Label>
                <Textarea
                  value={cookieConsentMessage}
                  onChange={(e) => setCookieConsentMessage(e.target.value)}
                  rows={3}
                  placeholder="We use cookies to improve your experience..."
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
              </div>
            </div>

            {/* GDPR Compliance */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>GDPR Compliance Tools</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable GDPR Tools</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow users to export and delete their data</p>
                </div>
                <Switch
                  checked={gdprEnabled}
                  onCheckedChange={setGdprEnabled}
                />
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>GDPR Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• User data export (download all personal data)</li>
                  <li>• Right to be forgotten (permanent account deletion)</li>
                  <li>• Data processing consent management</li>
                  <li>• Privacy policy acknowledgment tracking</li>
                </ul>
              </div>
            </div>

            {/* Copyright Text */}
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Copyright Footer Text</Label>
              <Input
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2024 Your Company. All rights reserved."
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
              <p className="text-xs" style={{ color: "#8FA3B7" }}>
                This text will appear in the footer of all pages
              </p>
            </div>

            <Button onClick={() => handleSaveSettings("Legal")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Legal Settings
            </Button>
          </div>
        </TabsContent>

        {/* Notification System Settings */}
        <TabsContent value="notifications">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Email Templates */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Email Notification Templates</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Welcome Email Template</Label>
                <Textarea
                  value={welcomeEmailTemplate}
                  onChange={(e) => setWelcomeEmailTemplate(e.target.value)}
                  rows={4}
                  placeholder="Welcome message for new users..."
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Sent when a new user registers. Use {"{{name}}"} for user name, {"{{email}}"} for email.
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Reset Password Email Template</Label>
                <Textarea
                  value={resetPasswordTemplate}
                  onChange={(e) => setResetPasswordTemplate(e.target.value)}
                  rows={4}
                  placeholder="Password reset instructions..."
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Sent when user requests password reset. Use {"{{reset_link}}"} for the reset URL.
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Alert Email Template</Label>
                <Textarea
                  value={alertEmailTemplate}
                  onChange={(e) => setAlertEmailTemplate(e.target.value)}
                  rows={4}
                  placeholder="System alerts and notifications..."
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Sent for important system alerts. Use {"{{message}}"} for alert content.
                </p>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Push Notifications</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Push Notifications</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow browser push notifications for users</p>
                </div>
                <Switch
                  checked={pushNotificationsEnabled}
                  onCheckedChange={setPushNotificationsEnabled}
                />
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Push Notification Types:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• New messages and updates</li>
                  <li>• Account security alerts</li>
                  <li>• Project status changes</li>
                  <li>• System maintenance notifications</li>
                </ul>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>In-App Notifications</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable In-App Notifications</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Show notifications inside the application</p>
                </div>
                <Switch
                  checked={inAppNotificationsEnabled}
                  onCheckedChange={setInAppNotificationsEnabled}
                />
              </div>
            </div>

            {/* SMS Settings (Twilio) */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>SMS Settings (Twilio Integration)</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable SMS Notifications</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Send SMS messages via Twilio</p>
                </div>
                <Switch
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                />
              </div>

              {smsEnabled && (
                <div className="space-y-4 p-4 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <div className="space-y-2">
                    <Label style={{ color: "#D6E4F0" }}>Twilio Account SID</Label>
                    <Input
                      type="password"
                      value={twilioAccountSid}
                      onChange={(e) => setTwilioAccountSid(e.target.value)}
                      placeholder="AC..."
                      style={{ background: "#06080D", borderColor: "#ffffff25", color: "#D6E4F0" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: "#D6E4F0" }}>Twilio Auth Token</Label>
                    <Input
                      type="password"
                      value={twilioAuthToken}
                      onChange={(e) => setTwilioAuthToken(e.target.value)}
                      placeholder="Auth token..."
                      style={{ background: "#06080D", borderColor: "#ffffff25", color: "#D6E4F0" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: "#D6E4F0" }}>Twilio Phone Number</Label>
                    <Input
                      value={twilioPhoneNumber}
                      onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      style={{ background: "#06080D", borderColor: "#ffffff25", color: "#D6E4F0" }}
                    />
                  </div>

                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Get your Twilio credentials from{" "}
                    <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4CB3FF" }}>
                      console.twilio.com
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Notification Frequency Limits */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Notification Frequency Limits</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Notification Delivery Schedule</Label>
                <select
                  value={notificationFrequency}
                  onChange={(e) => setNotificationFrequency(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="instant">Instant (Send immediately)</option>
                  <option value="batched-15min">Batched (Every 15 minutes)</option>
                  <option value="batched-hourly">Batched (Every hour)</option>
                  <option value="daily-digest">Daily Digest (Once per day)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Max Notifications Per Hour</Label>
                <Input
                  type="number"
                  value={maxNotificationsPerHour}
                  onChange={(e) => setMaxNotificationsPerHour(Number(e.target.value))}
                  min={1}
                  max={100}
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Prevent notification spam by limiting maximum notifications per user per hour
                </p>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Notifications")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </TabsContent>

        {/* Backup & Recovery Settings */}
        <TabsContent value="backup">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Automated Backup */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Automated Backup Schedule</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Automatic Backups</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Automatically create database backups on schedule</p>
                </div>
                <Switch
                  checked={autoBackupEnabled}
                  onCheckedChange={setAutoBackupEnabled}
                />
              </div>

              {autoBackupEnabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Backup Frequency</Label>
                      <select
                        value={backupSchedule}
                        onChange={(e) => setBackupSchedule(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg"
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: "#D6E4F0" }}>Backup Time (UTC)</Label>
                      <Input
                        type="time"
                        value={backupTime}
                        onChange={(e) => setBackupTime(e.target.value)}
                        style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                    <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Next Scheduled Backup:</p>
                    <p className="text-sm" style={{ color: "#8FA3B7" }}>
                      {new Date(new Date().setHours(parseInt(backupTime.split(":")[0]), parseInt(backupTime.split(":")[1]))).toLocaleString()} (UTC)
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Backup Retention */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Backup Retention Policy</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Keep Backups For (Days)</Label>
                <Input
                  type="number"
                  value={backupRetentionDays}
                  onChange={(e) => setBackupRetentionDays(Number(e.target.value))}
                  min={1}
                  max={365}
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Backups older than {backupRetentionDays} days will be automatically deleted
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Storage Estimate:</p>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>
                  ~{Math.ceil(backupRetentionDays / (backupSchedule === "hourly" ? 1 : backupSchedule === "daily" ? 1 : backupSchedule === "weekly" ? 7 : 30))} backups retained
                </p>
              </div>
            </div>

            {/* Storage Location */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Backup Storage Location</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Storage Provider</Label>
                <select
                  value={backupStorageLocation}
                  onChange={(e) => setBackupStorageLocation(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="supabase">Supabase Storage (Default)</option>
                  <option value="aws-s3">Amazon S3</option>
                  <option value="google-cloud">Google Cloud Storage</option>
                  <option value="azure">Azure Blob Storage</option>
                  <option value="local">Local Server Storage</option>
                </select>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Choose where backup files will be stored securely
                </p>
              </div>
            </div>

            {/* Backup Options */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Backup Options</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Backup Compression</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Compress backups to save storage space</p>
                </div>
                <Switch
                  checked={backupCompression}
                  onCheckedChange={setBackupCompression}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Include User Data</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Backup all user accounts and profiles</p>
                </div>
                <Switch
                  checked={includeUserData}
                  onCheckedChange={setIncludeUserData}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Include File Storage</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Backup uploaded files and media</p>
                </div>
                <Switch
                  checked={includeFileStorage}
                  onCheckedChange={setIncludeFileStorage}
                />
              </div>
            </div>

            {/* Manual Backup & Restore */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Manual Actions</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    toast({
                      title: "Backup Started",
                      description: "Creating manual backup. This may take a few minutes...",
                    });
                  }}
                  style={{ background: "#4CB3FF", color: "#ffffff" }}
                >
                  Create Backup Now
                </Button>

                <Button
                  onClick={() => {
                    toast({
                      title: "Restore Feature",
                      description: "Restore functionality will be available in backup history.",
                    });
                  }}
                  style={{ background: "#6B7280", color: "#ffffff" }}
                >
                  View Backup History
                </Button>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#EF4444", borderColor: "#DC2626", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#ffffff" }}>⚠️ Important Restore Warning</p>
                <p className="text-xs" style={{ color: "#FEE2E2" }}>
                  Restoring a backup will overwrite all current data. Make sure to create a backup of the current state before restoring. This action cannot be undone.
                </p>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Backup")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Backup Settings
            </Button>
          </div>
        </TabsContent>

        {/* API & Developer Settings */}
        <TabsContent value="api">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* API Rate Limiting */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>API Rate Limiting</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Requests per Minute</Label>
                  <Input
                    type="number"
                    value={apiRateLimitPerMinute}
                    onChange={(e) => setApiRateLimitPerMinute(Number(e.target.value))}
                    min={1}
                    max={1000}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Maximum API calls allowed per minute per user
                  </p>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Requests per Hour</Label>
                  <Input
                    type="number"
                    value={apiRateLimitPerHour}
                    onChange={(e) => setApiRateLimitPerHour(Number(e.target.value))}
                    min={1}
                    max={100000}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Maximum API calls allowed per hour per user
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Current Rate Limits:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• {apiRateLimitPerMinute} requests/minute</li>
                  <li>• {apiRateLimitPerHour} requests/hour</li>
                  <li>• Automatically returns 429 status when exceeded</li>
                </ul>
              </div>
            </div>

            {/* API Key Management */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>API Key Management</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable API Keys</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow users to generate and use API keys</p>
                </div>
                <Switch
                  checked={apiKeysEnabled}
                  onCheckedChange={setApiKeysEnabled}
                />
              </div>

              {apiKeysEnabled && (
                <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>API Key Features:</p>
                  <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                    <li>• Users can generate multiple API keys</li>
                    <li>• Keys can be revoked or regenerated anytime</li>
                    <li>• Each key has usage tracking and analytics</li>
                    <li>• Keys inherit user permissions and rate limits</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Webhook Configuration */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Webhook Configuration</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Webhook Endpoint URL</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.example.com/webhooks"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Platform events will be sent to this URL
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Webhook Secret</Label>
                <Input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="Enter webhook secret for signature verification"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Used to verify webhook authenticity via HMAC signatures
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Webhook Events:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• user.created - New user registration</li>
                  <li>• user.updated - User profile changes</li>
                  <li>• project.created - New project created</li>
                  <li>• project.updated - Project modifications</li>
                  <li>• payment.success - Payment completed</li>
                  <li>• payment.failed - Payment failed</li>
                </ul>
              </div>
            </div>

            {/* CORS Configuration */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>CORS Allowed Origins</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Allowed Origins (comma-separated)</Label>
                <Textarea
                  value={corsOrigins}
                  onChange={(e) => setCorsOrigins(e.target.value)}
                  rows={4}
                  placeholder="https://example.com, https://app.example.com, http://localhost:3000"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Specify which domains can make cross-origin requests to your API. Use "*" to allow all origins (not recommended for production)
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ CORS Security Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Only add trusted domains to prevent unauthorized API access. Allowing all origins (*) exposes your API to potential security risks.
                </p>
              </div>
            </div>

            {/* API Documentation */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>API Documentation</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>API Documentation URL</Label>
                <Input
                  value={apiDocUrl}
                  onChange={(e) => setApiDocUrl(e.target.value)}
                  placeholder="https://youaredev.dev/docs/api"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Link to your API documentation that will be shown to developers
                </p>
              </div>

              <Button
                onClick={() => window.open(apiDocUrl, "_blank")}
                style={{ background: "#6B7280", color: "#ffffff" }}
              >
                View API Documentation →
              </Button>
            </div>

            <Button onClick={() => handleSaveSettings("API")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save API Settings
            </Button>
          </div>
        </TabsContent>

        {/* Third-Party Integrations */}
        <TabsContent value="integrations">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Google Analytics */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Google Analytics</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Tracking ID / Measurement ID</Label>
                <Input
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Enter your Google Analytics tracking ID (GA4: G-XXXXXXXXXX) or Universal Analytics ID (UA-XXXXXXXXX-X)
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Google Analytics Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Track page views and user sessions</li>
                  <li>• Monitor user engagement and behavior</li>
                  <li>• Analyze traffic sources and demographics</li>
                  <li>• Set up conversion goals and funnels</li>
                </ul>
              </div>
            </div>

            {/* Sentry Error Tracking */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Sentry Error Tracking</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Sentry DSN</Label>
                <Input
                  type="password"
                  value={sentryDsn}
                  onChange={(e) => setSentryDsn(e.target.value)}
                  placeholder="https://xxxxxxxxxxxxx@sentry.io/xxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Enter your Sentry DSN (Data Source Name) to enable error tracking and monitoring
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Sentry Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Real-time error tracking and reporting</li>
                  <li>• Stack trace analysis and debugging</li>
                  <li>• Performance monitoring and profiling</li>
                  <li>• Custom alerts and notifications</li>
                </ul>
              </div>
            </div>

            {/* Stripe Payment Gateway */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Stripe Payment Gateway</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Stripe Publishable Key</Label>
                <Input
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Public key used in client-side code (safe to share)
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Stripe Secret Key</Label>
                <Input
                  type="password"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  placeholder="sk_live_xxxxxxxxxxxxxxxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Secret key used in server-side code (keep confidential)
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ Security Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Never expose your Stripe secret key in client-side code. Always use it only in server-side functions.
                </p>
              </div>
            </div>

            {/* GitHub OAuth */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>GitHub OAuth</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>GitHub Client ID</Label>
                <Input
                  value={githubClientId}
                  onChange={(e) => setGithubClientId(e.target.value)}
                  placeholder="Iv1.xxxxxxxxxxxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Client ID from your GitHub OAuth app settings
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>GitHub Client Secret</Label>
                <Input
                  type="password"
                  value={githubClientSecret}
                  onChange={(e) => setGithubClientSecret(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Client secret from your GitHub OAuth app (keep confidential)
                </p>
              </div>
            </div>

            {/* Google OAuth */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Google OAuth</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Google Client ID</Label>
                <Input
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Client ID from your Google Cloud Console OAuth credentials
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Google Client Secret</Label>
                <Input
                  type="password"
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Client secret from your Google Cloud Console (keep confidential)
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>OAuth Setup Required:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Configure authorized redirect URIs in OAuth settings</li>
                  <li>• Add your domain to authorized JavaScript origins</li>
                  <li>• Enable required scopes (email, profile, openid)</li>
                </ul>
              </div>
            </div>

            {/* CDN Configuration */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>CDN Configuration</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>CDN Provider</Label>
                <select
                  value={cdnProvider}
                  onChange={(e) => setCdnProvider(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="cloudflare">Cloudflare CDN</option>
                  <option value="aws-cloudfront">AWS CloudFront</option>
                  <option value="fastly">Fastly</option>
                  <option value="akamai">Akamai</option>
                  <option value="bunny">BunnyCDN</option>
                  <option value="custom">Custom CDN</option>
                </select>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Select your CDN provider for static asset delivery
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>CDN Base URL</Label>
                <Input
                  value={cdnUrl}
                  onChange={(e) => setCdnUrl(e.target.value)}
                  placeholder="https://cdn.yourdomain.com"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Base URL for serving static assets through CDN
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>CDN Benefits:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Faster content delivery with global edge locations</li>
                  <li>• Reduced server load and bandwidth costs</li>
                  <li>• Improved performance and user experience</li>
                  <li>• DDoS protection and security features</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Integrations")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Integration Settings
            </Button>
          </div>
        </TabsContent>

        {/* Localization & Regional Settings */}
        <TabsContent value="localization">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Supported Languages */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Supported Languages</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Active Languages</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: "en", name: "English" },
                    { code: "es", name: "Spanish" },
                    { code: "fr", name: "French" },
                    { code: "de", name: "German" },
                    { code: "it", name: "Italian" },
                    { code: "pt", name: "Portuguese" },
                    { code: "ru", name: "Russian" },
                    { code: "zh", name: "Chinese" },
                    { code: "ja", name: "Japanese" },
                    { code: "ko", name: "Korean" },
                    { code: "ar", name: "Arabic" },
                    { code: "hi", name: "Hindi" },
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}
                    >
                      <span style={{ color: "#D6E4F0", fontSize: "14px" }}>{lang.name}</span>
                      <Switch
                        checked={supportedLanguages.includes(lang.code)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSupportedLanguages([...supportedLanguages, lang.code]);
                          } else {
                            setSupportedLanguages(supportedLanguages.filter((l) => l !== lang.code));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Enable languages that will be available to users on the platform
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Auto-Translation</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Automatically translate content using AI</p>
                </div>
                <Switch
                  checked={enableAutoTranslation}
                  onCheckedChange={setEnableAutoTranslation}
                />
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Currently Active: {supportedLanguages.length} language{supportedLanguages.length !== 1 ? 's' : ''}</p>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Users can select their preferred language from these options
                </p>
              </div>
            </div>

            {/* Currency Settings */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Currency Settings</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Default Currency</Label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="CNY">CNY - Chinese Yuan (¥)</option>
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="AUD">AUD - Australian Dollar ($)</option>
                  <option value="CAD">CAD - Canadian Dollar ($)</option>
                  <option value="CHF">CHF - Swiss Franc (Fr)</option>
                  <option value="BRL">BRL - Brazilian Real (R$)</option>
                  <option value="MXN">MXN - Mexican Peso ($)</option>
                  <option value="ZAR">ZAR - South African Rand (R)</option>
                </select>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Default currency used for pricing and transactions across the platform
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Multi-Currency Support:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Automatic currency conversion based on user location</li>
                  <li>• Real-time exchange rate updates</li>
                  <li>• Display prices in user's preferred currency</li>
                  <li>• Support for cryptocurrency payments</li>
                </ul>
              </div>
            </div>

            {/* Date & Time Format */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Date & Time Format</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Date Format</Label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                    <option value="DD MMM YYYY">DD MMM YYYY (31 Dec 2024)</option>
                    <option value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2024)</option>
                  </select>
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Default date display format
                  </p>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Time Format</Label>
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                  >
                    <option value="12h">12-hour (3:45 PM)</option>
                    <option value="24h">24-hour (15:45)</option>
                  </select>
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Default time display format
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Timezone Display</Label>
                <select
                  value={timeZoneDisplay}
                  onChange={(e) => setTimeZoneDisplay(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="local">User's Local Timezone</option>
                  <option value="utc">UTC (Universal Time)</option>
                  <option value="platform">Platform Default Timezone</option>
                </select>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  How timestamps are displayed to users
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Preview:</p>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>
                  Date: {dateFormat === "MM/DD/YYYY" ? "12/31/2024" : 
                         dateFormat === "DD/MM/YYYY" ? "31/12/2024" : 
                         dateFormat === "YYYY-MM-DD" ? "2024-12-31" :
                         dateFormat === "DD MMM YYYY" ? "31 Dec 2024" : "Dec 31, 2024"}
                  {" | "}
                  Time: {timeFormat === "12h" ? "3:45 PM" : "15:45"}
                </p>
              </div>
            </div>

            {/* Country & Region Restrictions */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Country & Region Restrictions</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Restricted Countries (comma-separated)</Label>
                <Textarea
                  value={restrictedCountries}
                  onChange={(e) => setRestrictedCountries(e.target.value)}
                  rows={4}
                  placeholder="CN, RU, KP, IR (country codes)"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Enter ISO 3166-1 alpha-2 country codes (e.g., US, GB, FR) separated by commas. Users from these countries will be blocked from accessing the platform.
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ Legal Compliance Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Ensure compliance with international laws and regulations when restricting access by country. Consider GDPR, sanctions, and data protection laws.
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Restriction Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• IP-based geolocation blocking</li>
                  <li>• Custom error message for blocked users</li>
                  <li>• Whitelist specific users from restricted regions</li>
                  <li>• Analytics on blocked access attempts</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Localization")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Localization Settings
            </Button>
          </div>
        </TabsContent>

        {/* Performance & Optimization */}
        <TabsContent value="performance">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Cache Duration Settings */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Cache Duration Settings</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Browser Cache Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={browserCacheDuration}
                    onChange={(e) => setBrowserCacheDuration(Number(e.target.value))}
                    min={0}
                    max={31536000}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    {browserCacheDuration === 0 ? "No cache" : 
                     browserCacheDuration < 3600 ? `${Math.floor(browserCacheDuration / 60)} minutes` :
                     browserCacheDuration < 86400 ? `${Math.floor(browserCacheDuration / 3600)} hours` :
                     `${Math.floor(browserCacheDuration / 86400)} days`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>API Cache Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={apiCacheDuration}
                    onChange={(e) => setApiCacheDuration(Number(e.target.value))}
                    min={0}
                    max={86400}
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    {apiCacheDuration === 0 ? "No cache" : 
                     apiCacheDuration < 60 ? `${apiCacheDuration} seconds` :
                     apiCacheDuration < 3600 ? `${Math.floor(apiCacheDuration / 60)} minutes` :
                     `${Math.floor(apiCacheDuration / 3600)} hours`}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Recommended Cache Durations:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Static assets (images, CSS, JS): 7-30 days (604800-2592000 seconds)</li>
                  <li>• Dynamic content: 1-5 minutes (60-300 seconds)</li>
                  <li>• API responses: 5-60 minutes (300-3600 seconds)</li>
                  <li>• Frequently updated data: 0-30 seconds</li>
                </ul>
              </div>
            </div>

            {/* Image Optimization */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Image Optimization</Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label style={{ color: "#D6E4F0" }}>Compression Quality: {imageCompressionQuality}%</Label>
                  <span style={{ color: "#8FA3B7", fontSize: "12px" }}>
                    {imageCompressionQuality >= 90 ? "High Quality" :
                     imageCompressionQuality >= 70 ? "Balanced" : "High Compression"}
                  </span>
                </div>
                <input
                  type="range"
                  value={imageCompressionQuality}
                  onChange={(e) => setImageCompressionQuality(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full"
                  style={{ 
                    accentColor: "#4CB3FF",
                    background: "#0A0F17"
                  }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Higher quality = larger file sizes. Recommended: 80-90% for balanced quality and performance.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable WebP Format</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Convert images to WebP for better compression</p>
                </div>
                <Switch
                  checked={enableWebP}
                  onCheckedChange={setEnableWebP}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Lazy Loading</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Load images only when visible in viewport</p>
                </div>
                <Switch
                  checked={enableLazyLoading}
                  onCheckedChange={setEnableLazyLoading}
                />
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Image Optimization Benefits:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Reduce bandwidth usage by 30-50%</li>
                  <li>• Improve page load times significantly</li>
                  <li>• Better mobile experience with smaller file sizes</li>
                  <li>• Automatic format conversion based on browser support</li>
                </ul>
              </div>
            </div>

            {/* CDN Configuration */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>CDN Configuration</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable CDN</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Serve static assets through Content Delivery Network</p>
                </div>
                <Switch
                  checked={cdnEnabled}
                  onCheckedChange={setCdnEnabled}
                />
              </div>

              {cdnEnabled && (
                <div className="p-4 rounded-lg space-y-2" style={{ background: "#10B981", borderColor: "#059669", border: "1px solid" }}>
                  <p className="text-sm font-medium" style={{ color: "#ffffff" }}>✓ CDN Enabled</p>
                  <p className="text-xs" style={{ color: "#D1FAE5" }}>
                    Static assets are being served through your configured CDN. Configure CDN URL in the Integrations tab.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>CDN Benefits:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Faster content delivery with edge caching</li>
                  <li>• Reduced server load and bandwidth costs</li>
                  <li>• Improved global performance</li>
                  <li>• Built-in DDoS protection</li>
                </ul>
              </div>
            </div>

            {/* Asset Minification */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Asset Minification</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>JavaScript Minification</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Remove whitespace and optimize JavaScript files</p>
                </div>
                <Switch
                  checked={enableJsMinification}
                  onCheckedChange={setEnableJsMinification}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>CSS Minification</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Remove whitespace and optimize CSS files</p>
                </div>
                <Switch
                  checked={enableCssMinification}
                  onCheckedChange={setEnableCssMinification}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Gzip Compression</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Compress assets before sending to clients</p>
                </div>
                <Switch
                  checked={enableGzip}
                  onCheckedChange={setEnableGzip}
                />
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Optimization Impact:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• JS Minification: Reduce file size by 20-40%</li>
                  <li>• CSS Minification: Reduce file size by 15-30%</li>
                  <li>• Gzip Compression: Reduce transfer size by 60-80%</li>
                  <li>• Combined: Up to 90% reduction in total asset size</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ Development Mode Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Minification and compression are automatically disabled in development mode for easier debugging. These settings only apply to production builds.
                </p>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Performance")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Performance Settings
            </Button>
          </div>
        </TabsContent>

        {/* Feature Flags (Advanced) */}
        <TabsContent value="features">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* Maintenance Mode */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Maintenance Mode</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: maintenanceMode ? "#EF4444" : "#0A0F17", borderColor: maintenanceMode ? "#DC2626" : "#ffffff15", border: "1px solid" }}>
                <div>
                  <Label style={{ color: maintenanceMode ? "#ffffff" : "#D6E4F0" }}>Enable Maintenance Mode</Label>
                  <p className="text-sm" style={{ color: maintenanceMode ? "#FEE2E2" : "#8FA3B7" }}>
                    {maintenanceMode ? "Platform is currently in maintenance mode" : "Platform is accessible to all users"}
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              {maintenanceMode && (
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Maintenance Message</Label>
                  <Textarea
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    rows={4}
                    placeholder="Enter message displayed to users during maintenance..."
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    This message will be displayed to users when they try to access the platform
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ Maintenance Mode Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  When enabled, all users except admins will be unable to access the platform. Use this for planned maintenance, updates, or emergency fixes.
                </p>
              </div>
            </div>

            {/* Platform Features */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Platform Features</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <div>
                    <Label style={{ color: "#D6E4F0" }}>Comments</Label>
                    <p className="text-xs" style={{ color: "#8FA3B7" }}>User commenting system</p>
                  </div>
                  <Switch
                    checked={enableComments}
                    onCheckedChange={setEnableComments}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <div>
                    <Label style={{ color: "#D6E4F0" }}>Notifications</Label>
                    <p className="text-xs" style={{ color: "#8FA3B7" }}>Push & in-app alerts</p>
                  </div>
                  <Switch
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <div>
                    <Label style={{ color: "#D6E4F0" }}>File Uploads</Label>
                    <p className="text-xs" style={{ color: "#8FA3B7" }}>User file uploading</p>
                  </div>
                  <Switch
                    checked={enableFileUploads}
                    onCheckedChange={setEnableFileUploads}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <div>
                    <Label style={{ color: "#D6E4F0" }}>Social Sharing</Label>
                    <p className="text-xs" style={{ color: "#8FA3B7" }}>Share to social media</p>
                  </div>
                  <Switch
                    checked={enableSocialSharing}
                    onCheckedChange={setEnableSocialSharing}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Feature Status:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• {enableComments ? "✓" : "✗"} Comments {enableComments ? "enabled" : "disabled"}</li>
                  <li>• {enableNotifications ? "✓" : "✗"} Notifications {enableNotifications ? "enabled" : "disabled"}</li>
                  <li>• {enableFileUploads ? "✓" : "✗"} File Uploads {enableFileUploads ? "enabled" : "disabled"}</li>
                  <li>• {enableSocialSharing ? "✓" : "✗"} Social Sharing {enableSocialSharing ? "enabled" : "disabled"}</li>
                </ul>
              </div>
            </div>

            {/* Beta Features */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Beta Features Access Control</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Beta Features</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow access to experimental features</p>
                </div>
                <Switch
                  checked={betaFeaturesEnabled}
                  onCheckedChange={setBetaFeaturesEnabled}
                />
              </div>

              {betaFeaturesEnabled && (
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Beta User Emails (comma-separated)</Label>
                  <Textarea
                    value={betaUserEmails}
                    onChange={(e) => setBetaUserEmails(e.target.value)}
                    rows={4}
                    placeholder="user1@example.com, user2@example.com, user3@example.com"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Only users with these email addresses will have access to beta features
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Beta Program Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Early access to new features before public release</li>
                  <li>• Controlled rollout to specific users via email whitelist</li>
                  <li>• Gather feedback from beta testers</li>
                  <li>• Minimize risk by testing with small user groups</li>
                </ul>
              </div>
            </div>

            {/* A/B Testing */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>A/B Testing Configuration</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable A/B Testing</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Split traffic between feature variants</p>
                </div>
                <Switch
                  checked={abTestingEnabled}
                  onCheckedChange={setAbTestingEnabled}
                />
              </div>

              {abTestingEnabled && (
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>Traffic Split Ratio</Label>
                  <select
                    value={abTestVariant}
                    onChange={(e) => setAbTestVariant(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg"
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                  >
                    <option value="50/50">50/50 - Equal Split</option>
                    <option value="70/30">70/30 - Variant A Majority</option>
                    <option value="80/20">80/20 - Variant A Heavy</option>
                    <option value="90/10">90/10 - Variant A Dominant</option>
                    <option value="30/70">30/70 - Variant B Majority</option>
                    <option value="20/80">20/80 - Variant B Heavy</option>
                  </select>
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Control how traffic is distributed between feature variants A and B
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>A/B Testing Capabilities:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Test new features against existing implementation</li>
                  <li>• Measure conversion rates and user engagement</li>
                  <li>• Statistical significance tracking</li>
                  <li>• Automatic winner determination based on metrics</li>
                </ul>
              </div>

              {abTestingEnabled && (
                <div className="p-4 rounded-lg space-y-2" style={{ background: "#10B981", borderColor: "#059669", border: "1px solid" }}>
                  <p className="text-sm font-medium" style={{ color: "#ffffff" }}>✓ A/B Testing Active</p>
                  <p className="text-xs" style={{ color: "#D1FAE5" }}>
                    Traffic split: {abTestVariant} | Users are being randomly assigned to variants A and B
                  </p>
                </div>
              )}
            </div>

            <Button onClick={() => handleSaveSettings("FeatureFlags")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Feature Flags
            </Button>
          </div>
        </TabsContent>

        {/* Security Advanced Settings */}
        <TabsContent value="security">
          <div className="rounded-lg border p-6 space-y-6" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            {/* IP Whitelist/Blacklist */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>IP Access Control</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>IP Whitelist (comma-separated)</Label>
                <Textarea
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  rows={4}
                  placeholder="192.168.1.1, 10.0.0.0/8, 172.16.0.0/12"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Only these IP addresses/ranges will be allowed to access the platform. Supports CIDR notation. Leave empty to allow all IPs.
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>IP Blacklist (comma-separated)</Label>
                <Textarea
                  value={ipBlacklist}
                  onChange={(e) => setIpBlacklist(e.target.value)}
                  rows={4}
                  placeholder="203.0.113.0, 198.51.100.0/24"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  These IP addresses/ranges will be blocked from accessing the platform. Supports CIDR notation.
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ IP Filtering Warning</p>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  Be careful when setting IP restrictions. Incorrect configuration could lock you out of the admin panel. Always test with a whitelist before implementing a blacklist.
                </p>
              </div>
            </div>

            {/* CORS Configuration */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>CORS Configuration</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Allowed Origins (comma-separated)</Label>
                <Textarea
                  value={corsAllowedOrigins}
                  onChange={(e) => setCorsAllowedOrigins(e.target.value)}
                  rows={3}
                  placeholder="https://example.com, https://app.example.com, http://localhost:3000"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Domains allowed to make cross-origin requests. Use "*" for all domains (not recommended for production).
                </p>
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Allowed Methods</Label>
                <Input
                  value={corsAllowedMethods}
                  onChange={(e) => setCorsAllowedMethods(e.target.value)}
                  placeholder="GET, POST, PUT, DELETE, OPTIONS"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  HTTP methods allowed for cross-origin requests
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>CORS Security Best Practices:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Never use "*" for production APIs with authentication</li>
                  <li>• Only allow necessary HTTP methods</li>
                  <li>• Specify exact domains instead of wildcards</li>
                  <li>• Regularly review and update allowed origins</li>
                </ul>
              </div>
            </div>

            {/* Content Security Policy */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Content Security Policy (CSP)</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
                <div>
                  <Label style={{ color: "#D6E4F0" }}>Enable Content Security Policy</Label>
                  <p className="text-sm" style={{ color: "#8FA3B7" }}>Protect against XSS and data injection attacks</p>
                </div>
                <Switch
                  checked={cspEnabled}
                  onCheckedChange={setCspEnabled}
                />
              </div>

              {cspEnabled && (
                <div className="space-y-2">
                  <Label style={{ color: "#D6E4F0" }}>CSP Directives</Label>
                  <Textarea
                    value={cspDirectives}
                    onChange={(e) => setCspDirectives(e.target.value)}
                    rows={6}
                    placeholder="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
                    style={{ 
                      background: "#0A0F17", 
                      borderColor: "#ffffff25", 
                      color: "#D6E4F0",
                      fontFamily: "monospace",
                      fontSize: "13px"
                    }}
                  />
                  <p className="text-xs" style={{ color: "#8FA3B7" }}>
                    Define which resources can be loaded and from where. Use semicolons to separate directives.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Common CSP Directives:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• default-src: Fallback for all resource types</li>
                  <li>• script-src: JavaScript sources</li>
                  <li>• style-src: CSS sources</li>
                  <li>• img-src: Image sources</li>
                  <li>• connect-src: AJAX, WebSocket, EventSource</li>
                  <li>• font-src: Web fonts sources</li>
                </ul>
              </div>

              {cspEnabled && (
                <div className="p-4 rounded-lg space-y-2" style={{ background: "#FEF3C7", borderColor: "#F59E0B", border: "1px solid" }}>
                  <p className="text-sm font-medium" style={{ color: "#92400E" }}>⚠️ CSP Configuration Warning</p>
                  <p className="text-xs" style={{ color: "#92400E" }}>
                    Incorrect CSP configuration can break your application. Test thoroughly in development before enabling in production. Monitor CSP violation reports.
                  </p>
                </div>
              )}
            </div>

            {/* SSL/TLS Settings */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>SSL/TLS Configuration</Label>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: sslEnforced ? "#10B981" : "#0A0F17", borderColor: sslEnforced ? "#059669" : "#ffffff15", border: "1px solid" }}>
                <div>
                  <Label style={{ color: sslEnforced ? "#ffffff" : "#D6E4F0" }}>Enforce SSL/HTTPS</Label>
                  <p className="text-sm" style={{ color: sslEnforced ? "#D1FAE5" : "#8FA3B7" }}>
                    {sslEnforced ? "All HTTP requests redirected to HTTPS" : "HTTP connections allowed"}
                  </p>
                </div>
                <Switch
                  checked={sslEnforced}
                  onCheckedChange={setSslEnforced}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Minimum TLS Version</Label>
                <select
                  value={tlsVersion}
                  onChange={(e) => setTlsVersion(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg"
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
                >
                  <option value="1.0">TLS 1.0 (Legacy - Not Recommended)</option>
                  <option value="1.1">TLS 1.1 (Deprecated)</option>
                  <option value="1.2">TLS 1.2 (Recommended)</option>
                  <option value="1.3">TLS 1.3 (Most Secure)</option>
                </select>
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  Minimum TLS protocol version required for connections. TLS 1.2+ recommended.
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>SSL/TLS Security Features:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• Automatic HTTPS redirect for all connections</li>
                  <li>• HTTP Strict Transport Security (HSTS) enabled</li>
                  <li>• Strong cipher suite selection</li>
                  <li>• Perfect Forward Secrecy (PFS) support</li>
                </ul>
              </div>

              {!sslEnforced && (
                <div className="p-4 rounded-lg space-y-2" style={{ background: "#EF4444", borderColor: "#DC2626", border: "1px solid" }}>
                  <p className="text-sm font-medium" style={{ color: "#ffffff" }}>⚠️ Security Risk</p>
                  <p className="text-xs" style={{ color: "#FEE2E2" }}>
                    SSL enforcement is disabled. User data and credentials may be transmitted insecurely. Enable HTTPS for production environments.
                  </p>
                </div>
              )}
            </div>

            {/* Audit Log Retention */}
            <div className="space-y-4">
              <Label style={{ color: "#D6E4F0", fontSize: "16px", fontWeight: "600" }}>Audit Log Retention</Label>
              
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>Retention Period (days)</Label>
                <Input
                  type="number"
                  value={auditLogRetention}
                  onChange={(e) => setAuditLogRetention(Number(e.target.value))}
                  min={1}
                  max={3650}
                  style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                />
                <p className="text-xs" style={{ color: "#8FA3B7" }}>
                  How long to keep audit logs before automatic deletion. Recommended: 90-365 days.
                </p>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Audit Log Includes:</p>
                <ul className="text-sm space-y-1" style={{ color: "#8FA3B7" }}>
                  <li>• User authentication events (login, logout, failed attempts)</li>
                  <li>• Admin actions and configuration changes</li>
                  <li>• Database modifications and deletions</li>
                  <li>• API access and rate limit violations</li>
                  <li>• Security-related events and policy changes</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                <p className="text-sm font-medium" style={{ color: "#D6E4F0" }}>Storage Estimate:</p>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>
                  Current retention: {auditLogRetention} days
                  <br />
                  {auditLogRetention < 30 && "⚠️ Short retention period - may not meet compliance requirements"}
                  {auditLogRetention >= 30 && auditLogRetention < 90 && "✓ Minimum retention for basic compliance"}
                  {auditLogRetention >= 90 && auditLogRetention < 365 && "✓ Recommended retention for most organizations"}
                  {auditLogRetention >= 365 && "✓ Extended retention for strict compliance requirements"}
                </p>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Security")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </TabsContent>

        {/* Authentication Settings */}
        <TabsContent value="auth">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Enable Email Sign-up</Label>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow users to register with email</p>
              </div>
              <Switch
                checked={enableEmailSignup}
                onCheckedChange={setEnableEmailSignup}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Enable Google OAuth</Label>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow Google authentication</p>
              </div>
              <Switch
                checked={enableGoogleOAuth}
                onCheckedChange={setEnableGoogleOAuth}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Enable GitHub OAuth</Label>
                <p className="text-sm" style={{ color: "#8FA3B7" }}>Allow GitHub authentication</p>
              </div>
              <Switch
                checked={enableGithubOAuth}
                onCheckedChange={setEnableGithubOAuth}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Minimum Password Length</Label>
              <Input
                type="number"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Require Special Characters in Password</Label>
              </div>
              <Switch
                checked={requirePasswordSpecialChar}
                onCheckedChange={setRequirePasswordSpecialChar}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Session Timeout (Hours)</Label>
              <Input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "#0A0F17" }}>
              <div>
                <Label style={{ color: "#D6E4F0" }}>Enforce 2FA for All Users</Label>
              </div>
              <Switch
                checked={enable2FA}
                onCheckedChange={setEnable2FA}
              />
            </div>

            <Button onClick={() => handleSaveSettings("Authentication")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Authentication Settings
            </Button>
          </div>
        </TabsContent>

        {/* Email Configuration */}
        <TabsContent value="email">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>SMTP Host</Label>
              <Input
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>SMTP Port</Label>
              <Input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>SMTP Username</Label>
              <Input
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>From Address</Label>
              <Input
                value={smtpFromAddress}
                onChange={(e) => setSmtpFromAddress(e.target.value)}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <Button onClick={() => handleSaveSettings("Email")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Email Settings
            </Button>
          </div>
        </TabsContent>

        {/* AI Configuration */}
        <TabsContent value="ai">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>OpenAI API Key</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-..."
                    style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
                  />
                  <Button 
                    onClick={handleTestConnection}
                    disabled={!openaiApiKey && !localStorage.getItem("openai_api_key")}
                    style={{ 
                      background: connectionStatus === "success" ? "#10B981" : connectionStatus === "error" ? "#EF4444" : "#6B7280",
                      color: "#ffffff",
                      minWidth: "120px"
                    }}
                  >
                    {testingConnection ? "Testing..." : connectionStatus === "success" ? "Connected ✓" : connectionStatus === "error" ? "Failed ✗" : "Test"}
                  </Button>
                </div>
                <Button
                  onClick={() => setChatTestOpen(true)}
                  disabled={!openaiApiKey && !localStorage.getItem("openai_api_key")}
                  style={{ background: "#4CB3FF", color: "#ffffff", width: "100%" }}
                  className="flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat to Test
                </Button>
              </div>
              <p className="text-xs" style={{ color: "#8FA3B7" }}>
                Enter your OpenAI API key to enable AI functionality
              </p>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Default AI Model</Label>
              <select
                value={defaultAIModel}
                onChange={(e) => setDefaultAIModel(e.target.value)}
                className="w-full h-10 px-3 rounded-lg"
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
              >
                <optgroup label="GPT-5 Models (Latest)">
                  <option value="gpt-5.1">GPT-5.1 - Best for coding and agentic tasks with configurable reasoning</option>
                  <option value="gpt-5-mini">GPT-5 mini - Faster, cost-efficient version of GPT-5</option>
                  <option value="gpt-5-nano">GPT-5 nano - Fastest, most cost-efficient version of GPT-5</option>
                </optgroup>
                <optgroup label="O-Series Reasoning Models">
                  <option value="o3-2025-04-16">O3 - Very powerful reasoning model for complex analysis</option>
                  <option value="o4-mini-2025-04-16">O4 mini - Fast reasoning model optimized for coding</option>
                </optgroup>
                <optgroup label="Legacy Models (GPT-4)">
                  <option value="gpt-4o">GPT-4o - Previous generation flagship model</option>
                  <option value="gpt-4o-mini">GPT-4o mini - Previous generation fast model</option>
                </optgroup>
              </select>
              <p className="text-xs" style={{ color: "#8FA3B7" }}>
                This model will be used for all AI-powered features in your app
              </p>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Temperature: {aiTemperature}</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={aiTemperature}
                onChange={(e) => setAiTemperature(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Max Tokens</Label>
              <Input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>AI Rate Limit (Requests/Hour)</Label>
              <Input
                type="number"
                value={aiRateLimit}
                onChange={(e) => setAiRateLimit(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <Button onClick={() => handleSaveSettings("AI")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save AI Settings
            </Button>
          </div>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Max Storage per User (MB)</Label>
              <Input
                type="number"
                value={maxStoragePerUser}
                onChange={(e) => setMaxStoragePerUser(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Allowed File Types</Label>
              <Input
                value={allowedFileTypes}
                onChange={(e) => setAllowedFileTypes(e.target.value)}
                placeholder=".jpg, .png, .pdf"
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Max File Size (MB)</Label>
              <Input
                type="number"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <Button onClick={() => handleSaveSettings("Storage")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Storage Settings
            </Button>
          </div>
        </TabsContent>

        {/* Credit System */}
        <TabsContent value="credits">
          <div className="rounded-lg border p-6 space-y-4" style={{ background: "#0B111A", borderColor: "#ffffff15" }}>
            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Default Credits per New User</Label>
              <Input
                type="number"
                value={defaultCreditsPerUser}
                onChange={(e) => setDefaultCreditsPerUser(Number(e.target.value))}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Credit Reset Schedule</Label>
              <select
                value={creditResetSchedule}
                onChange={(e) => setCreditResetSchedule(e.target.value)}
                className="w-full h-10 px-3 rounded-lg"
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0", border: "1px solid" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <Button onClick={() => handleSaveSettings("Credits")} style={{ background: "#4CB3FF", color: "#ffffff" }}>
              <Save className="w-4 h-4 mr-2" />
              Save Credit Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Test Dialog */}
      <Dialog open={chatTestOpen} onOpenChange={setChatTestOpen}>
        <DialogContent style={{ background: "#0B111A", borderColor: "#ffffff15", maxWidth: "500px" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#D6E4F0" }}>Test AI Chat Connection</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-3 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
              <p className="text-sm font-medium mb-2" style={{ color: "#D6E4F0" }}>Connection Status:</p>
              <p className="text-sm" style={{ color: "#8FA3B7" }}>
                Model: <span style={{ color: "#4CB3FF" }}>{defaultAIModel}</span>
              </p>
              <p className="text-sm" style={{ color: "#8FA3B7" }}>
                API Key: <span style={{ color: "#10B981" }}>{openaiApiKey || localStorage.getItem("openai_api_key") ? "Connected ✓" : "Not Set"}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#D6E4F0" }}>Test Message</Label>
              <Textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type a test message... (e.g., 'Hello, how are you?')"
                rows={3}
                style={{ background: "#0A0F17", borderColor: "#ffffff25", color: "#D6E4F0" }}
              />
            </div>

            <Button
              onClick={handleTestChat}
              disabled={testingChat || !testMessage.trim()}
              style={{ background: "#4CB3FF", color: "#ffffff", width: "100%" }}
            >
              {testingChat ? "Sending..." : "Send Test Message"}
            </Button>

            {testResponse && (
              <div className="space-y-2">
                <Label style={{ color: "#D6E4F0" }}>AI Response:</Label>
                <div className="p-3 rounded-lg" style={{ background: "#0A0F17", borderColor: "#ffffff15", border: "1px solid" }}>
                  <p className="text-sm" style={{ color: "#D6E4F0" }}>{testResponse}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
