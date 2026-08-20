import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Video, X } from 'lucide-react';

export default function MarketingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== '#pricing') {
      return;
    }

    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  const goToPricing = () => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      if (location.hash !== '#pricing') {
        navigate({ pathname: '/', hash: 'pricing' }, { replace: true });
      }
      return;
    }
    navigate({ pathname: '/', hash: 'pricing' });
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 shrink-0"
        >
          <Video className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-semibold">FollowFunnel</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <button type="button" onClick={goToPricing} className="text-gray-600 hover:text-gray-900">
            Pricing
          </button>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="hidden sm:block text-gray-700 hover:text-gray-900"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Get Started
          </button>
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
          <Link to="/features" className="text-gray-700 py-1">
            Features
          </Link>
          <button type="button" onClick={goToPricing} className="text-left text-gray-700 py-1">
            Pricing
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              navigate('/login');
            }}
            className="sm:hidden text-left text-gray-700 py-1"
          >
            Log in
          </button>
        </div>
      )}
    </header>
  );
}
