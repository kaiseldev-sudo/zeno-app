"use client";

import Link from "next/link";
import { ArrowRight, Users, Search, Plus, MessageCircle, BookOpen, Target, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              How Zeno Works
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Discover how easy it is to find study partners, join groups, and achieve academic success together
            </p>
          </div>
        </div>
      </div>

      {/* Main Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Getting Started is Simple
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these easy steps to start your collaborative learning journey
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center group">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
              <Search className="h-10 w-10 text-purple-600" />
            </div>
            <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Browse & Discover
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Search through hundreds of study groups by subject, schedule, or learning style. Filter by your preferences to find the perfect match.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center group">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <Users className="h-10 w-10 text-green-600" />
            </div>
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Join or Create
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Join existing groups that match your needs or create your own group. Set your schedule, platform, and learning objectives.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center group">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
              <Target className="h-10 w-10 text-blue-600" />
            </div>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Study & Succeed
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Collaborate with your group members, share resources, and achieve better results together through peer learning.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button size="lg" variant="primary" asChild>
            <Link href="/signup">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Learning
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create meaningful study connections and improve your academic performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Advanced filters help you find groups by subject, schedule, platform, and learning style preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Group Creation
              </h3>
              <p className="text-gray-600">
                Create your own study group in minutes with customizable settings, schedules, and member limits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Set meeting times that work for everyone with multiple schedule options and frequency settings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multiple Platforms
              </h3>
              <p className="text-gray-600">
                Study online via Discord, Zoom, Google Meet, or meet in person - choose what works best for your group.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Subject Variety
              </h3>
              <p className="text-gray-600">
                Find groups for any subject from Computer Science and Mathematics to Business and Engineering.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Join a trusted community of verified students with secure account management and privacy protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Study Groups Work
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Research shows that collaborative learning significantly improves academic performance, retention, and understanding of complex topics.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Improved Understanding</h3>
                    <p className="text-gray-600">Explaining concepts to others reinforces your own learning and reveals knowledge gaps.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Better Motivation</h3>
                    <p className="text-gray-600">Regular group meetings create accountability and keep you committed to your studies.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Diverse Perspectives</h3>
                    <p className="text-gray-600">Learn from different approaches and problem-solving methods from your peers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Stress Reduction</h3>
                    <p className="text-gray-600">Share the workload and reduce academic stress through mutual support and collaboration.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">Higher retention rate with study groups</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">2.3x</div>
                  <div className="text-sm text-gray-600">Faster problem-solving in groups</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
                  <div className="text-sm text-gray-600">Students report improved grades</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">78%</div>
                  <div className="text-sm text-gray-600">Less academic stress reported</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is Zeno free to use?
              </h3>
              <p className="text-gray-600">
                Yes! Zeno is completely free for all students. Create groups, join discussions, and access all features at no cost.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I find the right study group?
              </h3>
              <p className="text-gray-600">
                Use our smart filters to search by subject, meeting frequency, platform preference, and schedule. You can also browse by specific topics or course names.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I create multiple study groups?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can create as many groups as you need for different subjects or purposes. You can also join multiple groups as a member.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if my group isn't working out?
              </h3>
              <p className="text-gray-600">
                You can leave any group at any time. No questions asked! Simply visit your "My Groups" page and click leave. You're always free to find or create a better fit.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do study sessions work?
              </h3>
              <p className="text-gray-600">
                Groups organize their own study sessions using their preferred platform (Discord, Zoom, Google Meet, etc.) or meet in person. Zeno helps you connect - the learning happens in your chosen environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter, not harder, with Zeno study groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
              size="lg" 
              variant="primary" 
              asChild
            >
              <Link href="/groups">
                Browse Study Groups
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-purple-600 hover:bg-gray-50 hover:text-purple-700"  
              asChild
            >
              <Link href="/signup">
                Create Free Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
