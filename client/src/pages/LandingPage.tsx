
import { motion} from 'framer-motion';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  FileEdit, 
  GitBranch, 
  Lock, 
  Shield, 
  Cloud, 
  Key
} from 'lucide-react';
import HeroSection from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandingPage = () => {

  const features = [
    {
      icon: <FileEdit className="w-10 h-10 text-indigo-500" />,
      title: "Real-Time Collaboration",
      description: "Seamless multi-user editing with intelligent synchronization"
    },
    {
      icon: <Shield className="w-10 h-10 text-purple-500" />,
      title: "Granular Permissions",
      description: "Precise, role-based access control for enhanced security"
    },
    {
      icon: <GitBranch className="w-10 h-10 text-pink-500" />,
      title: "Version History",
      description: "Comprehensive document versioning with intuitive rollback"
    }
  ];

  const professionalFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: "Document Locking System",
      description:
        "Prevent simultaneous edits and ensure document integrity with real-time locking for exclusive editing."
    },
    {
      icon: <Key className="w-8 h-8 text-blue-600" />,
      title: "Advanced File Access Controls",
      description:
        "Granular permissions for viewing, editing, and sharing documents to maintain security and privacy."
    },
    {
      icon: <Cloud className="w-8 h-8 text-purple-600" />,
      title: "Cloud Sync and Backup",
      description:
        "Real-time synchronization and automatic cloud backup for seamless collaboration across platforms."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Navbar */}
      <Navbar />

      {/* Hero Section (with top padding for fixed navbar) */}
      <div className='pt-16'>
        <HeroSection />
      </div>

      {/* Core Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Powerful Collaboration Features
          </h3>
          <p className="text-xl text-gray-600">Transform how your team works together</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all group">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Professional Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Enterprise-Ready Platform
          </h3>
          <p className="text-xl text-gray-600">Advanced features for serious teams</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {professionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all group">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;