import { Rocket } from 'lucide-react'


function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Rocket className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold">CollabDocs</span>
          </div>
          <p className="text-gray-400">Revolutionizing team collaboration with intelligent document management.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-400">&copy; 2024 CollabDocs. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer