import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center p-12 bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-800 p-6 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
          <p className="text-sm mt-1 text-white">Manage system configuration</p>
        </div>
        <Button
          onClick={fetchSettings}
          className="bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {settings.length === 0 ? (
        <div className="rounded-lg border bg-neutral-700 border-neutral-600 p-12 text-center">
          <p className="text-white">No platform settings configured yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="rounded-lg border bg-neutral-700 border-neutral-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{setting.setting_key}</h3>
                  <p className="text-xs text-white">
                    Last updated: {setting.updated_at ? new Date(setting.updated_at).toLocaleString() : "Never"}
                  </p>
                </div>
                <Button
                  onClick={() => handleSave(setting.setting_key)}
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <textarea
                value={editedSettings[setting.setting_key] || ""}
                onChange={(e) =>
                  setEditedSettings((prev) => ({
                    ...prev,
                    [setting.setting_key]: e.target.value,
                  }))
                }
                className="w-full h-32 rounded-lg border bg-neutral-800 border-neutral-600 text-white p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSettings;