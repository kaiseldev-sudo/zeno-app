"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SecureForm from '@/components/SecureForm';
import { RATE_LIMITS } from '@/lib/security';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function SecurityDemo() {
  const [demoResults, setDemoResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setDemoResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleDemoSubmit = async (formData: FormData, csrfToken: string) => {
    const email = formData.get('email') as string;
    addResult(`✅ Form submitted successfully with CSRF token: ${csrfToken.substring(0, 8)}...`);
    addResult(`📧 Email: ${email}`);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    addResult(`🎉 Demo submission completed successfully!`);
  };

  const clearResults = () => {
    setDemoResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Security Features Demo</h1>
          <p className="mt-2 text-gray-600">
            Demonstration of rate limiting and CSRF protection implementation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              Secure Form Demo
            </h2>
            
            <p className="text-gray-600 mb-6">
              This form demonstrates both CSRF protection and rate limiting. Try submitting multiple times quickly to see the rate limiting in action.
            </p>

            <SecureForm
              onSubmit={handleDemoSubmit}
              rateLimitConfig={{
                maxAttempts: 3,
                windowMs: 60 * 1000, // 1 minute for demo
              }}
              rateLimitIdentifier="demo-form"
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your message"
                />
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Submit Demo Form
              </Button>
            </SecureForm>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                Activity Log
              </h2>
              <Button
                onClick={clearResults}
                variant="outline"
                size="sm"
                className="text-gray-600"
              >
                Clear
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {demoResults.length === 0 ? (
                <p className="text-gray-500 italic">No activity yet. Submit the form to see results.</p>
              ) : (
                demoResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-gray-50 rounded border-l-4 border-purple-500"
                  >
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Security Features Explanation */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Implemented Security Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                CSRF Protection
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automatic CSRF token generation for authenticated users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Token validation on every form submission</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automatic token refresh after successful submissions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>1-hour token expiration for security</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                Rate Limiting
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Login attempts: 5 per 15 minutes per email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Signup attempts: 3 per hour per email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Password reset: 3 per hour per email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time countdown for blocked users</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Implementation Notes:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• All authentication forms now use the SecureForm wrapper</li>
              <li>• Rate limiting uses in-memory storage (suitable for single-instance deployments)</li>
              <li>• CSRF tokens are tied to user sessions and automatically managed</li>
              <li>• Security status indicators are shown in development mode</li>
              <li>• For production scaling, consider Redis for rate limit storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
