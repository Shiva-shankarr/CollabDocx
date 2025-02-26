import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authAtom } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  History,
  Share2,
  FileText,
  AlertCircle,
  Loader2,
  FileLock2,
  Lock,
} from "lucide-react";
import { BACKEND_URL, BACKEND_WEBSOCKET_URL } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import CurrentUsers from "@/components/CurrentUsers";
import DocumentVersions from "@/components/DocumentVersions";
import React from "react";
import ChatBox from "@/components/ChatBox";
import GeminiChatbox from "@/components/AiChatBox";
const apiURL = import.meta.env.VITE_GEMINI_API_KEY;
interface UserType {
  userId: string;
  name: string;
  role: string;
}

type Access = {
  id: string;
  documentId: string;
  userId: string;
  role: string;
};

type Document = {
  id: string;
  title: string;
  content: string;
  role: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  access?: Access[];
};

interface DocumentVersion {
  id: string;
  name?: string;
  createdAt: string;
  content: string;
  documentId: string;
}
type WebSocketMessageType =
  | "join-doc"
  | "update-data"
  | "current-users"
  | "update-lock"
  | "release-lock"
  | "disconnected-user"
  | "close";

// Interface for authentication user

// Interface for WebSocket message
interface WebSocketMessage {
  type: WebSocketMessageType;
  docId?: string;
  userId?: string;
  name?: string;
  lock?: boolean;
  data?: string;
  users?: string[];
}

type Chat = {
  message: string;
  userId: string;
  time: string;
  name: string;
};

export const SaveVersionComponent = React.memo(
  ({
    versionLoading,
    myRole,
    openVersionDialog,
  }: {
    versionLoading: boolean;
    myRole: string;
    openVersionDialog: () => void;
  }) => {
    console.log("SaveVersionComponent rendered"); // Keep for debugging
    return (
      <Button
        disabled={versionLoading || myRole === "VIEWER"}
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={openVersionDialog}
      >
        <History />
        Save Version
      </Button>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.versionLoading === nextProps.versionLoading &&
      prevProps.myRole === nextProps.myRole
    );
  }
);
export const ShareLinkButton = React.memo(
  ({
    myRole,
    shareLinkLoading,
    generateShareLink,
  }: {
    myRole: string;
    shareLinkLoading: boolean;
    generateShareLink: (access: string) => void;
  }) => {
    console.log("ShareLinkButton rendered"); // Keep for debugging
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="text-blue-700 border-blue-300 hover:bg-blue-50"
            disabled={shareLinkLoading || myRole === "VIEWER"}
          >
            {shareLinkLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4 text-blue-600" />
            )}
            Share Link
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => generateShareLink("VIEWER")}
            className="cursor-pointer"
          >
            Share as Viewer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => generateShareLink("EDITOR")}
            className="cursor-pointer"
          >
            Share as Editor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.myRole === nextProps.myRole &&
      prevProps.shareLinkLoading === nextProps.shareLinkLoading
    );
  }
);

export const CurrentWriterStatus = React.memo(
  ({
    currentWriter,
    lock,
    myRole,
    unsaved,
  }: {
    currentWriter: string | null;
    lock: boolean;
    myRole: string;
    unsaved: boolean;
  }) => {
    // Only render if there's an active writer and the document is locked
    if (!currentWriter || !lock) return null;
    console.log(unsaved);

    return (
      <div className="flex flex-row items-center justify-between px-2">
        <div className="text-sm text-blue-600 mt-2 flex items-center justify-between">
          {lock && myRole != "VIEWER" ? (
            <FileLock2 className="text-red-600" />
          ) : null}
          {currentWriter && lock ? (
            <p className="font-bold px-3">
              Currently {currentWriter} is editing
            </p>
          ) : null}
        </div>
        {unsaved ? (
          <p className="text-red-500 font-medium px-3">{"Unsaved changes"}</p>
        ) : null}
      </div>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.currentWriter === nextProps.currentWriter &&
      prevProps.lock === nextProps.lock &&
      prevProps.myRole === nextProps.myRole &&
      prevProps.unsaved === nextProps.unsaved
    );
  }
);

