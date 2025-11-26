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
import { AlertTriangle } from "lucide-react";

interface SuspendUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; user_id: string; email?: string } | null;
  onSuspend: (userId: string, duration: string) => Promise<void>;
}

export const SuspendUserDialog = ({ open, onOpenChange, user, onSuspend }: SuspendUserDialogProps) => {
  const [duration, setDuration] = useState("7");
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await onSuspend(user.user_id, duration);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Suspend User
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Suspend {user?.email} from accessing the platform
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-white mb-2 block">Suspension Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600">
              <SelectItem value="1" className="text-white hover:bg-neutral-600">1 Day</SelectItem>
              <SelectItem value="7" className="text-white hover:bg-neutral-600">7 Days</SelectItem>
              <SelectItem value="30" className="text-white hover:bg-neutral-600">30 Days</SelectItem>
              <SelectItem value="90" className="text-white hover:bg-neutral-600">90 Days</SelectItem>
              <SelectItem value="permanent" className="text-white hover:bg-neutral-600">Permanent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-neutral-600 text-white hover:bg-neutral-700">
            Cancel
          </Button>
          <Button onClick={handleSuspend} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
            {loading ? "Suspending..." : "Suspend User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
