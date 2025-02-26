import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogTrigger 
} from "@/components/ui/dialog";

// Icons
import { 
  Rocket, 
  Menu, 
  FileText,
  Home,
  Info,
  LogOut,
  Edit
} from 'lucide-react';

// Local imports
import { authAtom } from '@/store/auth';
import EditProfileDialog from './EditProfileDialog';


// Type definitions
interface UserProfile {
  name: string;
  email: string;
  profileImage: string;
}



function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();

  // Simulated user profile with fallback values
  const userProfile: UserProfile = {
    name: auth.user?.name || "John Doe",
    email: auth.user?.email || "john.doe@example.com",
    profileImage: auth.user?.profileImage || "https://via.placeholder.com/150",
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileEdit = () => {
    setIsProfileDialogOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto max-w-[1500px] flex justify-between items-center py-4 px-4 lg:px-4">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <Rocket className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-800">Collab Desk</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to={'/'}>
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to={'/about'}>
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Button>
            </Link>
            
            {auth.user && (
              <Link to={'/myDocs'}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>My Docs</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Profile or Login Section */}
          {auth.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault();
                        handleProfileEdit();
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <EditProfileDialog 
                    isOpen={isProfileDialogOpen} 
                    onOpenChange={setIsProfileDialogOpen} 
                  />
                </Dialog>
                <DropdownMenuItem 
                  onSelect={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={'/signin'}>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:text-white"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 pt-8">
                {/* Mobile Navigation Links */}
                {!auth.user ? (
                  <Link to={'/signin'}>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Login
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded">
                      <img 
                        src={userProfile.profileImage} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                <Link to={'/'}>
                  <Button 
                    variant="ghost" 
                    className="justify-start flex items-center space-x-2 w-full"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Button>
                </Link>
                <Link to={'/about'}>
                  <Button 
                    variant="ghost" 
                    className="justify-start flex items-center space-x-2 w-full"
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Button>
                </Link>

                {auth.user && (
                  <>
                    <Link to={'/myDocs'}>
                      <Button 
                        variant="ghost" 
                        className="justify-start flex items-center space-x-2 w-full"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Documents</span>
                      </Button>
                    </Link>
                    <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={handleProfileEdit}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <EditProfileDialog 
                        isOpen={isProfileDialogOpen} 
                        onOpenChange={setIsProfileDialogOpen} 
                      />
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;