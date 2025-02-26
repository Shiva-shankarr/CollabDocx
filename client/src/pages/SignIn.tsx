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
import { useSetRecoilState } from 'recoil';
import { authAtom } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';

// CollaborativeBackground component with Framer Motion animations
const CollaborativeBackground = () => {
  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1,
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: 0.5, 
      scale: 1,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      initial="initial"
      animate="animate"
      variants={backgroundVariants}
    >
      {/* Floating document-like shapes */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-40 bg-blue-100/30 rounded-lg transform rotate-6 opacity-50 blur-sm"
        initial={{ opacity: 0, x: -100, rotate: 0 }}
        animate={{ 
          opacity: 0.5, 
          x: 0, 
          rotate: 6,
          transition: { duration: 0.8, type: "spring" }
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-40 h-32 bg-blue-200/30 rounded-lg transform -rotate-6 opacity-50 blur-sm"
        initial={{ opacity: 0, x: 100, rotate: 0 }}
        animate={{ 
          opacity: 0.5, 
          x: 0, 
          rotate: -6,
          transition: { duration: 0.8, type: "spring" }
        }}
      />
      
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            transition: { duration: 2, delay: 0.5 }
          }}
        />
        <motion.path 
          d="M-50 200 Q300 250 500 150 T900 250" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="2" 
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            transition: { duration: 2, delay: 1 }
          }}
        />
      </svg>
      
      {/* Collaborative icons */}
      <motion.div 
        className="absolute top-1/3 left-10 text-blue-300/50"
        variants={iconVariants}
      >
        <FileEditIcon size={40} />
      </motion.div>
      <motion.div 
        className="absolute bottom-1/4 right-20 text-blue-300/50"
        variants={iconVariants}
      >
        <UsersIcon size={40} />
      </motion.div>
      <motion.div 
        className="absolute top-1/2 right-10 text-blue-300/50"
        variants={iconVariants}
      >
        <NetworkIcon size={40} />
      </motion.div>
    </motion.div>
  );
};

export const SigninPage = () => {
  const setAuth = useSetRecoilState(authAtom);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const {toast} = useToast()

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, formData);
      localStorage.setItem('token', response.data.token);
      setAuth(response.data);
      navigate('/')
    }catch (error : any) {
      console.error('Login Error:', error);
      if(error.status == 400){
        toast({
          title : 'Invalid Credentials',
          description : 'The credentials are not valid, please try again',
          variant :'destructive'
        })
      }else{
        toast({
          title : 'Error',
          description : 'Something Went Wrong, try again',
          variant :'destructive'
        })
      }
    }finally{
        setLoading(false);
    }
  };

  // const handleGoogleSignin = () => {
  //   console.log('Google Signin Initiated');
  // };

  // Variants for card and form animations
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 120
      }
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const formChildVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <div className="relative flex px-2 items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <CollaborativeBackground />
      <motion.div
        initial="initial"
        animate="animate"
        variants={cardVariants}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-blue-100">
          <CardHeader className="text-center bg-blue-600/10 border-b border-blue-200 py-6">
            <motion.div 
              className="flex justify-center mb-4"
              variants={formChildVariants}
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <FileEditIcon size={32} className="text-blue-600" />
              </div>
            </motion.div>
            <motion.div variants={formChildVariants}>
              <CardTitle className="text-2xl font-bold text-blue-800">Welcome Back</CardTitle>
              <CardDescription className="text-blue-600">
                Sign in to access your collaborative workspace
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial="initial"
              animate="animate"
              variants={formVariants}
            >
              <motion.div variants={formChildVariants}>
                <Label htmlFor="email" className="text-blue-900">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your workspace email"
                  className="mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>
              <motion.div variants={formChildVariants}>
                <Label htmlFor="password" className="text-blue-900">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your secure password"
                  className="mt-2 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </motion.div>
              <motion.div variants={formChildVariants}>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {loading ? 'Signing in...' : 'Access Workspace'}
                </Button>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center my-4"
                variants={formChildVariants}
              >
                <div className="border-t border-blue-200 w-full"></div>
                <span className="px-3 text-blue-600 bg-white">OR</span>
                <div className="border-t border-blue-200 w-full"></div>
              </motion.div>
              <motion.div variants={formChildVariants}>
                {/* <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleSignin}
                  className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Mail className="mr-2" /> Continue with Google
                </Button> */}
              </motion.div>
              
              <motion.div 
                className="text-center mt-4"
                variants={formChildVariants}
              >
                <p className="text-blue-800">
                  Don't have an account? {' '}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};