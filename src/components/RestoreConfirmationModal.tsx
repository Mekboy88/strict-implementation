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
import { CheckCircle, XCircle } from "lucide-react";

interface RestoreConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  previewDescription: string;
}

const RestoreConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  previewDescription,
}: RestoreConfirmationModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-ide-panel border-ide-border animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Restore this preview?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This will revert your project to the state it was when this preview was created:
            <span className="block mt-2 text-sm font-medium text-foreground">
              "{previewDescription}"
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Restore
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestoreConfirmationModal;
