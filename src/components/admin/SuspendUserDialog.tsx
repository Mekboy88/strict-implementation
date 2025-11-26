import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Eye } from "lucide-react";

interface SuspendUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string } | null;
  onSuspend: (userId: string, duration: string, reason: string) => Promise<void>;
}

const getDurationText = (duration: string) => {
  switch (duration) {
    case "1": return "1 day";
    case "7": return "7 days";
    case "30": return "30 days";
    case "90": return "90 days";
    case "permanent": return "permanently";
    default: return duration + " days";
  }
};

export const SuspendUserDialog = ({ open, onOpenChange, user, onSuspend }: SuspendUserDialogProps) => {
  const [duration, setDuration] = useState("7");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await onSuspend(user.user_id, duration, reason);
      setReason("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 focus:outline-none [&>*]:focus:outline-none [&_*]:focus:outline-none">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Suspend User
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Suspend {user?.email} from accessing the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Duration Selection */}
          <div>
            <Label className="text-white mb-2 block">Suspension Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600">
                <SelectItem value="1" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">1 Day</SelectItem>
                <SelectItem value="7" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">7 Days</SelectItem>
                <SelectItem value="30" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">30 Days</SelectItem>
                <SelectItem value="90" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">90 Days</SelectItem>
                <SelectItem value="permanent" className="text-white hover:bg-neutral-600 focus:bg-neutral-600">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason Field */}
          <div>
            <Label className="text-white mb-2 block">Reason for Suspension</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for suspending this user..."
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 min-h-[80px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 break-words whitespace-pre-wrap"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
          </div>

          {/* Preview Section */}
          <div>
            <Label className="text-white mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              User Notification Preview
            </Label>
            <div className="bg-neutral-900 border border-neutral-600 rounded-md p-4 text-sm overflow-hidden">
              <p className="text-white font-medium mb-2">Your account has been suspended</p>
              <p className="text-neutral-400 mb-2">
                Your account has been suspended {getDurationText(duration)}.
              </p>
              {reason && (
                <p className="text-neutral-400 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span className="text-neutral-300">Reason:</span> {reason}
                </p>
              )}
              {!reason && (
                <p className="text-neutral-500 italic">No reason provided</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)} 
            className="border-neutral-600 text-white hover:bg-neutral-700 focus:ring-0 focus:ring-offset-0"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSuspend} 
            disabled={loading} 
            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-0 focus:ring-offset-0"
          >
            {loading ? "Suspending..." : "Suspend User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
