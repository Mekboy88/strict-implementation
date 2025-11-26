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
import { Textarea } from "@/components/ui/textarea";
import { Coins, Loader2 } from "lucide-react";

interface GiveCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; email: string; full_name?: string } | null;
  onGiveCredits: (userId: string, amount: number, reason: string) => Promise<void>;
}

export function GiveCreditsDialog({
  open,
  onOpenChange,
  user,
  onGiveCredits,
}: GiveCreditsDialogProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount) return;

    const creditAmount = parseInt(amount);
    if (isNaN(creditAmount) || creditAmount <= 0) return;

    setIsLoading(true);
    try {
      await onGiveCredits(user.id, creditAmount, reason);
      onOpenChange(false);
      setAmount("");
      setReason("");
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [100, 500, 1000, 5000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Coins className="h-5 w-5 text-amber-400" />
            Give AI Credits
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Grant AI/Token credits to {user?.full_name || user?.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Credit Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
              />
              <div className="flex gap-2 flex-wrap">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    className="text-xs border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
                  >
                    +{preset}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-white">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Welcome bonus, Support compensation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
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
            <Button type="submit" disabled={isLoading || !amount} className="bg-amber-600 hover:bg-amber-700 text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Granting...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Give Credits
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
