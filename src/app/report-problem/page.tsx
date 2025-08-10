"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, MessageSquare, AlertTriangle, Lightbulb, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function ReportProblem() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    email: "",
    name: "",
    description: "",
    steps: "",
    expectedBehavior: "",
    actualBehavior: "",
    browser: "",
    device: "",
    urgency: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email as string }));
    }
  }, [user]);

  const problemTypes = [
    {
      id: "bug",
      title: "Bug Report",
      description: "Something isn't working as expected",
      icon: Bug,
      color: "red"
    },
    {
      id: "feature",
      title: "Feature Request",
      description: "Suggest new features or improvements",
      icon: Lightbulb,
      color: "green"
    },
    {
      id: "ui",
      title: "UI/UX Issue",
      description: "Problems with design, layout, or user experience",
      icon: MessageSquare,
      color: "blue"
    },
    {
      id: "performance",
      title: "Performance Issue",
      description: "Slow loading, lag, or other performance problems",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      id: "other",
      title: "Other",
      description: "General feedback or other issues",
      icon: MessageSquare,
      color: "purple"
    }
  ];

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Get browser and device info automatically
      const browserInfo = `${navigator.userAgent}`;
      const deviceInfo = `Screen: ${screen.width}x${screen.height}, Platform: ${navigator.platform}`;

      // Prepare the data for submission
      const reportData = {
        user_id: user?.id || null,
        user_email: formData.email,
        user_name: formData.name || null,
        problem_type: formData.type,
        title: formData.subject,
        description: formData.description,
        steps_to_reproduce: formData.steps || null,
        expected_behavior: formData.expectedBehavior || null,
        actual_behavior: formData.actualBehavior || null,
        browser_info: formData.browser ? `${formData.browser} - ${browserInfo}` : browserInfo,
        device_info: formData.device ? `${formData.device} - ${deviceInfo}` : deviceInfo,
        urgency: formData.urgency,
        status: 'open'
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('problem_reports')
        .insert([reportData]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      setSubmitError(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your report has been submitted successfully. We'll review it and get back to you as soon as possible.
            </p>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" asChild>
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                setIsSubmitted(false);
                setSubmitError("");
                setFormData({
                  type: "",
                  subject: "",
                  email: user?.email || "",
                  name: "",
                  description: "",
                  steps: "",
                  expectedBehavior: "",
                  actualBehavior: "",
                  browser: "",
                  device: "",
                  urgency: "medium"
                });
              }}>
                Submit Another Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report a Problem
            </h1>
            <p className="text-gray-600">
              Help us improve Zeno by reporting bugs, issues, or sharing your feedback
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Problem Type Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What type of problem are you reporting?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {problemTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = formData.type === type.id;
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        type.color === 'red' ? 'bg-red-100' :
                        type.color === 'blue' ? 'bg-blue-100' :
                        type.color === 'orange' ? 'bg-orange-100' :
                        type.color === 'green' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          type.color === 'red' ? 'text-red-600' :
                          type.color === 'blue' ? 'text-blue-600' :
                          type.color === 'orange' ? 'text-orange-600' :
                          type.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{type.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-1">{submitError}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of the problem"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name (optional)"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detailed Description
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe the problem in detail. What happened? What did you expect to happen?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 resize-none"
                />
              </div>

              {(formData.type === 'bug' || formData.type === 'performance') && (
                <>
                  <div>
                    <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
                      Steps to Reproduce
                    </label>
                    <textarea
                      id="steps"
                      name="steps"
                      rows={3}
                      value={formData.steps}
                      onChange={handleInputChange}
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 resize-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Behavior
                      </label>
                      <textarea
                        id="expectedBehavior"
                        name="expectedBehavior"
                        rows={3}
                        value={formData.expectedBehavior}
                        onChange={handleInputChange}
                        placeholder="What should happen?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 resize-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                        Actual Behavior
                      </label>
                      <textarea
                        id="actualBehavior"
                        name="actualBehavior"
                        rows={3}
                        value={formData.actualBehavior}
                        onChange={handleInputChange}
                        placeholder="What actually happened?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Technical Information */}
          {(formData.type === 'bug' || formData.type === 'performance' || formData.type === 'ui') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Technical Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-2">
                    Browser
                  </label>
                  <select
                    id="browser"
                    name="browser"
                    value={formData.browser}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">Select your browser</option>
                    <option value="chrome">Google Chrome</option>
                    <option value="firefox">Mozilla Firefox</option>
                    <option value="safari">Safari</option>
                    <option value="edge">Microsoft Edge</option>
                    <option value="opera">Opera</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="device" className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type
                  </label>
                  <select
                    id="device"
                    name="device"
                    value={formData.device}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">Select your device</option>
                    <option value="desktop">Desktop Computer</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="mobile">Mobile Phone</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              💡 Tips for Better Reports
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Be as specific as possible about what you were doing when the problem occurred</li>
              <li>• Include error messages if you see any</li>
              <li>• Screenshots can be very helpful (you can email them to us separately)</li>
              <li>• Let us know if the problem happens every time or just occasionally</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!formData.type || !formData.subject || !formData.email || !formData.description || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
