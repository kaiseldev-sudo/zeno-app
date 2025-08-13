"use client";

import { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useMaintenance } from '@/lib/maintenance';

export default function MaintenanceToggle() {
  const { isMaintenanceMode, toggleMaintenanceMode } = useMaintenance();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleToggle = () => {
    if (isMaintenanceMode) {
      // Turning off maintenance mode - no confirmation needed
      toggleMaintenanceMode();
    } else {
      // Turning on maintenance mode - show confirmation
      setIsConfirming(true);
    }
  };

  const confirmMaintenance = () => {
    toggleMaintenanceMode();
    setIsConfirming(false);
  };

  const cancelMaintenance = () => {
    setIsConfirming(false);
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <Button
        onClick={handleToggle}
        variant={isMaintenanceMode ? "destructive" : "outline"}
        size="sm"
        className={`flex items-center space-x-2 transition-all duration-200 ${
          isMaintenanceMode 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'border-orange-300 text-orange-600 hover:bg-orange-50'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isMaintenanceMode ? 'Maintenance ON' : 'Maintenance'}
        </span>
      </Button>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Enable Maintenance Mode?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This will redirect all users to the maintenance page. Only admins will be able to access the site.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={confirmMaintenance}
                  variant="destructive"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Wrench className="w-4 h-4" />
                  Enable Maintenance
                </Button>
                <Button
                  onClick={cancelMaintenance}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {isMaintenanceMode && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}


