import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Loader2 } from "lucide-react";

interface DocumentEditorProps {
    text: string;
    sendData: (value: string, delta: any, source: string, editor: any) => void;
    saveDocument: () => void;
    currentWriter?: string | null;
    unsaved: boolean;
    saveLoading: boolean;
    isReadOnly: boolean;
    role?: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
    text, 
    sendData, 
    saveDocument, 
    currentWriter, 
    unsaved, 
    saveLoading, 
    isReadOnly,
    role
}) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    return (
        <Card className="bg-white h-full shadow-md border-blue-200 overflow-hidden">
            <CardHeader className="flex bg-blue-50 flex-row justify-between items-center border-b border-blue-100 pb-4">
                <div>
                    <CardTitle className="text-blue-800">Document Viewer</CardTitle>
                    <CardDescription className="text-blue-600">
                        Real-time collaborative editing
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <ReactQuill 
                    theme="snow"
                    value={text} 
                    onChange={(value, delta, source, editor) => sendData(value, delta, source, editor)} 
                    modules={modules}
                    readOnly={role === 'VIEWER'}
                    className={`h-[68vh] ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''}`}
                />
                {currentWriter && (
                    <div className="text-sm text-blue-600 mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <BookmarkIcon className="mr-2 h-4 w-4" />
                            Currently being edited by: {currentWriter}
                        </div>
                        {unsaved ? <p>{"Unsaved changes"}</p> : null}
                    </div>
                )}
            </CardContent>
            <CardFooter className="mt-8">
                {role !== 'VIEWER' && (
                    <Button 
                        disabled={saveLoading} 
                        className="w-[130px]" 
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
    );
};

export default DocumentEditor;