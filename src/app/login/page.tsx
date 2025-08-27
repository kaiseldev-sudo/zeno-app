"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import SecureForm from "@/components/SecureForm";
import PasswordValidation from "@/components/PasswordValidation";
import { RATE_LIMITS } from "@/lib/security";
import { validatePassword } from "@/lib/passwordValidation";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation (simpler for login - just show strength)
  const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);

  // Auto-dismiss error messages after 1 second
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecureSubmit = async (formData: FormData, csrfToken: string) => {
    setIsLoading(true);
    setError("");

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message || "Failed to sign in");
        setIsLoading(false);
        throw new Error(error.message || "Failed to sign in");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-xl flex items-center justify-center transition-transform shadow-md">
                  <span className="font-bold text-4xl">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-gray-900">Zeno</span>
                  <span className="text-xs text-gray-500 -mt-1">Study Groups</span>
                </div>
              </Link>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to your Zeno account and continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <SecureForm
          onSubmit={handleSecureSubmit}
          rateLimitConfig={RATE_LIMITS.LOGIN}
          rateLimitIdentifier={formData.email || 'anonymous'}
          className="space-y-6"
          disabled={isLoading}
        >
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
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-12"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-12 h-12 ${
                  formData.password && passwordValidation.strength === 'weak' 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : formData.password && passwordValidation.strength === 'strong'
                    ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                    : formData.password && passwordValidation.strength === 'medium'
                    ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
                    : ''
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </Button>
        </SecureForm>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Placeholder */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Social login options coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
