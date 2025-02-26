import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileEditIcon, UsersIcon, NetworkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { authAtom } from '@/store/auth';
import { useSetRecoilState } from 'recoil';
import { useToast } from '@/hooks/use-toast';

// Background Component with Framer Motion
const CollaborativeBackground = () => {
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const elementVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 0.5, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 50 
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={backgroundVariants}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <motion.div 
        variants={elementVariants}
        className="absolute top-10 left-10 w-32 h-40 bg-blue-100/30 rounded-lg transform rotate-6 opacity-50 blur-sm"
      />
      <motion.div 
        variants={elementVariants}
        className="absolute bottom-20 right-20 w-40 h-32 bg-blue-200/30 rounded-lg transform -rotate-6 opacity-50 blur-sm"
      />
      
      <motion.svg 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <motion.path 
          d="M-50 100 Q200 50 400 150 T800 100" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
        />
        <motion.path 
          d="M-50 200 Q300 250 500 150 T900 250" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
        />
      </motion.svg>
      
      <motion.div 
        variants={elementVariants}
        className="absolute top-1/3 left-10 text-blue-300/50"
      >
        <FileEditIcon size={40} />
      </motion.div>
      <motion.div 
        variants={elementVariants}
        className="absolute bottom-1/4 right-20 text-blue-300/50"
      >
        <UsersIcon size={40} />
      </motion.div>
      <motion.div 
        variants={elementVariants}
        className="absolute top-1/2 right-10 text-blue-300/50"
      >
        <NetworkIcon size={40} />
      </motion.div>
    </motion.div>
  );
};

export const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, formData);
      setAuth(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something Went Wrong, try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };



  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden"
    >
      <CollaborativeBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <Card className="relative min-w-[360px] md:min-w-[500px] z-10 w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-blue-100">
          <CardHeader className="text-center bg-blue-600/10 border-b border-blue-200 py-6">
            <div className="flex justify-center mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 bg-blue-100 rounded-full"
              >
                <NetworkIcon size={32} className="text-blue-600" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold text-blue-800">Join the Collaboration</CardTitle>
            <CardDescription className="text-blue-600">
              Create your workspace and start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="name" className="text-blue-900">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What should we call you?"
                  className="mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="email" className="text-blue-900">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@workspace.com"
                  className="mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="password" className="text-blue-900">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className="mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </motion.div>
              <div className="flex items-center justify-center my-4">
                <div className="border-t border-blue-200 w-full"></div>
                <span className="px-3 text-blue-600 bg-white">OR</span>
                <div className="border-t border-blue-200 w-full"></div>
              </div>
              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleSignup}
                  className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 transition-all duration-300 ease-in-out"
                >
                  <Mail className="mr-2" /> Continue with Google
                </Button>
              </motion.div> */}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-4"
              >
                <p className="text-blue-800">
                  Already have an account? {' '}
                  <Link 
                    to="/signin" 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Sign In
                  </Link>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};