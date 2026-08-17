import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Settings, Trash2, LogOut, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserMenuProps {
  firstName: string;
  userId: string;
  hasSubscription?: boolean;
  cancelsAt?: string | null;
}

function formatCancelsAt(cancelsAt: string): string {
  const date = new Date(cancelsAt);
  if (Number.isNaN(date.getTime())) {
    return cancelsAt;
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function isCancelScheduled(cancelsAt: string | null): boolean {
  if (!cancelsAt) {
    return false;
  }
  const date = new Date(cancelsAt);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
}

function isAlreadyCanceledSubscription(errorText: string): boolean {
  return /no such subscription/i.test(errorText);
}

export default function UserMenu({ firstName, userId, hasSubscription = false, cancelsAt = null }: UserMenuProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userId) {
      alert('User information not available. Please refresh the page.');
      return;
    }

    try {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (response.ok) {
        // Sign out from Supabase
        await supabase.auth.signOut();
        // Clear localStorage
        localStorage.removeItem('user');
        // Redirect to homepage
        navigate('/');
      } else {
        const errorText = await response.text();
        alert(`Failed to delete account: ${errorText || response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error.message || 'Please try again.'}`);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userId) {
      alert('User information not available. Please refresh the page.');
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const errorText = await response.text();
      if (response.ok || isAlreadyCanceledSubscription(errorText)) {
        window.location.reload();
        return;
      }

      alert(`Failed to cancel subscription: ${errorText || response.statusText}`);
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      alert(`Failed to cancel subscription: ${error.message || 'Please try again.'}`);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <span className="text-sm font-medium text-gray-700">{firstName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/onboarding');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Manage Connections
            </button>
            {hasSubscription && !isCancelScheduled(cancelsAt) && (
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  const confirmMessage =
                    'Cancel your subscription? You will keep access until the end of your current billing period. This cannot be undone from here.';
                  if (window.confirm(confirmMessage)) {
                    await handleCancelSubscription();
                  }
                }}
                disabled={isCanceling}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            )}
            {hasSubscription && isCancelScheduled(cancelsAt) && cancelsAt && (
              <div className="px-4 py-2 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed">
                <CreditCard className="w-4 h-4" />
                Cancels {formatCancelsAt(cancelsAt)}
              </div>
            )}
            <button
              onClick={async () => {
                setIsMenuOpen(false);
                await supabase.auth.signOut();
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button
              onClick={async () => {
                setIsMenuOpen(false);
                const confirmMessage = 'Are you sure you want to delete your account? This action takes effect immediately. There is no grace period. It cannot be reversed or recovered. Are you sure?';
                if (window.confirm(confirmMessage)) {
                  await handleDeleteAccount();
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}

