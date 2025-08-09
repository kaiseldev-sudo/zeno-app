"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Home, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    if (navigator.onLine) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {isOnline ? 'Page Not Available' : 'You\'re Offline'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              {isOnline ? (
                <p>This page requires an internet connection and couldn't be loaded from cache.</p>
              ) : (
                <p>Check your internet connection and try again. Some features may still work offline.</p>
              )}
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isOnline ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleRefresh} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!isOnline}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isOnline ? 'Refresh Page' : 'Waiting for Connection...'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="w-full"
                disabled={!isOnline}
              >
                Try Again
              </Button>
            </div>

            {/* Quick Navigation */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">Quick Navigation:</p>
              <div className="grid grid-cols-3 gap-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="w-full flex flex-col h-auto py-3">
                    <Home className="h-5 w-5 mb-1" />
                    <span className="text-xs">Home</span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full flex flex-col h-auto py-3">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">Groups</span>
                  </Button>
                </Link>
                <Link href="/my-groups">
                  <Button variant="ghost" size="sm" className="w-full flex flex-col h-auto py-3">
                    <BookOpen className="h-5 w-5 mb-1" />
                    <span className="text-xs">My Groups</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Offline Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-blue-900 mb-2">Offline Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Previously viewed pages may still work</li>
                <li>• Your profile data is cached</li>
                <li>• You can still browse cached study groups</li>
                <li>• New data will sync when you're back online</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
