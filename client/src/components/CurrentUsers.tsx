import React, { useState } from 'react';
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
    DropdownMenuTrigger, 
    DropdownMenuLabel, 
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
    User, 
    CrownIcon, 
    Settings2, 
    ShieldCheck, 
    UserCog, 
    Lock, 
    Loader2 
} from "lucide-react";
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

interface UserType {
    userId: string;
    name: string;
    role: string;
}

interface CurrentUsersProps {
    currentUsers: UserType[];
    currDoc: any;
    auth: any;
    openShareDialog: (user: UserType) => void;
}

const CurrentUsers: React.FC<CurrentUsersProps> = ({ 
    currentUsers, 
    currDoc, 
    auth, 
    openShareDialog,
}) => {
    const isOwner = auth?.user?.id === currDoc?.ownerId;
    const [loadingUsers, setLoadingUsers] = useState<{[key: string]: boolean}>({});
    const {toast} = useToast()

    const updateAccess = async (accessLevel: string, accessId: string, userId: string) => {
        // Create a copy of loadingUsers and set the specific user to loading
        setLoadingUsers(prev => ({...prev, [userId]: true}));

        try {
            await axios.put(`${BACKEND_URL}/document/modify-share`, {
                docId: currDoc?.id,
                role: accessLevel,
                accessId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });

            toast({
                title: "Access Updated",
                description: "Access updated successfully",
                className: 'bg-green-800 text-white',
                duration: 2000
            });

        } catch (error) {
            toast({
                title: "Access Update Error",
                description: "Failed to update access",
                variant: "destructive"
            });
        } finally {
            // Remove loading state for this specific user
            setLoadingUsers(prev => {
                const newLoadingUsers = {...prev};
                delete newLoadingUsers[userId];
                return newLoadingUsers;
            });
        }
    };

    return (
        <TooltipProvider>
            <Card className="w-full dark:bg-blue-900/30 shadow-lg rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                <CardHeader className="p-4 bg-blue-50 border-b border-blue-200 dark:border-blue-700">
                    <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-200 flex items-center">
                        <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-300" />
                        Current Users
                    </CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-400">
                        Users currently accessing this document
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-72 w-full">
                        {currentUsers.length === 0 ? (
                            <div className="p-4 text-center text-blue-500 dark:text-blue-400">
                                No users currently accessing this document
                            </div>
                        ) : (
                            <div className="divide-y divide-blue-200 dark:divide-blue-700">
                                {currentUsers.map(user => (
                                    <div 
                                        key={user.userId} 
                                        className="p-4 flex justify-between items-center hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                                {user.userId === currDoc?.ownerId && (
                                                    <CrownIcon className="absolute -top-1 -right-1 h-4 w-4 text-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                    {user.name}
                                                </p>
                                                {currDoc?.access?.find((u: any) => u.userId === user.userId)?.role && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                                        {currDoc.access.find((u: any) => u.userId === user.userId).role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {isOwner && user.userId !== currDoc?.ownerId && (
                                            <div className="flex items-center space-x-2">
                                                {currDoc?.access?.some((u: any) => u.userId === user.userId) ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                disabled={loadingUsers[user.userId]}
                                                                className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                                                            >
                                                                {loadingUsers[user.userId] ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                                                                ) : (
                                                                    <UserCog className="mr-2 h-4 w-4 text-blue-500" />
                                                                )}
                                                                Modify Access
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-blue-50 dark:bg-blue-900">
                                                            <DropdownMenuLabel className="text-blue-800 dark:text-blue-200">Change Access Level</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-blue-200 dark:bg-blue-700" />
                                                            <DropdownMenuItem 
                                                                onSelect={() => updateAccess(
                                                                    'VIEWER', 
                                                                    currDoc?.access.find((u: any) => u.userId === user.userId)?.id,
                                                                    user.userId
                                                                )}
                                                                disabled={loadingUsers[user.userId]}
                                                                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300"
                                                            >
                                                                <Lock className="mr-2 h-4 w-4 text-blue-500" /> Viewer
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onSelect={() => updateAccess(
                                                                    'EDITOR', 
                                                                    currDoc?.access.find((u: any) => u.userId === user.userId)?.id,
                                                                    user.userId
                                                                )}
                                                                disabled={loadingUsers[user.userId]}
                                                                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300"
                                                            >
                                                                <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" /> Editor
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                                                onClick={() => openShareDialog(user)}
                                                            >
                                                                <Settings2 className="mr-2 h-4 w-4" /> 
                                                                Permit Access
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left" className="bg-blue-700 text-white">
                                                            <p>Clicking will directly share document access</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};

export default CurrentUsers;