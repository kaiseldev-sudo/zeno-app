"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMaintenance } from '@/lib/maintenance';
import { useAuth } from '@/lib/auth';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { isMaintenanceMode } = useMaintenance();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If maintenance mode is enabled and user is not on maintenance page
    if (isMaintenanceMode && pathname !== '/maintenance') {
      // Check if user is an admin (you can customize this logic)
      const isAdmin = user?.user_metadata?.role === 'admin' || 
                     user?.email === 'admin@zeno-app.com' || // Add your admin emails
                     user?.email?.endsWith('@zeno-app.com'); // Or domain-based admin check
      
      if (!isAdmin) {
        // Redirect non-admin users to maintenance page
        router.push('/maintenance');
      }
    }
  }, [isMaintenanceMode, pathname, user, router]);

  // If maintenance mode is enabled and user is not admin, don't render children
  if (isMaintenanceMode && pathname !== '/maintenance') {
    const isAdmin = user?.user_metadata?.role === 'admin' || 
                   user?.email === 'admin@zeno-app.com' || 
                   user?.email?.endsWith('@zeno-app.com');
    
    if (!isAdmin) {
      return null; // Don't render anything while redirecting
    }
  }

  return <>{children}</>;
}

