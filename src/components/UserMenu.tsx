import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Settings, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserMenuProps {
  firstName: string;
  userId: string;
}

export default function UserMenu({ firstName, userId }: UserMenuProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userId) {
      alert('User information not available. Please refresh the page.');
      return;
    }

    try {
      const response = await fetch('https://app.greysolve.com/webhook/delete-user', {
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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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

