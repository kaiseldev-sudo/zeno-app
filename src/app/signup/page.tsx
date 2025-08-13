"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, GraduationCap, Calendar, Eye, EyeOff, Loader2, UserPlus, CheckCircle, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SecureForm from "@/components/SecureForm";
import PasswordValidation from "@/components/PasswordValidation";
import { RATE_LIMITS } from "@/lib/security";
import { useAuth } from "@/lib/auth";
import { validatePassword } from "@/lib/passwordValidation";
import { useEmailUniqueness } from "@/hooks/useEmailUniqueness";
import { sanitizeEmail, sanitizePassword, sanitizeName, sanitizeCourse, sanitizeYearLevel } from "@/lib/inputSanitization";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    yearLevel: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Email uniqueness validation
  const {
    isChecking: isCheckingEmail,
    isAvailable: isEmailAvailable,
    error: emailError,
    checkEmail,
    clearCheck: clearEmailCheck
  } = useEmailUniqueness();

  const subjects = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Economics",
    "Psychology",
    "Literature",
    "History",
    "Art",
  ];

  const yearLevels = [
    "1st Year",
    "2nd Year", 
    "3rd Year",
    "4th Year",
    "Graduate",
    "PhD",
  ];

  const handleSecureSubmit = async (formData: FormData, csrfToken: string) => {
    setError("");
    setLoading(true);

    const data = {
      name: sanitizeName(formData.get('name') as string),
      email: sanitizeEmail(formData.get('email') as string),
      password: sanitizePassword(formData.get('password') as string),
      confirmPassword: sanitizePassword(formData.get('confirmPassword') as string),
      course: sanitizeCourse(formData.get('course') as string),
      yearLevel: sanitizeYearLevel(formData.get('yearLevel') as string)
    };

    // Validate form
    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      throw new Error("Passwords don't match");
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet the requirements");
      setLoading(false);
      throw new Error("Password does not meet the requirements");
    }

    if (!data.name.trim()) {
      setError("Please enter your full name");
      setLoading(false);
      throw new Error("Please enter your full name");
    }

    // Check email uniqueness
    if (isEmailAvailable === false) {
      setError("This email address is already registered. Please use a different email.");
      setLoading(false);
      throw new Error("Email address already registered");
    }

    if (isEmailAvailable === null && data.email) {
      setError("Please wait while we verify your email address.");
      setLoading(false);
      throw new Error("Email verification in progress");
    }

    if (!data.course) {
      setError("Please select your course/subject");
      setLoading(false);
      throw new Error("Please select your course/subject");
    }

    if (!data.yearLevel) {
      setError("Please select your year level");
      setLoading(false);
      throw new Error("Please select your year level");
    }

    try {
      // Sign up using auth context
      const { data: result, error: signUpError } = await signUp(
        data.email,
        data.password,
        {
          name: data.name,
          course: data.course,
          yearLevel: data.yearLevel,
        }
      );

      if (signUpError) throw signUpError;

      if (result.user) {
        setSuccess(true);
        // Redirect after successful signup
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Apply appropriate sanitization based on field type
    if (name === 'email') {
      sanitizedValue = sanitizeEmail(value);
    } else if (name === 'password') {
      sanitizedValue = sanitizePassword(value);
    } else if (name === 'confirmPassword') {
      sanitizedValue = sanitizePassword(value);
    } else if (name === 'name') {
      sanitizedValue = sanitizeName(value);
    } else if (name === 'course') {
      sanitizedValue = sanitizeCourse(value);
    } else if (name === 'yearLevel') {
      sanitizedValue = sanitizeYearLevel(value);
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
    
    // Clear error when user starts typing
    if (error) setError("");
    
    // Trigger email uniqueness check when email changes
    if (name === 'email') {
      if (sanitizedValue.trim()) {
        checkEmail(sanitizedValue);
      } else {
        clearEmailCheck();
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome to Zeno! 🎉
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Your account has been created successfully.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📧 Please check your email to verify your account before continuing.
            </p>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center mt-4">
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
          <p className="mt-2 text-gray-600">
            Create your account and start finding study groups that match your interests
          </p>
        </div>

        {/* Signup Form */}
        <SecureForm
          onSubmit={handleSecureSubmit}
          rateLimitConfig={RATE_LIMITS.SIGNUP}
          rateLimitIdentifier={formData.email || 'anonymous'}
          className="space-y-6"
          disabled={loading}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {/* Full Name */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="pl-10 h-12"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-3 mt-4">
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
                onChange={handleChange}
                className={`pl-10 pr-10 h-12 ${
                  isEmailAvailable === false ? 'border-red-500 focus:border-red-600' :
                  isEmailAvailable === true ? 'border-green-500 focus:border-green-600' :
                  'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              
              {/* Email validation status icon */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isCheckingEmail ? (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : isEmailAvailable === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : isEmailAvailable === false ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {/* Email validation message */}
            {(emailError || isEmailAvailable === false || isEmailAvailable === true) && (
              <div className={`text-sm mt-2 ${
                emailError || isEmailAvailable === false ? 'text-red-600' : 'text-green-600'
              }`}>
                {emailError ? (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {emailError}
                  </div>
                ) : isEmailAvailable === false ? (
                  <div className="flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    This email address is already registered. Please use a different email or try{' '}
                    <Link href="/login" className="underline ml-1">signing in</Link> instead.
                  </div>
                ) : isEmailAvailable === true ? (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Email address is available
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Course Field */}
          <div className="space-y-3 mt-4">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Course/Subject
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                required
              >
                <option value="">Select your main subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Level Field */}
          <div className="space-y-3 mt-4">
            <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700">
              Year Level
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="yearLevel"
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                className="w-full pl-10 pr-4 h-12 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                required
              >
                <option value="">Select your year level</option>
                {yearLevels.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-3 mt-4">
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
                onChange={handleChange}
                className={`pl-10 pr-12 h-12 ${
                  formData.password && !passwordValidation.isValid 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : formData.password && passwordValidation.isValid 
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500' 
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
            
            {/* Password Validation */}
            <PasswordValidation 
              validation={passwordValidation}
              password={formData.password}
              showStrength={true}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3 mt-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 pr-12 h-12 ${
                  formData.confirmPassword && !passwordsMatch 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : formData.confirmPassword && passwordsMatch 
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500' 
                    : ''
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Password Match Validation */}
            {formData.confirmPassword && (
              <div className={`mt-2 text-sm flex items-center ${
                passwordsMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                {passwordsMatch ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Passwords do not match
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
              </>
            )}
          </Button>
        </SecureForm>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in here
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