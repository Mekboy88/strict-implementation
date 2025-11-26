import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";
import { 
  Download, 
  FileJson, 
  FolderArchive, 
  FileCode,
  Info
} from "lucide-react";

interface ExportProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
  } | null;
}

type ExportFormat = "zip" | "json";

export function ExportProjectDialog({
  open,
  onOpenChange,
  project,
}: ExportProjectDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("zip");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!project) return;
    setExporting(true);

    try {
      // Fetch all project files
      const { data: files, error } = await supabase
        .from("project_files")
        .select("file_path, file_content")
        .eq("project_id", project.id);

      if (error || !files) {
        toast.error("Failed to fetch project files");
        return;
      }

      if (files.length === 0) {
        toast.error("No files found in project");
        return;
      }

      const sanitizedName = project.name.replace(/[^a-z0-9]/gi, "_");

      if (format === "zip") {
        // Create ZIP with folder structure
        const zip = new JSZip();
        
        files.forEach((file) => {
          // Add file to zip with its path
          zip.file(file.file_path, file.file_content || "");
        });

        // Generate ZIP blob
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${sanitizedName}.zip`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success(`Project exported as ZIP (${files.length} files)`);
      } else {
        // JSON export
        const exportData = {
          projectName: project.name,
          exportedAt: new Date().toISOString(),
          fileCount: files.length,
          files: files.map((f) => ({
            path: f.file_path,
            content: f.file_content,
          })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${sanitizedName}-export.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success(`Project exported as JSON (${files.length} files)`);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export project");
    } finally {
      setExporting(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-800 border-neutral-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Download className="h-5 w-5 text-blue-400" />
            Export Project
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Export "{project.name}" to your computer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-white font-medium">Select Export Format</Label>
            
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="space-y-3"
            >
              {/* ZIP Option - Recommended */}
              <div 
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  format === "zip" 
                    ? "bg-blue-600/20 border-blue-500" 
                    : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
                }`}
                onClick={() => setFormat("zip")}
              >
                <RadioGroupItem value="zip" id="zip" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="h-5 w-5 text-blue-400" />
                    <Label htmlFor="zip" className="text-white font-medium cursor-pointer">
                      ZIP Archive
                    </Label>
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    Downloads as a .zip file with the complete folder structure. 
                    Extract and open directly in VS Code, WebStorm, or any IDE.
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                    <FileCode className="h-3 w-3" />
                    Ready to use in any code editor
                  </div>
                </div>
              </div>

              {/* JSON Option */}
              <div 
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  format === "json" 
                    ? "bg-blue-600/20 border-blue-500" 
                    : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
                }`}
                onClick={() => setFormat("json")}
              >
                <RadioGroupItem value="json" id="json" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-yellow-400" />
                    <Label htmlFor="json" className="text-white font-medium cursor-pointer">
                      JSON File
                    </Label>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    Downloads as a single .json file containing all files and metadata.
                    Useful for backup or data transfer between systems.
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
                    <Info className="h-3 w-3" />
                    Requires processing to extract files
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-neutral-700/50 border border-neutral-600">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
              <div className="text-sm text-neutral-300">
                {format === "zip" ? (
                  <>
                    <strong>After download:</strong> Extract the ZIP file, then open the folder 
                    in your preferred code editor. Run <code className="bg-neutral-600 px-1 rounded">npm install</code> to 
                    install dependencies.
                  </>
                ) : (
                  <>
                    <strong>JSON format:</strong> Contains file paths and contents as structured data. 
                    You'll need to parse and extract the files manually or use a script.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export as {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
