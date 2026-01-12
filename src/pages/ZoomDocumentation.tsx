import { useNavigate } from 'react-router-dom';
import { Video, ArrowLeft } from 'lucide-react';

export default function ZoomDocumentation() {
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
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="border-b-3 border-blue-600 pb-5 mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">FollowFunnel for Zoom</h1>
          <p className="text-lg text-gray-600">Documentation for adding, using, and removing the app</p>
        </header>

        {/* SECTION 1: Adding the App */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-600 mb-5 pb-3 border-b-2 border-gray-200">Adding the App</h2>
          
          <p className="text-gray-700 mb-6">Follow these steps to add FollowFunnel to your Zoom account:</p>
          
          <ol className="list-decimal pl-6 space-y-6 mb-6">
            <li>
              <strong>Navigate to signup:</strong> Go to <a href="https://www.followfunnel.app/signup" className="text-blue-600 hover:underline">https://www.followfunnel.app/signup</a>
              <div className="mt-4">
                <img 
                  src="/img/followfunnel_signed_up_page_use_this.png" 
                  alt="Signup page" 
                  className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            </li>
            
            <li>
              <strong>Create your account:</strong> Enter your First Name, Last Name, Email, and Password, then click "Create account"
            </li>
            
            <li>
              <strong>Complete onboarding:</strong> You'll be redirected to the onboarding page where you'll connect both Zoom and Gmail
              <div className="mt-4">
                <img 
                  src="/img/followfunnel_pre_auth.png" 
                  alt="Onboarding page showing Zoom and Gmail connection options" 
                  className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            </li>
            
            <li>
              <strong>Connect Zoom:</strong> Click "Connect" for Zoom and authorize the requested permissions
              <div className="mt-4">
                <img 
                  src="/img/followfunnel_zoom_permissions.png" 
                  alt="Zoom OAuth authorization screen" 
                  className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            </li>
            
            <li>
              <strong>Connect Gmail:</strong> Click "Connect" for Gmail and authorize the requested permissions
              <div className="mt-4">
                <img 
                  src="/img/followfunnel_gmail_auth.png" 
                  alt="Gmail OAuth authorization screen" 
                  className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            </li>
            
            <li>
              <strong>Verify connections:</strong> Confirm both Zoom and Gmail show as successfully connected
            </li>
          </ol>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <strong className="text-yellow-900">Troubleshooting:</strong> 
            <span className="text-yellow-800 ml-2">If authorization fails, ensure pop-ups are enabled in your browser and that you're logged into the correct Zoom and Gmail accounts.</span>
          </div>
        </section>

        {/* SECTION 2: Using the App */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-600 mb-5 pb-3 border-b-2 border-gray-200">Using the App</h2>
          
          <p className="text-gray-700 mb-6">Once connected, you can configure automated follow-ups for your Zoom meetings:</p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Step 1: Access Your Dashboard</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>After completing onboarding, click "Go to Dashboard"</li>
            <li>You'll see your main workspace for managing follow-ups</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Step 2: Select a Meeting</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Use the dropdown menu to select which Zoom meeting you want to configure follow-ups for</li>
            <li>Meeting data will load automatically once selected</li>
          </ol>
          <div className="mt-4 mb-6">
            <img 
              src="/img/followfunnel_select_meeting.png" 
              alt="Dashboard with meeting selected" 
              className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Step 3: Configure Attendees Template</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Click the <strong>"Attendees"</strong> tab</li>
            <li>Enter a template name (e.g., "Thank You Email")</li>
            <li>Set the email subject line (you can use variables like <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Meeting Title}}</code>)</li>
            <li>Compose your email body using the template editor</li>
            <li>Insert merge fields by clicking on available variables</li>
            <li>Set when to send: enter delay amount and select time unit (minutes/hours/days after meeting ends)</li>
          </ol>
          <div className="mt-4 mb-6">
            <img 
              src="/img/followfunnel_attendees_template.png" 
              alt="Attendees tab with template editor" 
              className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Step 4: Configure No-Shows Template</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Click the <strong>"No Shows"</strong> tab</li>
            <li>Repeat the template configuration process for registrants who didn't attend</li>
            <li>Use different messaging appropriate for no-shows (e.g., sharing the recording)</li>
          </ol>
          <div className="mt-4 mb-6">
            <img 
              src="/img/followfunnel_no-shows-template.png" 
              alt="No Shows tab configured" 
              className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Step 5: Create Sending Package</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Review your configurations for both tabs</li>
            <li>Click <strong>"Create Sending Package"</strong></li>
            <li>Your follow-up sequence is now active</li>
          </ol>
          <div className="mt-4 mb-6">
            <img 
              src="/img/followfunnel_save_sending_package.png" 
              alt="Success confirmation after creating sending package" 
              className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Happens Next</h3>
          <p className="text-gray-700 mb-3">After your meeting ends:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
            <li>FollowFunnel waits for the delay you specified</li>
            <li>Emails are automatically sent to attendees and no-shows using your configured templates</li>
            <li>Merge fields are replaced with actual attendee data</li>
            <li>Emails are sent from your connected Gmail account</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Template Variables</h3>
            <p className="text-gray-700 mb-3">You can insert these merge fields into your email templates:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{First Name}}</code> - Attendee's first name</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Last Name}}</code> - Attendee's last name</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Email}}</code> - Attendee's email address</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Company}}</code> - Attendee's company name</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Job Title}}</code> - Attendee's job title</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{City}}</code> - Attendee's city</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Country}}</code> - Attendee's country</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Recording Link}}</code> - Link to meeting recording</li>
              <li><code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono text-sm">{{Meeting Title}}</code> - Title of the Zoom meeting</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3: Removing the App */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-600 mb-5 pb-3 border-b-2 border-gray-200">Removing the App</h2>
          
          <p className="text-gray-700 mb-6">You can remove FollowFunnel from your Zoom account at any time:</p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Standard Zoom Removal Process</h3>
          <ol className="list-decimal pl-6 space-y-2 mb-6">
            <li>Sign in to <a href="https://marketplace.zoom.us" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zoom App Marketplace</a></li>
            <li>In the top right corner, click <strong>Manage</strong></li>
            <li>On the left side, click <strong>Added Apps</strong></li>
            <li>Find "Follow Funnel Dev" in your list of apps</li>
            <li>Click <strong>Remove</strong></li>
            <li>Optionally select a reason for removal</li>
            <li>Click <strong>Remove</strong> to confirm</li>
          </ol>
          <div className="mt-4 mb-6">
            <img 
              src="/img/followfunnel_remove_app.png" 
              alt="Remove app from Zoom marketplace" 
              className="w-full max-w-3xl rounded-lg border-2 border-gray-200 shadow-sm"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Happens When You Remove the App</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
            <li>FollowFunnel will no longer have access to your Zoom account</li>
            <li>Scheduled follow-ups for future meetings will not be sent</li>
            <li>Your FollowFunnel account and templates remain active</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Deleting Your Account</h3>
          <p className="text-gray-700 mb-3">If you want to completely delete your FollowFunnel account and all associated data:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
            <li>Contact our support team at <a href="mailto:support@followfunnel.app" className="text-blue-600 hover:underline">support@followfunnel.app</a></li>
            <li>Include "Account Deletion Request" in the subject line</li>
            <li>We will process your request within 48 hours</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <strong className="text-yellow-900">Note:</strong> 
            <span className="text-yellow-800 ml-2">Account deletion is permanent and cannot be undone. All templates and configurations will be permanently deleted.</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-gray-200 text-center text-gray-600">
          <p className="mb-2"><strong>Need Help?</strong></p>
          <p className="mb-4">
            Visit our <a href="https://follow-funnel-for-zoom.nolt.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Support Portal</a> or email <a href="mailto:support@followfunnel.app" className="text-blue-600 hover:underline">support@followfunnel.app</a>
          </p>
          <p className="text-sm mt-5">&copy; 2025 FollowFunnel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
