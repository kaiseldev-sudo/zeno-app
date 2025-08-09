import Link from "next/link";
import { Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                <span className="font-bold text-lg">Z</span>
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">Zeno</div>
                <div className="text-sm text-gray-500">Study Group Finder</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Connecting students worldwide to create meaningful study partnerships and achieve academic success together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/groups" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Browse Groups
              </Link>
              <Link href="/create-group" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Create Group
              </Link>
              <Link href="/how-it-works" className="block text-gray-600 hover:text-purple-600 transition-colors">
                How It Works
              </Link>
              <Link href="/success-stories" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Success Stories
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-3">
              <Link href="/help" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Zeno Study Group Finder. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for students everywhere</span>
            </div>
        </div>
      </div>
    </footer>
  );
}
