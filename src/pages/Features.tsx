import { useNavigate } from 'react-router-dom';
import { Clock, Link2, Mail, Plug, Users, Video } from 'lucide-react';
import MarketingHeader from '../components/MarketingHeader';

const features = [
  {
    icon: Video,
    title: 'Zoom meetings and registrants',
    body: 'Connect Zoom, pick a meeting, and load who registered. Hosts are left out of the send list.',
  },
  {
    icon: Mail,
    title: 'Attendee and no-show templates',
    body: 'Write one email for people who showed up and another for people who did not. Assign both to a meeting before you send.',
  },
  {
    icon: Clock,
    title: 'Send after the meeting, on a delay',
    body: 'Create a sending package with how long to wait after the meeting ends. Emails go out from your Gmail, not from FollowFunnel.',
  },
  {
    icon: Link2,
    title: 'Template variables',
    body: 'Insert meeting details and a recording link into the subject or body so each send stays specific without rewriting from scratch.',
  },
  {
    icon: Plug,
    title: 'Zoom and Gmail connections',
    body: 'Connect or disconnect Zoom and Gmail from your account. Both need to be active before you can send.',
  },
  {
    icon: Users,
    title: 'Monthly or lifetime, cancel at period end',
    body: 'Subscribe monthly at $45 or pay $129 once. Cancel a monthly plan and keep access until the date already paid through.',
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <p className="text-sm font-medium text-blue-600 mb-4">FEATURES</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          What FollowFunnel actually does
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          After a Zoom meeting, send different emails to attendees and no-shows from your Gmail —
          on a delay you choose.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">FollowFunnel</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="hover:text-gray-900 transition"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="hover:text-gray-900 transition"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