function DocumentViewer() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currDoc, setCurrDoc] = useState<Document | null>(null);
  const [unsaved, setUnsaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [currentUsers, setCurrentUsers] = useState<UserType[]>([]);
  const [currentWriter, setCurrentWriter] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedShareRole, setSelectedShareRole] = useState<string>("VIEWER");
  const [rollbackVersionId, setRollbackVersionId] = useState<string | null>(
    null
  );
  const [rollbackConfirmDialogOpen, setRollbackConfirmDialogOpen] =
    useState(false);
  const [versionName, setVersionName] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [versionLoading, setVersionLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [shareLinkLoading, setShareLinkLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Chat[]>([]);
  //const [shareMethod, setShareMethod] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [rollbackLoading, setRollbackLoading] = useState(false);
  const auth = useRecoilValue(authAtom);
  const { toast } = useToast();
  const doc = useParams().id;
  const location = useLocation();
  const myRole = location.state.role || "";
  //const [myRole,setMyRole] = useState(role);
  const [lock, setLock] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Ref for debouncing timer
  const DEBOUNCE_DELAY = 5000;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocDetails = async () => {
      setFetchLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(`${BACKEND_URL}/document/${doc}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        //console.log(response);
        setCurrDoc(response.data.doc);
        setText(response.data.doc.content);
        setVersions(response.data.doc.versions);
      } catch (error: any) {
        if (error.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please Login again",
            variant: "destructive",
          });
          navigate("/signin");
          return;
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch document details, try again",
            variant: "destructive",
          });
        }
      } finally {
        setFetchLoading(false);
      }
    };
    fetchDocDetails();
  }, []);

  const socketRef = useRef<WebSocket | null>(null);

  const createWebSocket = useCallback(() => {
    // Prevent creating socket if no user
    if (!auth?.user?.id) return null;

    setLoading(true);
    const ws = new WebSocket(`${BACKEND_WEBSOCKET_URL}`);

    ws.onopen = () => {
      setSocket(ws);
      socketRef.current = ws;

      // Send join document message
      ws.send(
        JSON.stringify({
          type: "join-doc",
          docId: doc,
          name: auth.user?.name,
          role: "read",
          userId: auth.user?.id,
        })
      );

      setLoading(false);
    };

    ws.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      switch (data.type) {
        case "update-data":
          setLock(!!data.lock);
          if (data.data) setText(data.data);
          setCurrentWriter(data.name || null);
          break;
        case "current-users":
          if (data.users) setCurrentUsers(data.users);
          setLock(!!data.lock);
          break;
        case "update-lock":
          if (lock != true) {
            setLock(true);
          }
          break;
        case "release-lock":
          setLock(false);
          toast({
            title: "Lock Released",
            description: "Lock has been released",
            duration: 2000,
          });
          break;
        case "disconnected-user":
          toast({
            title: "User Disconnected",
            description: `${data.name} has disconnected`,
            duration: 2000,
          });
          break;
        case "joined-user":
          toast({
            title: "User Joined",
            description: `${data.name} has joined the document`,
            duration: 2000,
          });
          break;
        case "version":
          setVersions((prev) => [data.version, ...prev]);
          if (myRole != "VIEWER") {
            toast({
              title: "New Version Added",
              description: `New version added to document by ${data.name}`,
              duration: 2000,
            });
          }
          break;
        case "delete-version":
          setVersions((prev) =>
            prev.filter((version) => version.id !== data.versionId)
          );
          if (myRole != "VIEWER") {
            toast({
              title: "Version Deleted",
              description: `Version ${data.versionId} has been deleted by ${data.name}`,
              duration: 2000,
            });
          }
          break;
        case "saved-data":
          setUnsaved(false);
          toast({
            title: "Document Saved",
            description: `Document has been saved by ${data.name}`,
            duration: 2000,
          });
          break;
        case "update-unsaved":
          setUnsaved(data.unsaved);
          break;
        case "rollback":
          setText(data.data);
          toast({
            title: "Document Rolled Back",
            description: `Document has been rolled back to version ${data.rollBackId} by ${data.name}`,
            duration: 2000,
          });
          break;
        case "update-ChatData":
          console.log(data);
          setChatMessages((prev) => [
            ...prev,
            {
              message: data.message,
              userId: data.userId,
              time: data.time,
              name: data.name,
            },
          ]);
          break;
      }
    };

    ws.onerror = (error: Event) => {
      console.error(error);
      setLoading(false);
      toast({
        title: "Connection Error",
        description: "Failed to establish WebSocket connection",
        variant: "destructive",
      });
    };

    ws.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event);
      setSocket(null);
      socketRef.current = null;
    };

    return ws;
  }, [auth?.user?.id, doc, toast]);

  const disconnectWebSocket = useCallback(() => {
    if (socketRef.current) {
      // Send close message
      socketRef.current.send(
        JSON.stringify({
          type: "close",
          docId: doc,
          userId: auth?.user?.id,
          name: auth?.user?.name,
        } as WebSocketMessage)
      );

      // Close the socket
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
    }
  }, [doc, auth?.user?.id, auth?.user?.name]);

  useEffect(() => {
    // Immediately return if no user ID
    if (!auth?.user?.id) return;

    // Create initial WebSocket connection
    createWebSocket();

    // Handle page visibility changes
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "hidden") {
    //     disconnectWebSocket();
    //   } else if (document.visibilityState === "visible") {
    //     createWebSocket();
    //   }
    // };

    // Handle before unload to send close message
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log(event);
      disconnectWebSocket();
    };

    // Add event listeners
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      disconnectWebSocket();
      //document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auth?.user?.id, doc, createWebSocket, disconnectWebSocket]);

  const sendData = (value: string, delta: any, source: any) => {
    console.log(delta);
    if (source === "user" && myRole != "VIEWER") {
      // Clear any existing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      // Start a new timer to release the lock after the user stops typing
      typingTimerRef.current = setTimeout(() => {
        releaseLock();
      }, DEBOUNCE_DELAY);
      setText(value);
      if (socket) {
        //console.log("Sending data to server:", value);
        socket.send(
          JSON.stringify({
            type: "update-data",
            userId: auth?.user?.id,
            docId: doc,
            data: value,
          })
        );
        socket.send(
          JSON.stringify({
            type: "lock",
            userId: auth?.user?.id,
            docId: doc,
            lock: true,
          })
        );
        socket.send(
          JSON.stringify({
            type: "update-unsaved",
            userId: auth?.user?.id,
            docId: doc,
          })
        );
      }
    }
  };

  useEffect(() => {
    // Cleanup timer when component unmounts
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const openShareDialog = (user: UserType) => {
    setSelectedUser(user);
    setShareDialogOpen(true);
  };

  const shareWithUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/document/share`,
        {
          docId: doc,
          userId: selectedUser.userId,
          role: selectedShareRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      let d = currDoc;
      d?.access?.push(res.data.doc);
      setCurrDoc(d);
      toast({
        title: "Document Shared",
        description: `Shared with ${selectedUser.name} as ${selectedShareRole}`,
        duration: 2000,
      });
      setShareDialogOpen(false);
    } catch (error) {
      toast({
        title: "Share Error",
        description: `Failed to share with ${selectedUser.name}`,
        variant: "destructive",
      });
    }
  };

  const openVersionDialog = () => {
    setVersionName("");
    setVersionDialogOpen(true);
  };

  const saveVersion = async () => {
    setVersionLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/document/version`,
        {
          docId: currDoc?.id,
          name: versionName || `Version ${versions.length + 1}`,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      socket?.send(
        JSON.stringify({
          type: "update-version",
          docId: currDoc?.id,
          userId: auth?.user?.id,
          version: res.data.version,
          name: auth?.user?.name,
        })
      );
      setVersions((prev) => [res.data.version, ...prev]);
      setVersionDialogOpen(false);
      toast({
        title: "Version Saved",
        description: `Version "${versionName}" saved successfully`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save document version",
        variant: "destructive",
      });
    } finally {
      setVersionLoading(false);
    }
  };

  const saveDocument = async () => {
    setSaveLoading(true);
    setUnsaved(false);
    try {
      await axios.put(
        `${BACKEND_URL}/document/save`,
        {
          docId: currDoc?.id,
          title: currDoc?.title,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      toast({
        title: "Document Saved",
        description: "Document saved successfully",
        className: "bg-green-800 text-white",
        duration: 2000,
      });
      socket?.send(
        JSON.stringify({
          type: "saved-data",
          docId: currDoc?.id,
          userId: auth?.user?.id,
          name: auth?.user?.name,
        })
      );
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const rollbackToVersion = async () => {
    if (!rollbackVersionId) return;
    setRollbackLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/document/rollback/${doc}`,
        {
          versionId: rollbackVersionId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      // Update current document content
      setText(res.data.updatedDoc.content);

      toast({
        title: "Version Rollback",
        description: `Rolled back to version: ${res.data.version.name}`,
        className: "bg-green-800 text-white",
        duration: 2000,
      });

      socket?.send(
        JSON.stringify({
          type: "rolledback",
          docId: currDoc?.id,
          userId: auth?.user?.id,
          data: res.data.updatedDoc.content,
          name: auth?.user?.name,
          rollBackId: rollbackVersionId,
        })
      );

      // Close the confirmation dialog
      setRollbackConfirmDialogOpen(false);
      setRollbackVersionId(null);
    } catch (error) {
      toast({
        title: "Rollback Error",
        description: "Failed to rollback to selected version",
        variant: "destructive",
      });
    } finally {
      setRollbackLoading(false);
    }
  };

  const generateShareLink = async (role: string) => {
    setShareLinkLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/document/generate-link`,
        {
          docId: currDoc?.id || doc,
          role: role,
          ownerId: currDoc?.ownerId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      const link = `http://localhost:5173/verify/${res.data.token}`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast({
            title: "Share Link Generated",
            description:
              "Share link generated and copied to clipboard successfully",
            duration: 2000,
          });
          console.log("Link copied to clipboard:", text);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } catch (error) {
      console.log(error);
      toast({
        title: "Share Link Error",
        description: "Failed to generate share link",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setShareLinkLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const releaseLock = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "release-lock",
          docId: doc,
          userId: auth?.user?.id,
        })
      );
    }
  };

  const deleteVersion = async (versionId: string) => {
    try {
      await axios.delete(
        `${BACKEND_URL}/document/delete-version/${versionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}
                `,
          },
          withCredentials: true,
        }
      );
      toast({
        title: "Version Deleted",
        description: "Version deleted successfully",
        className: "bg-green-800 text-white",
        duration: 2000,
      });
      socket?.send(
        JSON.stringify({
          type: "delete-version",
          docId: doc,
          userId: auth?.user?.id,
          versionId: versionId,
          name: auth?.user?.name,
        })
      );
      setVersions((prev) => prev.filter((version) => version.id !== versionId));
    } catch (error) {
      toast({
        title: "Delete Error",
        description: "Failed to delete version",
        variant: "destructive",
      });
    }
  };

  const sendChat = async (text: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "chatMessage",
          userId: auth?.user?.id,
          name: auth?.user?.name,
          docId: doc,
          message: text,
          time: new Date(),
        })
      );
    }
  };

  // If user is a VIEWER, disable editing
  const isReadOnly = myRole === "VIEWER";

  if (loading || fetchLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  if (!auth?.user?.id) return <div>Unauthorized</div>;

  return (
    <>
      <Navbar />
      <div className="container max-w-[1500px] mx-auto py-20 min-h-screen">
        <div className="pt-4 flex justify-between items-center my-2">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center px-3">
            <FileText className="mr-2 text-blue-600" />
            {currDoc?.title}
          </h1>
          {myRole === "VIEWER" ? (
            <Badge className="bg-gray-50 mr-2">
              <p className="text-red-600 font-semibold flex justify-center items-center gap-2">
                <Lock size={20} /> READ ONLY
              </p>
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-col md:flex-row gap-3 px-3">
          <div className="mb-4 w-full md:w-8/12">
            <div className="min-h-[90vh]">
              <Card className="bg-white h-full shadow-md border-blue-200 overflow-hidden">
                <CardHeader className="flex text-center md:text-left gap-2 flex-col md:flex-row bg-blue-50 justify-between items-center border-b border-blue-100 pb-4">
                  <div>
                    <CardTitle className="text-blue-800">
                      Document Viewer
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Real-time collaborative editing
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-center gap-2 space-x-2">
                    <SaveVersionComponent
                      versionLoading={versionLoading}
                      openVersionDialog={openVersionDialog}
                      myRole={myRole}
                    />
                    <ShareLinkButton
                      myRole={myRole}
                      shareLinkLoading={shareLinkLoading}
                      generateShareLink={generateShareLink}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ReactQuill
                    theme="snow"
                    value={text}
                    onChange={(value, delta, source: any) =>
                      sendData(value, delta, source)
                    }
                    modules={modules}
                    readOnly={myRole === "VIEWER" || lock}
                    className={`h-[55vh] ${
                      isReadOnly || lock ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  />

                  <div className="flex flex-row items-center justify-between px-2">
                    <div className="text-sm text-blue-600 mt-2 flex items-center justify-between">
                      {lock && myRole != "VIEWER" ? (
                        <FileLock2 className="text-red-600" />
                      ) : null}
                      {currentWriter && lock ? (
                        <p className="font-bold px-3">
                          Currently {currentWriter} is editing
                        </p>
                      ) : null}
                    </div>
                    {unsaved ? (
                      <p className="text-red-500 font-medium px-3">
                        {"Unsaved changes"}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="mt-8">
                  {myRole === "VIEWER" ? null : (
                    <Button
                      disabled={saveLoading}
                      className="w-[130px] bg-blue-600 hover:bg-blue-500"
                      onClick={saveDocument}
                    >
                      {saveLoading ? (
                        <p className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Saving..
                        </p>
                      ) : (
                        "Save Document"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
              <GeminiChatbox
                apiKey={apiURL}
                model="gemini-2.0-flash" // You can change to other Gemini models
                title="Gemini Assistant"
                placeholder="Ask anything..."
                temperature={0.7}
                maxTokens={2048}
              />
            </div>
          </div>

          <div className="w-full md:w-4/12 flex flex-col gap-3">
            <ChatBox onSendMessage={sendChat} initialMessages={chatMessages} />
            <CurrentUsers
              currentUsers={currentUsers}
              currDoc={currDoc}
              auth={auth}
              openShareDialog={openShareDialog}
            />
            <DocumentVersions
              versions={versions}
              myRole={myRole}
              setRollbackVersionId={setRollbackVersionId}
              setRollbackConfirmDialogOpen={setRollbackConfirmDialogOpen}
              onDeleteVersion={deleteVersion}
            />
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-800">
                Share Document
              </DialogTitle>
              <DialogDescription className="text-blue-600">
                Choose access level for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-blue-800">
                  Access Level
                </Label>
                <Select
                  value={selectedShareRole}
                  onValueChange={setSelectedShareRole}
                >
                  <SelectTrigger className="col-span-3 border-blue-300 focus:ring-blue-300">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER" className="hover:bg-blue-50">
                      Viewer (Read-only)
                    </SelectItem>
                    <SelectItem value="EDITOR" className="hover:bg-blue-50">
                      Editor (Full Access)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={shareWithUser}
              >
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Version Save Dialog */}
        <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Save Version</DialogTitle>
              <DialogDescription className="text-blue-600">
                Give a name to this document version
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="versionName" className="text-blue-800">
                  Version Name
                </Label>
                <Input
                  id="versionName"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder={`Version name`}
                  className="col-span-3 border-blue-300 focus:ring-blue-300"
                  autoComplete="off"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-row items-center justify-center gap-2">
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-50 mr-2"
                onClick={() => setVersionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={saveVersion}
                disabled={!versionName.trim()}
              >
                {versionLoading ? (
                  <p className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Saving..
                  </p>
                ) : (
                  <p className="flex items-center gap-1">
                    <History className="mr-2 h-4 w-4" /> Save Version
                  </p>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rollback Confirmation Dialog */}
        <Dialog
          open={rollbackConfirmDialogOpen}
          onOpenChange={setRollbackConfirmDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-800 flex items-center">
                <AlertCircle className="mr-2 text-yellow-500" />
                Confirm Version Rollback
              </DialogTitle>
              <DialogDescription className="text-blue-600 py-4">
                You are about to roll back the document to the version :{" "}
                <p className="font-semibold text-red-700">
                  {rollbackVersionId}
                </p>
                This action will replace the current content of the document
                with the content from the chosen version. All unsaved changes in
                the current document will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-50 mr-2"
                onClick={() => {
                  setRollbackConfirmDialogOpen(false);
                  setRollbackVersionId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={rollbackToVersion}
              >
                {rollbackLoading ? (
                  <p className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Rolling back..
                  </p>
                ) : (
                  "Roll back"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default DocumentViewer;
