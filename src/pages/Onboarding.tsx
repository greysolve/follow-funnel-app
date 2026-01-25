import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CheckCircle, Loader2, Mail, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UserMenu from '../components/UserMenu';

export default function Onboarding() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomStatus, setZoomStatus] = useState<string>('');
  const [zoomError, setZoomError] = useState<string>('');
  const [isConnectingZoom, setIsConnectingZoom] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [isConnectingEmail, setIsConnectingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isDisconnectingZoom, setIsDisconnectingZoom] = useState(false);
  const [isDisconnectingEmail, setIsDisconnectingEmail] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Check connection status after auth is confirmed
    console.log('useEffect for connections:', { hasUserData: !!userData, isLoading, userId: userData?.userId });
    if (userData && !isLoading) {
      // Reset connection states before checking
      console.log('Resetting connection states and checking...');
      setZoomConnected(false);
      setEmailConnected(false);
      checkConnections();
      checkSubscription();
    }
  }, [userData, isLoading]);

  useEffect(() => {
    // Re-check subscription when connections change (in case they just connected)
    if (zoomConnected && emailConnected && userData?.userId) {
      checkSubscription();
    }
  }, [zoomConnected, emailConnected]);

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

  const checkConnections = async () => {
    console.log('checkConnections called, userId:', userData?.userId);
    if (!userData?.userId) {
      console.log('No userId, returning early');
      return;
    }

    try {
      const url = `/api/check-connection?userId=${userData.userId}`;
      console.log('Fetching connections from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Connections check response:', data);
        
        // Check if response is an error object
        if (data && data.error) {
          console.error('Connection check error:', data.error);
          setZoomConnected(false);
          setEmailConnected(false);
          return;
        }
        
        // Initialize both as false
        let zoomActive = false;
        let gmailActive = false;
        
        // Normalize to array
        const connections = Array.isArray(data) ? data : [data];
        
        // Loop through connections and set state based on what we find
        connections.forEach((conn: any) => {
          zoomActive = zoomActive || (conn.provider === 'zoom' && conn.status === 'active');
          gmailActive = gmailActive || ((conn.provider === 'gmail' || conn.provider === 'google-mail') && conn.status === 'active');
        });
        
        console.log('Final connection status:', { zoomActive, gmailActive });
        setZoomConnected(zoomActive);
        setEmailConnected(gmailActive);
      } else {
        console.log('Connections check failed:', response.status);
        setZoomConnected(false);
        setEmailConnected(false);
      }
    } catch (error) {
      console.error('Error checking connections:', error);
      // Don't show error to user, just assume not connected
      setZoomConnected(false);
      setEmailConnected(false);
    }
  };

  const checkSubscription = async () => {
    if (!userData?.userId) return;
    
    try {
      const response = await fetch(
        `/api/check-subscription?userId=${userData.userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Check if response is an error object
        if (data && data.error) {
          console.error('Subscription check error:', data.error);
          setHasSubscription(false);
          return;
        }
        
        // API can return either a single object or an array
        if (Array.isArray(data)) {
          const hasActiveSubscription = data.length > 0 && data.some(
            (sub: any) => sub.subscription_status === 'active'
          );
          setHasSubscription(hasActiveSubscription);
        } else if (data && typeof data === 'object') {
          const hasActiveSubscription = data.subscription_status === 'active';
          setHasSubscription(hasActiveSubscription);
        } else {
          setHasSubscription(false);
        }
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
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

    setIsConnectingZoom(true);
    setZoomError('');
    setZoomStatus('Requesting session token...');

    try {
      const requestBody = {
        end_user: {
          id: userId,
          email: email,
        },
      };
      console.log('Connecting Zoom with:', requestBody);

      const response = await fetch('/api/create-zoom-auth', {
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

      setZoomStatus('Opening Zoom authorization...');

      // Open the connect link in popup
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

      // Listen for popup to close
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          setZoomStatus('');
          setIsConnectingZoom(false);
          
          // Check connection status after popup closes
          setTimeout(async () => {
            await checkConnections();
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
      console.error('Zoom connection error:', error);
      setIsConnectingZoom(false);
      setZoomStatus('');
      setZoomError(
        error.message ||
        'Failed to connect Zoom. Please check your connection and try again.'
      );
    }
  };

  const connectGmail = async () => {
    // Double-check we have the latest session data
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email || userData?.email;
    const userId = session?.user?.id || userData?.userId;

    if (!email || !userId) {
      setEmailError('User information not available. Please refresh the page.');
      console.error('Missing user data:', { email, userId, userData, session });
      return;
    }

    setIsConnectingEmail(true);
    setEmailError('');
    setEmailStatus('Requesting session token...');

    try {
      const requestBody = {
        end_user: {
          id: userId,
          email: email,
        },
      };
      console.log('Connecting Gmail with:', requestBody);

      const response = await fetch('/api/create-gmail-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Gmail auth: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Gmail auth response:', data);

      if (!data.data || !data.data.connect_link) {
        throw new Error('No connect link received from server');
      }

      setEmailStatus('Opening Gmail authorization...');

      // Open OAuth popup
      const popup = window.open(
        data.data.connect_link,
        'gmail-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      setEmailStatus('Complete authorization in popup window');

      // Listen for popup to close
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          setEmailStatus('');
          setIsConnectingEmail(false);
          
          // Check connection status after popup closes
          setTimeout(async () => {
            await checkConnections();
          }, 1000);
        }
      }, 500);
    } catch (error: any) {
      console.error('Gmail connection error:', error);
      setIsConnectingEmail(false);
      setEmailStatus('');
      setEmailError(
        error.message ||
        'Failed to connect Gmail. Please check your connection and try again.'
      );
    }
  };

  const disconnectZoom = async () => {
    if (!userData?.userId) {
      setZoomError('User information not available. Please refresh the page.');
      return;
    }

    setIsDisconnectingZoom(true);
    setZoomError('');

    try {
      const response = await fetch(
        `/api/delete-connection?userId=${userData.userId}&provider=zoom`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setZoomConnected(false);
        await checkConnections();
      } else {
        const errorText = await response.text();
        setZoomError(`Failed to disconnect Zoom: ${errorText || response.statusText}`);
      }
    } catch (error: any) {
      console.error('Zoom disconnection error:', error);
      setZoomError(
        error.message ||
        'Failed to disconnect Zoom. Please try again.'
      );
    } finally {
      setIsDisconnectingZoom(false);
    }
  };

  const disconnectGmail = async () => {
    if (!userData?.userId) {
      setEmailError('User information not available. Please refresh the page.');
      return;
    }

    setIsDisconnectingEmail(true);
    setEmailError('');

    try {
      const response = await fetch(
        `/api/delete-connection?userId=${userData.userId}&provider=gmail`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setEmailConnected(false);
        await checkConnections();
      } else {
        const errorText = await response.text();
        setEmailError(`Failed to disconnect Gmail: ${errorText || response.statusText}`);
      }
    } catch (error: any) {
      console.error('Gmail disconnection error:', error);
      setEmailError(
        error.message ||
        'Failed to disconnect Gmail. Please try again.'
      );
    } finally {
      setIsDisconnectingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const firstName = userData?.firstName || 'there';
  const needsEmailConfirmation = userData?.needsEmailConfirmation || false;
  const allConnected = zoomConnected && emailConnected;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold">FollowFunnel</span>
            </div>
            
            {/* User Menu */}
            <UserMenu firstName={firstName} userId={userData?.userId || ''} />
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

        {/* Integration Cards */}
        <div className="space-y-4 mb-8">
          {/* Zoom Integration */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-gray-200 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  zoomConnected ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {zoomConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Video className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                    Zoom
                    {zoomConnected && <span className="ml-2 text-green-600 text-sm">✓ Connected</span>}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Link your Zoom account to capture meeting data automatically
                  </p>
                  {zoomStatus && (
                    <div className="text-sm text-blue-600">{zoomStatus}</div>
                  )}
                  {zoomError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {zoomError.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {zoomConnected ? (
                  <>
                    <div className="px-4 py-2 text-green-600 font-medium">Connected</div>
                    <button
                      onClick={disconnectZoom}
                      disabled={isDisconnectingZoom}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isDisconnectingZoom && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isDisconnectingZoom ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectZoom}
                    disabled={isConnectingZoom}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isConnectingZoom && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isConnectingZoom ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gmail Integration */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-gray-200 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  emailConnected ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {emailConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Mail className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                    Gmail
                    {emailConnected && <span className="ml-2 text-green-600 text-sm">✓ Connected</span>}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Connect your Gmail account to send follow-up emails automatically
                  </p>
                  {emailStatus && (
                    <div className="text-sm text-blue-600">{emailStatus}</div>
                  )}
                  {emailError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {emailError.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {emailConnected ? (
                  <>
                    <div className="px-4 py-2 text-green-600 font-medium">Connected</div>
                    <button
                      onClick={disconnectGmail}
                      disabled={isDisconnectingEmail}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isDisconnectingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isDisconnectingEmail ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectGmail}
                    disabled={isConnectingEmail}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isConnectingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isConnectingEmail ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Paywall - Show when both connected but no subscription */}
        {allConnected && !hasSubscription && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your accounts are connected
                </h2>
                <p className="text-gray-600">
                  Subscribe to see your meetings and start sending follow-ups
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
                <a
                  href="https://buy.stripe.com/00waEX3rd1xm7rVb7p3ZK04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Select Plan
                </a>
              </div>

              {/* Lifetime Plan */}
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$129</span>
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
                <a
                  href="https://buy.stripe.com/3cI8wPgdZdg44fJb7p3ZK03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Select Plan
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Button - Only show if subscribed */}
        {allConnected && hasSubscription && (
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Show message if not all connected */}
        {!allConnected && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Connect both integrations to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
