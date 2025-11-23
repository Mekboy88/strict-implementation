import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Install UR-DEV</h1>
        <p className="text-muted-foreground">
          Install UR-DEV as a Progressive Web App for quick access from your home screen.
        </p>

        {isInstallable ? (
          <Button onClick={handleInstall} size="lg" className="w-full">
            Install App
          </Button>
        ) : (
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              To install on mobile:
              <br />
              <strong>iPhone:</strong> Tap Share → Add to Home Screen
              <br />
              <strong>Android:</strong> Tap Menu → Install App
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
