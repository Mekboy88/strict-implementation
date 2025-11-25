import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, RefreshCw } from "lucide-react";

interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  updated_at: string | null;
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("platform_settings")
      .select("*")
      .order("setting_key");
    
    if (data) {
      setSettings(data);
      const edited: Record<string, string> = {};
      data.forEach((s) => {
        edited[s.setting_key] = JSON.stringify(s.setting_value, null, 2);
      });
      setEditedSettings(edited);
    }
    setLoading(false);
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const parsed = JSON.parse(editedSettings[key]);
      await supabase
        .from("platform_settings")
        .update({ setting_value: parsed, updated_at: new Date().toISOString() })
        .eq("setting_key", key);
      await fetchSettings();
    } catch (e) {
      console.error("Invalid JSON");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-sm mt-1 text-muted-foreground">Manage system configuration</p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {settings.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No platform settings configured yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{setting.setting_key}</h3>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {setting.updated_at ? new Date(setting.updated_at).toLocaleString() : "Never"}
                  </p>
                </div>
                <button
                  onClick={() => handleSave(setting.setting_key)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
              <textarea
                value={editedSettings[setting.setting_key] || ""}
                onChange={(e) =>
                  setEditedSettings((prev) => ({
                    ...prev,
                    [setting.setting_key]: e.target.value,
                  }))
                }
                className="w-full h-32 rounded-lg border border-border bg-background text-foreground p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
