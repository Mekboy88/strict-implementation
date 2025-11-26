import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Search, Trash2, UserX, Calendar, Mail, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface BlacklistedUser {
  id: string;
  email: string;
  original_user_id: string | null;
  full_name: string | null;
  deletion_reason: string;
  deleted_by: string | null;
  deleted_at: string;
}

export const BlacklistPanel = () => {
  const { toast } = useToast();
  const [blacklist, setBlacklist] = useState<BlacklistedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BlacklistedUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBlacklist = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("deleted_user_blacklist")
        .select("*")
        .order("deleted_at", { ascending: false });

      if (error) {
        console.error("Error fetching blacklist:", error);
        toast({
          title: "Error",
          description: "Failed to load blacklist",
          variant: "destructive",
        });
        return;
      }

      setBlacklist(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleRemoveFromBlacklist = async () => {
    if (!selectedEntry) return;

    const { error } = await supabase
      .from("deleted_user_blacklist")
      .delete()
      .eq("id", selectedEntry.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove from blacklist",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `${selectedEntry.email} has been removed from the blacklist`,
    });
    setRemoveDialogOpen(false);
    setSelectedEntry(null);
    fetchBlacklist();
  };

  const filteredBlacklist = blacklist.filter(entry =>
    entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.deletion_reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="rounded-lg border p-4 bg-neutral-700 border-neutral-600 inline-block">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <UserX className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Blacklisted Emails</p>
            <p className="text-2xl font-bold text-white">{blacklist.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search by email, name, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-700 border-neutral-600 text-white"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchBlacklist(true)}
          disabled={isRefreshing}
          className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      {filteredBlacklist.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <UserX className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{searchQuery ? "No matching blacklisted users found" : "No blacklisted users yet"}</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden border-neutral-600">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-700 hover:bg-neutral-700">
                <TableHead className="text-neutral-300">Email</TableHead>
                <TableHead className="text-neutral-300">Name</TableHead>
                <TableHead className="text-neutral-300">Reason</TableHead>
                <TableHead className="text-neutral-300">Deleted At</TableHead>
                <TableHead className="text-neutral-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlacklist.map((entry) => (
                <TableRow 
                  key={entry.id} 
                  className="bg-neutral-800 border-neutral-700 hover:bg-neutral-750"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span className="text-white font-medium">{entry.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {entry.full_name || "—"}
                  </TableCell>
                  <TableCell>
                    <p className="text-neutral-300 max-w-xs truncate" title={entry.deletion_reason}>
                      {entry.deletion_reason}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(entry.deleted_at), "MMM d, yyyy HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setRemoveDialogOpen(true);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Remove from Blacklist Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent className="bg-neutral-800 border-neutral-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remove from Blacklist?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to remove{" "}
              <span className="text-white font-medium">{selectedEntry?.email}</span>{" "}
              from the blacklist? This will allow them to create a new account with this email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-600 text-white hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFromBlacklist}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove from Blacklist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
