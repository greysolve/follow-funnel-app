import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Mail, CheckCircle, Users, Zap } from 'lucide-react';

export default function ZoomFollowUpLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-gray-600 hover:text-gray-900">Features</button>
            <button className="text-gray-600 hover:text-gray-900">Pricing</button>
            <button className="text-gray-600 hover:text-gray-900">Integrations</button>
            <button className="text-gray-600 hover:text-gray-900">Resources</button>
          </nav>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-gray-900"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="text-sm font-medium text-blue-600 mb-4">
              AUTOMATE YOUR ZOOM FOLLOW-UPS
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Never Miss a Follow-Up After Your Meetings
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Automatically capture meeting insights, send personalized follow-ups, 
              and track engagement—all within minutes of your Zoom calls ending.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Start here
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-400 transition">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
              {/* Meeting Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sales Call - Acme Corp</div>
                    <div className="text-sm text-gray-500">Just ended • 45 min</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">3 participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Action items captured</span>
                  </div>
                </div>
              </div>

              {/* Follow-up Preview */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-900">Follow-up Email</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Sent
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">Hi Sarah,</div>
                  <div>Great meeting today! Here's a summary...</div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Next meeting scheduled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white rounded-lg p-4 shadow text-center">
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                  <div className="text-2xl font-bold text-green-600">2min</div>
                  <div className="text-xs text-gray-600">Avg Send Time</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                  <div className="text-2xl font-bold text-indigo-600">500+</div>
                  <div className="text-xs text-gray-600">Meetings/mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for seamless follow-ups
            </h2>
            <p className="text-xl text-gray-600">
              Transform your Zoom meetings into actionable next steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Capture
              </h3>
              <p className="text-gray-600">
                Automatically extract key points, action items, and decisions from every meeting
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Follow-ups
              </h3>
              <p className="text-gray-600">
                Send personalized emails to each participant with relevant meeting summaries
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Schedule Next Steps
              </h3>
              <p className="text-gray-600">
                Seamlessly coordinate follow-up meetings and track action item completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to automate your follow-ups?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of teams saving 10+ hours per week on meeting follow-ups
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition"
          >
            Start here
          </button>
        </div>
      </section>
    </div>
  );
}

