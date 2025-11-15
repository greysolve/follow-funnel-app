import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CreditCard, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Not logged in - redirect to login
      navigate('/login');
      return;
    }

    // Get user data
    const firstName = session.user.user_metadata?.first_name || 
                     JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                     'there';
    
    setUserData({
      firstName,
      lastName: session.user.user_metadata?.last_name || '',
      email: session.user.email,
      userId: session.user.id,
    });

    // TODO: Check subscription status from your backend/database
    // For now, defaulting to false (needs subscription)
    setHasSubscription(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userData?.email}</span>
            <button
              onClick={() => {
                supabase.auth.signOut();
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {userData?.firstName}!
        </h1>

        {/* Subscription Paywall */}
        {!hasSubscription && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscribe to Continue
                </h2>
                <p className="text-gray-600">
                  Choose a plan to start automating your Zoom follow-ups
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 max-w-3xl mx-auto">
              {/* Monthly Plan */}
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$45</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automated Zoom follow-ups</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited meetings</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Select Plan
                </button>
              </div>

              {/* Lifetime Plan - Featured */}
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$79</span>
                  <span className="text-gray-600"> one-time</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>All Monthly features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pay once, use forever</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No recurring charges</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content (shown when subscribed) */}
        {hasSubscription && (
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Dashboard</h2>
            <p className="text-gray-600">Your meeting follow-ups will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

