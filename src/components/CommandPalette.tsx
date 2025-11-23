import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  FileCode, 
  FolderOpen, 
  Palette, 
  Keyboard, 
  Search,
  GitBranch,
  Settings,
  Play,
  Bug,
  Save
} from "lucide-react";
import { useEffect, useState } from "react";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCommand = (action: string) => {
    console.log(`Command: ${action}`);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        className="text-foreground placeholder:text-muted-foreground"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Files">
          <CommandItem onSelect={() => handleCommand("Open File")}>
            <FolderOpen className="mr-2 h-4 w-4 text-blue-400" />
            <span>Open File...</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("New File")}>
            <FileCode className="mr-2 h-4 w-4 text-ide-active/70" />
            <span>New File</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Save File")}>
            <Save className="mr-2 h-4 w-4 text-ide-active/70" />
            <span>Save File</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Recent Files")}>
            <Search className="mr-2 h-4 w-4 text-purple-400" />
            <span>Go to Recent Files</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+R</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem onSelect={() => handleCommand("Switch Theme")}>
            <Palette className="mr-2 h-4 w-4 text-pink-400" />
            <span>Switch Theme</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+K T</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Keyboard Shortcuts")}>
            <Keyboard className="mr-2 h-4 w-4 text-yellow-400" />
            <span>Keyboard Shortcuts</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+K K</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleCommand("Run Code")}>
            <Play className="mr-2 h-4 w-4 text-green-400" />
            <span>Run Code</span>
            <span className="ml-auto text-xs text-muted-foreground">F5</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Debug")}>
            <Bug className="mr-2 h-4 w-4 text-red-400" />
            <span>Start Debugging</span>
            <span className="ml-auto text-xs text-muted-foreground">F9</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Git Commit")}>
            <GitBranch className="mr-2 h-4 w-4 text-orange-400" />
            <span>Git: Commit Changes</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+Enter</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Settings")}>
            <Settings className="mr-2 h-4 w-4 text-gray-400" />
            <span>Open Settings</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+,</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
