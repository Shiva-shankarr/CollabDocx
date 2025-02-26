import React from 'react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent 
} from "@/components/ui/card";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoreVertical, Undo2, Trash2 } from "lucide-react";

interface DocumentVersion {
    id: string;
    name?: string;
    createdAt: string;
    content: string;
}

interface DocumentVersionsProps {
    versions: DocumentVersion[];
    myRole: string;
    setRollbackVersionId: (id: string) => void;
    setRollbackConfirmDialogOpen: (open: boolean) => void;
    onDeleteVersion?: (id: string) => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const DocumentVersions: React.FC<DocumentVersionsProps> = ({ 
    versions, 
    myRole, 
    setRollbackVersionId, 
    setRollbackConfirmDialogOpen,
    onDeleteVersion
}) => {
    const handleRollback = (versionId: string) => {
        setRollbackVersionId(versionId);
        setRollbackConfirmDialogOpen(true);
    };

    const handleDelete = (versionId: string) => {
        onDeleteVersion && onDeleteVersion(versionId);
    };
    function parseHTMLToText(htmlString : string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
      }
    return (
        <Card className="w-full dark:bg-blue-950 shadow-lg rounded-xl border border-blue-200 dark:border-blue-900 overflow-x-hidden">
            <CardHeader className="p-4 bg-blue-50 border-b border-blue-200 dark:border-blue-900">
                <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    Document Versions
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                    Historical snapshots of your document
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-72 w-full">
                    {myRole === 'VIEWER' ? (
                        <div className="p-4 text-center text-blue-500 dark:text-blue-400">
                            Viewer mode has no access to versions
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="h-full flex justify-center items-center">
                            <p className="text-center py-16 text-blue-500 dark:text-blue-400">
                                No versions saved yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-blue-200 dark:divide-blue-900">
                            {versions.map((version, index) => (
                                <div 
                                    key={version.id} 
                                    className="p-4 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-start space-x-4 "
                                >
                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 truncate">
                                                {version.name || `Version ${index + 1}`}
                                            </h3>
                                            <div className='flex items-center justify-center gap-1'>
                                                <span className="text-xs text-blue-500 dark:text-blue-400">
                                                    {formatDate(version.createdAt)}
                                                </span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem 
                                                            className="cursor-pointer"
                                                            onSelect={() => handleRollback(version.id)}
                                                        >
                                                            <Undo2 className="mr-2 h-4 w-4" />
                                                            Rollback
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                                                            onSelect={() => handleDelete(version.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete version
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-500 dark:text-blue-400 truncate mb-2">
                                            {version.id}
                                        </p>
                                        
                                        <pre className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2 overflow-hidden">
                                            {version.content.length === 0 ? "No content" : parseHTMLToText(version.content).slice(0, 100) + '...'}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default DocumentVersions;