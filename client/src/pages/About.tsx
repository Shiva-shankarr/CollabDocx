
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Lock, 
  Shield, 
  CloudLightning, 
  CheckCircle,
  Workflow,
  Clock,
  Edit,
  Share2
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const AboutPage = () => {
  return (
    <div className="bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 pb-16 pt-28 max-w-6xl">
        <motion.header 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 text-blue-900"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Collab Desk
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-800 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Revolutionizing collaborative document management with intelligent real-time editing and robust security.
          </motion.p>
        </motion.header>

        {/* Key Features Section */}
        <motion.section 
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Real-Time Collaboration</h3>
                <p className="text-blue-700">
                  Seamless multi-user editing with instant synchronization across team members.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Lock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Intelligent Locking</h3>
                <p className="text-blue-700">
                  Advanced document protection preventing conflicting edits and ensuring data integrity.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Granular Access Control</h3>
                <p className="text-blue-700">
                  Flexible permission levels with read, write, and owner access management.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Detailed Explanation Sections */}
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Locking System Section */}
          <motion.section 
            className="grid md:grid-cols-2 gap-8 items-center"
            variants={itemVariants}
          >
            <div className='text-center md:text-left'>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">How Our Locking System Works</h2>
              <div className="space-y-4 text-blue-800">
                <div className="flex items-center">
                  <CheckCircle className="mr-3 text-blue-600" />
                  <p>Prevents simultaneous conflicting edits</p>
                </div>
                <div className="flex items-center">
                  <Workflow className="mr-3 text-blue-600" />
                  <p>Real-time section-level document locking</p>
                </div>
                <div className="flex items-center">
                  <CloudLightning className="mr-3 text-blue-600" />
                  <p>Automatic conflict resolution mechanisms</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100/50 rounded-lg p-6 overflow-x-scroll">
              <pre className="text-blue-800 text-sm">
{`// Simplified Locking Mechanism
function lockDocumentSection(documentId, sectionId, userId) {
  const section = getDocumentSection(documentId, sectionId);
  
  if (section.isLocked) {
    return LockStatus.CONFLICT;
  }
  
  section.lock(userId);
  return LockStatus.ACQUIRED;
}`}
              </pre>
            </div>
          </motion.section>
          <motion.section 
          className="mt-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-blue-900 text-center mb-12"
            variants={itemVariants}
          >
            How Collaboration Works
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white border-blue-100 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Share2 className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Document Sharing</h3>
                  <p className="text-blue-700">
                    Invite team members and set precise access levels for each document.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white border-blue-100 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Edit className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Real-Time Editing</h3>
                  <p className="text-blue-700">
                    Multiple users can edit simultaneously with instant synchronization.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white border-blue-100 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Clock className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Version Tracking</h3>
                  <p className="text-blue-700">
                    Comprehensive history of changes with ability to revert to previous versions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>
        </motion.div>

        {/* Call to Action */}
        <div className=" bg-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Previous header and feature sections remain the same */}

        {/* Collaboration Workflow Section */}
        

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-4"
          variants={itemVariants}
        >
          <Link to={'/signup'}>
          <Button 
          size={"lg"}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Button>
          </Link>
        </motion.div>
      </div>
    </div>

      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;