import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Users, Clock, PenTool, Waves, FileEdit, Send, Delete } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '@/store/auth';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const auth = useRecoilValue(authAtom)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, 20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
        initial={{ opacity: 0.2 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Blurred Gradient Circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Floating Icons */}
        <motion.div 
          className="absolute top-1/4 left-10 opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <PenTool size={64} className="text-indigo-300" />
        </motion.div>
        <motion.div 
          className="absolute top-[200px] right-10 opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <FileEdit size={64} className="text-purple-300" />
        </motion.div>
        <motion.div 
          className="absolute bottom-1/4 left-[200px] opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <Waves size={64} className="text-pink-300" />
        </motion.div>
        <motion.div 
          className="absolute bottom-[40px] left-1/3 opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <Delete size={64} className="text-pink-300" />
        </motion.div>
        <motion.div 
          className="absolute bottom-[100px] right-[300px] opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <Send size={64} className="text-pink-300" />
        </motion.div>
        
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className='text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-white'
        >
          Collaborate Without Limits
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl mb-10 max-w-3xl text-gray-300"
          variants={itemVariants}
        >
          Seamlessly create, share, and collaborate on documents with powerful version control and intelligent access management.
        </motion.p>

        <motion.div 
          className="flex justify-center space-x-4 mb-16"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            {auth.user ? (
              <Link to={'/myDocs'}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Button>
              </Link>
            ) : (
              <Link to={'/signup'}>
                <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
              </Link>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to={'/about'}>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 w-full max-w-4xl"
          variants={containerVariants}
        >
          {[
            {
              Icon: FileText,
              color: "text-indigo-300",
              title: "Smart Documents",
              description: "Create rich, collaborative documents with intelligent real-time editing."
            },
            {
              Icon: Users,
              color: "text-purple-300",
              title: "Team Collaboration",
              description: "Invite team members with granular, customizable access controls."
            },
            {
              Icon: Clock,
              color: "text-pink-300",
              title: "Version History",
              description: "Comprehensive version tracking with easy rollback and comparison."
            }
          ].map(({ Icon, color, title, description }) => (
            <motion.div 
              key={title}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className={`mx-auto mb-4 ${color}`} size={48} />
              <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
              <p className="text-gray-400">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;