import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecoilState } from 'recoil';
import { authAtom } from '@/store/auth';
import { Check, Loader2, UserCircle } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

// Professional profile picture options
const profilePictures: string[] = [
  "https://tse1.mm.bing.net/th?id=OIG2.VTSh5xINVeBcd3RVuEjA&pid=ImgGn",
  "https://tse3.mm.bing.net/th?id=OIG2.y3zIQ7HiNF9xgbzZirOI&pid=ImgGn", 
  "https://tse4.mm.bing.net/th?id=OIG3.DvzGv3s_Hnq27oDF7oln&pid=ImgGn", 
  "https://tse4.mm.bing.net/th?id=OIG2.HrTb0VsSV2DL5Bj0HP0a&pid=ImgGn",
  "https://tse4.mm.bing.net/th?id=OIG1.rdAOPOw5oY2BpZzZX_T1&pid=ImgGn",
  "https://tse1.mm.bing.net/th?id=OIG3.F1XLJcr5Q1271QOhBojP&pid=ImgGn",
  "https://tse3.mm.bing.net/th?id=OIG2._2iS1ho2leKTpLZTzDAs&pid=ImgGn",
  "https://tse2.mm.bing.net/th?id=OIG1.CnXR1iGqHgQBkl5e7sGP&pid=ImgGn"
];

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditProfileDialog({ isOpen, onOpenChange }: EditProfileDialogProps) {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [loading,setLoading] = useState(false);
  const {toast} = useToast();
  
  const [name, setName] = useState<string>(auth.user?.name || "");
  const [selectedProfilePic, setSelectedProfilePic] = useState<string>(
    auth.user?.profileImage || profilePictures[0]
  );

  const handleSave = async () => {
    setLoading(true)
    try{
        await axios.put(`${BACKEND_URL}/user/update`,{
            name : name,
            profileImage: selectedProfilePic
        },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setAuth({
          user: {
            ...auth.user,
            name: name,
            profileImage: selectedProfilePic,
            email: auth.user?.email || "",
            id: auth.user?.id || "",
          },
          isAuthenticated: true
        });
        toast({
          title: 'Profile updated successfully',
          description: 'Your profile has been updated successfully.',
          className: 'bg-green-800 text-white',
        })
    }catch(err){
        console.log(err)
        toast({
          title: 'Error updating profile',
          description: 'There was an error updating your profile. Please try again.',
          variant: 'destructive',
        })
    }finally{
      setLoading(false)
      onOpenChange(false);
    }
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Profile Picture Selection Column */}
          <div className="hidden md:block bg-gradient-to-br from-blue-600 to-indigo-700 p-8 items-center justify-center">
            <div className="text-center text-white">
              <UserCircle className="mx-auto mb-4 w-24 h-24 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">Select Profile Picture</h3>
              <p className="text-sm text-white/70 mb-6">
                Choose an image that represents your professional identity
              </p>
            </div>
          </div>

          {/* Edit Profile Column */}
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <UserCircle className="w-8 h-8 text-blue-600" />
                Edit Profile
              </DialogTitle>
              <p className="text-gray-500 text-sm">Update your personal information</p>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg" 
                  placeholder="Enter your full name"
                />
              </div>

              {/* Profile Picture Grid */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {profilePictures.map((pic, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedProfilePic(pic)}
                    >
                      <div className="aspect-square">
                        <img 
                          src={pic} 
                          alt={`Profile option ${index + 1}`}
                          className={`w-full h-full rounded-full object-cover transition-all duration-300 
                            ${selectedProfilePic === pic 
                              ? 'ring-4 ring-blue-600 ring-offset-2 opacity-100' 
                              : 'opacity-70 hover:opacity-100 hover:ring-2 hover:ring-gray-300'
                            }`}
                        />
                      </div>
                      {selectedProfilePic === pic && (
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-8">
              <Button 
                type="submit" 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
                           transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Profile Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;