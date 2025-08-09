"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Users, Home, Plus, User, Search, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center  transition-transform shadow-md">
                <span className="font-bold text-lg">Z</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900">Zeno</span>
                <span className="text-xs text-gray-500 -mt-1">Study Groups</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Authenticated user navigation
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {getUserInitials()}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.user_metadata?.name || user?.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>
                      
                      <Link
                        href="/my-groups"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Users className="h-4 w-4 mr-3" />
                        My Groups
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Non-authenticated user navigation
              <>
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <span>Home</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform ml-2"
                >
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-100 bg-purple-50 rounded-b-lg -mx-4">
              {user ? (
                // Authenticated mobile navigation
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-purple-200 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.user_metadata?.name || user?.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-4 py-1 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/my-groups"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-4 py-1 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <span>My Groups</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-4 py-1 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>
                  
                  <div className="border-t border-purple-200 mt-2 pt-2">
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                // Non-authenticated mobile navigation
                <>
                  <Link
                    href="/"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-4 py-1 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 px-4 py-1 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Sign In</span>
                  </Link>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" asChild>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
