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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: { id: string; name: string; ownerEmail?: string } | null;
  onTransfer: (projectId: string, newOwnerEmail: string) => Promise<void>;
}

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  project,
  onTransfer,
}: TransferOwnershipDialogProps) {
  const [email, setEmail] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !email || confirmName !== project.name) return;

    setIsLoading(true);
    try {
      await onTransfer(project.id, email);
      onOpenChange(false);
      setEmail("");
      setConfirmName("");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = email && confirmName === project?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <UserPlus className="h-5 w-5 text-amber-400" />
            Transfer Ownership
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Transfer "{project?.name}" to a new owner
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-500/10 border-amber-500/30">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200 text-sm">
            This action will transfer full ownership of this project. The current owner will lose access unless added as a member.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentOwner" className="text-neutral-400">Current Owner</Label>
              <Input
                id="currentOwner"
                value={project?.ownerEmail || ""}
                disabled
                className="bg-neutral-700 border-neutral-600 text-neutral-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOwner" className="text-white">New Owner Email</Label>
              <Input
                id="newOwner"
                type="email"
                placeholder="Enter new owner's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-white">
                Type "{project?.name}" to confirm
              </Label>
              <Input
                id="confirm"
                placeholder="Enter project name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                required
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-neutral-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !isValid}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Transfer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
