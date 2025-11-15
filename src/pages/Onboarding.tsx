import React from 'react';
import { Video, CheckCircle } from 'lucide-react';

export default function Onboarding() {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = userData.firstName || 'there';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </div>
        </div>
      </header>

      {/* Onboarding Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {firstName}!
          </h1>
          <p className="text-xl text-gray-600">
            Let's get you set up to automate your Zoom follow-ups
          </p>
        </div>

        {/* Onboarding Steps */}
        <div className="bg-gray-50 rounded-xl p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Connect your Zoom account</h3>
              <p className="text-gray-600 text-sm">
                Link your Zoom account to start capturing meeting insights automatically
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Configure your preferences</h3>
              <p className="text-gray-600 text-sm">
                Set up how you want your follow-up emails to be formatted and sent
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Test your first follow-up</h3>
              <p className="text-gray-600 text-sm">
                Send a test follow-up to make sure everything is working perfectly
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
            Connect Zoom Account
          </button>
        </div>
      </div>
    </div>
  );
}

