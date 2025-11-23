import { useState } from "react";
import { 
  Wand2, Zap, Lightbulb, Bug, 
  FileCode2, Sparkles, Code2, FileText,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight,
  Database, Smartphone, TrendingUp,
  MapPin, Link2, Eye, X, Scale, FileWarning
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface MainActionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAction: (action: string) => void;
}

const MainActionsDrawer = ({ open, onOpenChange, onSelectAction }: MainActionsDrawerProps) => {
  const quickActions = [
    { id: "fix", icon: Bug, label: "Fix Issues", description: "Auto-fix code issues" },
    { id: "refactor", icon: Code2, label: "Refactor", description: "Improve code structure" },
    { id: "explain", icon: FileText, label: "Explain", description: "Explain code" },
    { id: "optimize", icon: Zap, label: "Optimize", description: "Improve performance" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
          <SheetDescription>
            Select an action to perform on your code
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-full mt-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => {
                    onSelectAction(action.id);
                    onOpenChange(false);
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MainActionsDrawer;
