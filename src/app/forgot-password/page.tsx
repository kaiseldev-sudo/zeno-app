"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, getBaseUrl } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getBaseUrl()}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-gray-600">
              We've sent a password reset link to your email address
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              What's Next?
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Click the reset link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Create a new password</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Sign in with your new password</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full "
            >
              Send Another Email
            </Button>
            
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-purple-600 hover:text-purple-500 font-medium"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center">
              <KeyRound className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            No worries! Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            If you don't have access to your email or continue having issues, please contact our support team.
          </p>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-500">
              Or
            </span>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
