import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  StickyNote,
  Plus,
  Trash2,
  Pin,
  PinOff,
  Edit2,
  Save,
  X,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string | null;
  user_id: string;
  team_id: string | null;
  is_pinned: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

const NOTE_COLORS = [
  { value: "default", bg: "bg-neutral-700", border: "border-neutral-600" },
  { value: "yellow", bg: "bg-yellow-900/30", border: "border-yellow-700/50" },
  { value: "green", bg: "bg-green-900/30", border: "border-green-700/50" },
  { value: "blue", bg: "bg-blue-900/30", border: "border-blue-700/50" },
  { value: "purple", bg: "bg-purple-900/30", border: "border-purple-700/50" },
  { value: "red", bg: "bg-red-900/30", border: "border-red-700/50" },
];

export const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: "default" });
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "", color: "default" });
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleNoteExpanded = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const isContentLong = (content: string | null) => {
    if (!content) return false;
    return content.length > 150 || content.split('\n').length > 3;
  };

  const truncateContent = (content: string) => {
    const lines = content.split('\n');
    if (lines.length > 3) {
      return lines.slice(0, 3).join('\n') + '...';
    }
    if (content.length > 150) {
      return content.slice(0, 150) + '...';
    }
    return content;
  };

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("team_notes")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes((data as Note[]) || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  const createNote = async () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("team_notes").insert({
        title: newNote.title,
        content: newNote.content || null,
        user_id: user.id,
        color: newNote.color,
      });

      if (error) throw error;

      toast.success("Note created");
      setNewNote({ title: "", content: "", color: "default" });
      setShowNewNoteForm(false);
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const updateNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("team_notes")
        .update({
          title: editForm.title,
          content: editForm.content || null,
          color: editForm.color,
        })
        .eq("id", noteId);

      if (error) throw error;

      toast.success("Note updated");
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase.from("team_notes").delete().eq("id", noteId);

      if (error) throw error;

      toast.success("Note deleted");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const togglePin = async (noteId: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("team_notes")
        .update({ is_pinned: !currentPinned })
        .eq("id", noteId);

      if (error) throw error;

      fetchNotes();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditForm({
      title: note.title,
      content: note.content || "",
      color: note.color,
    });
  };

  const getColorClasses = (color: string) => {
    const colorConfig = NOTE_COLORS.find((c) => c.value === color) || NOTE_COLORS[0];
    return `${colorConfig.bg} ${colorConfig.border}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors">
          <StickyNote className="h-5 w-5" />
          {notes.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-600 hover:bg-blue-600">
              {notes.length}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-neutral-800 border-neutral-700 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Team Notes
            <Badge variant="outline" className="ml-2 border-neutral-600 text-neutral-300">
              {notes.length}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* New Note Button/Form */}
          {!showNewNoteForm ? (
            <Button
              onClick={() => setShowNewNoteForm(true)}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Note
            </Button>
          ) : (
            <div className="p-4 rounded-lg border border-neutral-600 bg-neutral-700 space-y-3">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="bg-neutral-800 border-neutral-600 text-white"
              />
              <Textarea
                placeholder="Note content..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="bg-neutral-800 border-neutral-600 text-white min-h-[100px]"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">Color:</span>
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewNote({ ...newNote, color: color.value })}
                    className={`h-6 w-6 rounded-full ${color.bg} border-2 ${
                      newNote.color === color.value
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={createNote}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
                <Button
                  onClick={() => {
                    setShowNewNoteForm(false);
                    setNewNote({ title: "", content: "", color: "default" });
                  }}
                  variant="outline"
                  className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border ${getColorClasses(note.color)} relative`}
                >
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="bg-neutral-800 border-neutral-600 text-white"
                      />
                      <Textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        className="bg-neutral-800 border-neutral-600 text-white min-h-[80px]"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-400">Color:</span>
                        {NOTE_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() =>
                              setEditForm({ ...editForm, color: color.value })
                            }
                            className={`h-6 w-6 rounded-full ${color.bg} border-2 ${
                              editForm.color === color.value
                                ? "border-white"
                                : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateNote(note.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingNote(null)}
                          size="sm"
                          variant="outline"
                          className="bg-neutral-600 border-neutral-500 text-white hover:bg-neutral-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{note.title}</h4>
                            {note.is_pinned && (
                              <Pin className="h-3 w-3 text-yellow-400" />
                            )}
                            {note.team_id && (
                              <Badge
                                variant="outline"
                                className="text-xs border-neutral-500 text-neutral-400"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                Team
                              </Badge>
                            )}
                          </div>
                          {note.content && (
                            <div className="mt-1">
                              <p className={`text-sm text-neutral-300 whitespace-pre-wrap ${
                                !expandedNotes.has(note.id) && isContentLong(note.content) 
                                  ? "max-h-[60px] overflow-hidden" 
                                  : ""
                              }`}>
                                {expandedNotes.has(note.id) || !isContentLong(note.content)
                                  ? note.content
                                  : truncateContent(note.content)
                                }
                              </p>
                              {isContentLong(note.content) && (
                                <button
                                  onClick={() => toggleNoteExpanded(note.id)}
                                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
                                >
                                  {expandedNotes.has(note.id) ? (
                                    <>
                                      <ChevronUp className="h-3 w-3" />
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3" />
                                      Show more
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(note.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePin(note.id, note.is_pinned)}
                            className="p-1.5 rounded hover:bg-neutral-600 text-neutral-400 hover:text-yellow-400"
                          >
                            {note.is_pinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => startEditing(note)}
                            className="p-1.5 rounded hover:bg-neutral-600 text-neutral-400 hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 rounded hover:bg-neutral-600 text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
