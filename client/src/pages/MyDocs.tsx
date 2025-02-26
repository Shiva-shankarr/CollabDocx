import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  File,
  Plus,
  Search,
  Grid,
  List,
  Edit3,
  Eye,
  Crown,
  Trash,
  Loader2,
} from "lucide-react";
import { BACKEND_URL } from "@/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

type Document = {
  id: string;
  title: string;
  content: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const DocumentCard: React.FC<{
  data: Document;
  onClick: (id: string) => void;
  viewMode: "grid" | "list";
  onDelete: (id: string) => void;
  isDeleting: boolean;
}> = ({ data, onClick, viewMode, onDelete, isDeleting }) => {
  const date = new Date(data.updatedAt);
  const readableDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  function parseHTMLToText(htmlString : string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }
  
  const getAccessIcon = () => {
    switch (data.role) {
      case "OWNER":
        return <Crown className="w-4 h-4 text-blue-500" />;
      case "EDITOR":
        return <Edit3 className="w-4 h-4 text-sky-500" />;
      default:
        return <Eye className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`
          cursor-pointer 
          border-transparent
          bg-white 
          shadow-lg 
          hover:shadow-xl
          transition-all 
          duration-300 
          hover:border-blue-500
          hover:ring-2
          hover:ring-blue-200
          group
          ${viewMode === "list" ? "w-full" : ""}
        `}
      >
        <CardHeader className="flex flex-row items-center border-b border-slate-100 justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-blue-500" />
            <CardTitle 
              onClick={() => onClick(data.id)} 
              className="hover:underline text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors"
            >
              {data.title}
            </CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{getAccessIcon()}</TooltipTrigger>
                <TooltipContent>
                  {data.role === "OWNER"
                    ? "Owner"
                    : data.role === "EDITOR"
                    ? "Edit Access"
                    : "Read-Only"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {data.role === "OWNER" && (
              isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Trash
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(data.id);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Delete Document</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
          </div>
        </CardHeader>
        <CardContent className="py-3">
          <p className="text-md text-slate-600 line-clamp-2 truncate opacity-80">
            {parseHTMLToText(data.content) || "No content yet"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {data.role}
          </span>
          <span>Updated: {readableDate}</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function MyDocs() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/document/myDocs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setDocs(res.data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch documents, try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Memoized document categorization and filtering
  const documentSections = useMemo(() => {
    const ownedDocs = docs.filter((doc) => doc.role === "OWNER");
    const editableDocs = docs.filter((doc) => doc.role === "EDITOR");
    const readOnlyDocs = docs.filter((doc) => doc.role === "VIEWER");

    return {
      ownedDocs,
      editableDocs,
      readOnlyDocs,
    };
  }, [docs]);

  // Sorting function with memoization
  const sortDocuments = (documents: Document[]) => {
    return [...documents].sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  // Handle document deletion
  const handleDelete = async (id: string) => {
    setDeletingDocId(id);
    try {
      await axios.delete(`${BACKEND_URL}/document/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setDocs((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
      toast({
        title: "Document deleted",
        description: "Your document has been deleted.",
        className: 'text-white bg-green-800'
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document, try again",
        variant: "destructive",
      });
    } finally {
      setDeletingDocId(null);
    }
  };

  // Handle document creation
  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) return;

    setCreateLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/document/create`,
        { title: newDocTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Reset create document state
      setNewDocTitle("");
      setIsCreateDialogOpen(false);
      
      // Add new document to the beginning of docs
      // Ensure the new document has all required fields
      const newDoc: Document = {
        ...response.data.doc,
        role: "OWNER", // Assuming creator is always owner
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setDocs((prevDocs) => [newDoc, ...prevDocs]);
      
      toast({
        title: `Doc ${newDocTitle} created successfully`,
        description: "You can now start editing",
        className: 'text-white bg-green-800'
      });
      
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create document, try again",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Render document section with filtering and sorting
  const renderDocumentSection = (
    title: string,
    documents: Document[],
    icon: React.ReactNode
  ) => {
    // Filter documents based on search query
    const filteredDocs = documents.filter((doc) =>
      searchQuery === "" || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort filtered documents
    const sortedDocs = sortDocuments(filteredDocs);

    // Don't render if no documents
    if (sortedDocs.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4 space-x-3">
          {icon}
          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        </div>
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-4`}
        >
          <AnimatePresence>
            {sortedDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                data={doc}
                viewMode={viewMode}
                onClick={(docId: string) =>
                  navigate(`/document/${docId}`, { state: { role: doc.role } })
                }
                onDelete={handleDelete}
                isDeleting={deletingDocId === doc.id}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-16 bg-slate-50 relative"
      >
        <main className="max-w-[1500px] w-11/12 md:w-10/12 mx-auto px-4 py-8 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl text-center md:text-left font-bold text-slate-900 mb-2">
              My Documents
            </h1>
            <p className="text-slate-600 text-center md:text-left">
              Manage and access all your documents in one place
            </p>
          </motion.div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/55 border border-slate-300 rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center space-x-4">
                <div className="flex items-center justify-evenly gap-3">
                  <div className="items-center hidden md:block bg-slate-200 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-5 h-5" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-5 h-5" />
                    </Button>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    {/* Previous code continues... */}
                    <SelectContent>
                      <SelectItem value="recent">Recently Modified</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r mt-2 md:mt-0 from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      New Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter document title"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateDocument}
                          disabled={!newDocTitle.trim() || createLoading}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                        >
                          {createLoading ? (
                            <div className="flex items-center">
                              <Loader2 className="animate-spin mr-2" />
                              Creating...
                            </div>
                          ) : (
                            "Create"
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>

          {/* Documents Sections */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : (
            <>
              {docs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <File className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No documents found
                  </h3>
                  <p className="text-slate-600">
                    {searchQuery
                      ? "Try a different search term"
                      : "Create your first document to get started"}
                  </p>
                  
                </motion.div>
              ) : (
                <>
                  {renderDocumentSection(
                    "Owned Documents",
                    documentSections.ownedDocs,
                    <Crown className="w-6 h-6 text-blue-500" />
                  )}
                  {renderDocumentSection(
                    "Editable Documents",
                    documentSections.editableDocs,
                    <Edit3 className="w-6 h-6 text-sky-500" />
                  )}
                  {renderDocumentSection(
                    "Read-Only Documents",
                    documentSections.readOnlyDocs,
                    <Eye className="w-6 h-6 text-slate-500" />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </motion.div>
    </>
  );
}