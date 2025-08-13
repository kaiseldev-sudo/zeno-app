import { Wrench, Construction, Clock, Mail } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
            <Construction className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          We're Making Things Better
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Zeno is currently undergoing scheduled maintenance to improve your experience. 
          We're working hard to get everything back up and running smoothly.
        </p>

        {/* Status Information */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Estimated Completion</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-2">2-3 Hours</p>
          <p className="text-sm text-gray-500">
            We'll notify you as soon as we're back online
          </p>
        </div>

        {/* What We're Working On */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Wrench className="w-5 h-5 text-purple-600 mr-2" />
            What We're Working On
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Performance improvements and bug fixes</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Enhanced study group features</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Security updates and optimizations</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Mail className="w-5 h-5 text-purple-600 mr-2" />
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have urgent questions or need assistance, please contact our support team:
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Email:</span> support@zeno-app.com
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Response Time:</span> Within 1 hour during business hours
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Thank you for your patience. We appreciate you choosing Zeno for your study group needs.
          </p>
        </div>
      </div>
    </div>
  );
}


