import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Database } from "lucide-react";

interface CloudIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const CloudIntegration = ({ isOpen, onClose, buttonRef }: CloudIntegrationProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateDatabase = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate("/database");
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[420px] bg-[#0B0B0C] border border-white/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.7)] p-6 animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">UR-DEV Cloud</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          UR-DEV Cloud is a powerful backend infrastructure built for your applications. 
          Get instant access to database, authentication, file storage, edge functions, and more. 
          All automatically configured and ready to use—no complex setup required.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-400 mb-2">What's Included:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• PostgreSQL Database</li>
            <li>• User Authentication</li>
            <li>• File Storage</li>
            <li>• Real-time Updates</li>
            <li>• Edge Functions</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleCreateDatabase}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            <Database className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create UR-DEV Database"}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
