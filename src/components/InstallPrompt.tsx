"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsInstalled(isAppInstalled);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show if already installed or user dismissed before
      if (!isAppInstalled && !localStorage.getItem('pwa-install-dismissed')) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slideIn">
      <div className="bg-white border border-purple-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install Zeno</h3>
              <p className="text-sm text-gray-600">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Works offline
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Faster loading
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            App-like experience
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Install
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
            className="border-gray-300"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
