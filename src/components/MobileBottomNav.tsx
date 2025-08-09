"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Plus, User, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requireAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    requireAuth: false,
  },
  {
    href: "/dashboard",
    icon: Search,
    label: "Browse",
    requireAuth: true,
  },
  {
    href: "/create-group",
    icon: Plus,
    label: "Create",
    requireAuth: true,
  },
  {
    href: "/my-groups",
    icon: Users,
    label: "My Groups",
    requireAuth: true,
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
    requireAuth: true,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show on auth pages
  const authPages = ["/login", "/signup", "/forgot-password", "/reset-password"];
  if (authPages.includes(pathname)) {
    return null;
  }

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter(item => {
    if (item.requireAuth && !user) {
      return false;
    }
    return true;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${
                isActive
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              <div className="relative">
                <IconComponent 
                  className={`h-6 w-6 ${
                    isActive ? "text-purple-600" : "text-gray-500"
                  }`} 
                />
                {isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                )}
              </div>
              <span 
                className={`text-xs mt-1 font-medium truncate ${
                  isActive ? "text-purple-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </nav>
  );
}
