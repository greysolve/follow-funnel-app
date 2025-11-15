import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomStatus, setZoomStatus] = useState<string>('');
  const [zoomError, setZoomError] = useState<string>('');
  const [isConnectingZoom, setIsConnectingZoom] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Check Zoom connection status after auth is confirmed
    if (userData && !isLoading) {
      checkZoomConnection();
    }
  }, [userData, isLoading]);

  const checkAuth = async () => {
    // Check Supabase session first
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // User is authenticated - get user metadata
      const firstName = session.user.user_metadata?.first_name || 
                       JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                       'there';
      
      setUserData({
        firstName,
        lastName: session.user.user_metadata?.last_name || '',
        email: session.user.email,
        userId: session.user.id,
        isAuthenticated: true,
        needsEmailConfirmation: false,
      });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify({
        firstName,
        lastName: session.user.user_metadata?.last_name || '',
        email: session.user.email,
        userId: session.user.id,
        isAuthenticated: true,
      }));
    } else {
      // Check localStorage as fallback
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (storedUser.userId || storedUser.email) {
        // User data exists but no session - redirect to login
        navigate('/login');
        return;
      } else {
        // No user data - redirect to signup
        navigate('/signup');
        return;
      }
    }
    
    setIsLoading(false);
  };

  const checkZoomConnection = async () => {
    if (!userData?.userId) return;

    try {
      // Call your backend to check if Zoom is connected
      const response = await fetch(
        `https://app.greysolve.com/webhook/check-connection?userId=${userData.userId}&provider=zoom`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Adjust this based on your API response structure
        if (data.connected || data.status === 'active') {
          setZoomConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking Zoom connection:', error);
      // Don't show error to user, just assume not connected
    }
  };

  const connectZoom = async () => {
    // Double-check we have the latest session data
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email || userData?.email;
    const userId = session?.user?.id || userData?.userId;

    if (!email || !userId) {
      setZoomError('User information not available. Please refresh the page.');
      console.error('Missing user data:', { email, userId, userData, session });
      return;
    }

    // Log what we're sending for debugging
    const requestBody = {
      end_user: {
        id: userId,
        email: email,
      },
    };
    console.log('Connecting Zoom with:', requestBody);
    console.log('Email being sent:', email);
    console.log('User ID being sent:', userId);

    setIsConnectingZoom(true);
    setZoomError('');
    setZoomStatus('Requesting session token...');

    try {
      // Call your n8n webhook
      const response = await fetch('https://app.greysolve.com/webhook-test/create-zoom-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setZoomError(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
        setIsConnectingZoom(false);
        return;
      }

      const data = await response.json();

      if (!data.data || !data.data.connect_link) {
        setZoomError('Error: Invalid response format. Missing connect_link.');
        console.error('Response data:', data);
        setIsConnectingZoom(false);
        return;
      }

      setZoomStatus('Opening Zoom OAuth...');

      // Open the connect link in popup (this should be the OAuth provider URL from your webhook)
      const popup = window.open(
        data.data.connect_link,
        'Connect Zoom',
        'width=500,height=700'
      );

      if (!popup) {
        setZoomError('Error: Popup blocked. Please allow popups for this site.');
        setIsConnectingZoom(false);
        return;
      }

      setZoomStatus('Complete authorization in popup window');

      // Listen for popup to close or message from popup
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // Check if connection was successful (you might want to verify with your backend)
          // For now, we'll assume success if popup closes
          setZoomStatus('');
          setZoomConnected(true);
          setIsConnectingZoom(false);
          
          // Redirect to dashboard after Zoom connection
          // Note: In the future, you might want to wait for inbox connection too
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }, 500);

      // Cleanup interval after 5 minutes
      setTimeout(() => {
        clearInterval(checkPopup);
        if (!popup.closed) {
          popup.close();
        }
      }, 300000);

    } catch (error: any) {
      let errorMessage = 'Error: ';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Network error. This could be due to:\n';
        errorMessage += '- CORS policy blocking the request\n';
        errorMessage += '- Network connectivity issues\n';
        errorMessage += '- The server is not responding\n\n';
        errorMessage += 'Original error: ' + error.message;
      } else {
        errorMessage += error.message;
      }
      setZoomError(errorMessage);
      setZoomStatus('');
      setIsConnectingZoom(false);
      console.error('Full error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const firstName = userData?.firstName || 'there';
  const needsEmailConfirmation = userData?.needsEmailConfirmation;

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
          <p className="text-xl text-gray-600 mb-4">
            Let's get you set up to automate your Zoom follow-ups
          </p>
          {needsEmailConfirmation && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm max-w-md mx-auto">
              Please check your email to confirm your account before continuing.
            </div>
          )}
        </div>

        {/* Onboarding Steps */}
        <div className="bg-gray-50 rounded-xl p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              zoomConnected ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {zoomConnected ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <span className="text-blue-600 font-semibold">1</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Connect your Zoom
                {zoomConnected && <span className="ml-2 text-green-600 text-sm">✓ Connected</span>}
              </h3>
              <p className="text-gray-600 text-sm">
                Link your Zoom account to capture meeting data automatically
              </p>
              {zoomStatus && (
                <div className="mt-2 text-sm text-blue-600">{zoomStatus}</div>
              )}
              {zoomError && (
                <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {zoomError.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Connect your inbox</h3>
              <p className="text-gray-600 text-sm">
                Connect your email to send follow-up emails automatically
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 text-center space-y-4">
          {!zoomConnected ? (
            <button
              onClick={connectZoom}
              disabled={isConnectingZoom}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isConnectingZoom && <Loader2 className="w-5 h-5 animate-spin" />}
              {isConnectingZoom ? 'Connecting...' : 'Connect Zoom'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-green-600 font-medium">Zoom connected successfully!</div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
          {!zoomConnected && (
            <div className="text-sm text-gray-500">Both connections required to continue</div>
          )}
        </div>
      </div>
    </div>
  );
}

