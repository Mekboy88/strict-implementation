import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Ban, Trash2 } from "lucide-react";

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "suspend" | "delete" | null;
  selectedCount: number;
  onConfirm: (reason: string, duration?: string) => Promise<void>;
}

export const BulkActionsDialog = ({ 
  open, 
  onOpenChange, 
  action, 
  selectedCount, 
  onConfirm 
}: BulkActionsDialogProps) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await onConfirm(reason, action === "suspend" ? duration : undefined);
      onOpenChange(false);
      setReason("");
      setDuration("7");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setReason("");
      setDuration("7");
    }
  };

  const isSuspend = action === "suspend";
  const Icon = isSuspend ? Ban : Trash2;
  const title = isSuspend ? "Bulk Suspend Users" : "Bulk Delete Users";
  const description = isSuspend 
    ? `You are about to suspend ${selectedCount} user(s). They will be unable to access the platform until unsuspended.`
    : `You are about to permanently delete ${selectedCount} user(s). This action cannot be undone and all their data will be removed.`;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-neutral-800 border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <Icon className={`w-5 h-5 ${isSuspend ? 'text-yellow-500' : 'text-red-500'}`} />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          {isSuspend && (
            <div>
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
          )}
          <div>
            <Label className="text-white mb-2 block">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Explain why these users are being ${isSuspend ? 'suspended' : 'deleted'}...`}
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500 min-h-[80px]"
            />
          </div>
          <div className="bg-neutral-700/50 rounded-lg p-3 border border-neutral-600">
            <div className="flex items-center gap-2 text-neutral-300">
              <Users className="w-4 h-4" />
              <span className="font-medium">{selectedCount} user(s) selected</span>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-neutral-600 text-white hover:bg-neutral-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className={`${isSuspend ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
          >
            {loading ? "Processing..." : `${isSuspend ? 'Suspend' : 'Delete'} ${selectedCount} User(s)`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
