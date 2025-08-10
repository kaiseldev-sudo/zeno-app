"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => void;
  setMaintenanceMode: (mode: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Load maintenance mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('zeno_maintenance_mode');
    if (savedMode) {
      setIsMaintenanceMode(JSON.parse(savedMode));
    }
  }, []);

  // Save maintenance mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zeno_maintenance_mode', JSON.stringify(isMaintenanceMode));
  }, [isMaintenanceMode]);

  const toggleMaintenanceMode = () => {
    setIsMaintenanceMode(prev => !prev);
  };

  const setMaintenanceMode = (mode: boolean) => {
    setIsMaintenanceMode(mode);
  };

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceMode,
      toggleMaintenanceMode,
      setMaintenanceMode,
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}

