import { useNavigate } from 'react-router-dom';
import { Clock, GitBranch, Link2, Video } from 'lucide-react';
import MarketingHeader from '../components/MarketingHeader';

const steps = [
  {
    label: 'STEP 01 · CAPTURE',
    icon: Video,
    title: 'Know exactly who to follow up with',
    body: 'Connect Zoom and pick a meeting — FollowFunnel pulls registrants and attendees for you. Hosts are left off the send list automatically.',
    offset: 'md:-translate-x-2 md:-translate-y-2',
  },
  {
    label: 'STEP 02 · SEGMENT',
    icon: GitBranch,
    title: 'Treat showed-up and no-show differently',
    body: "Write one email for the people who attended and another for the people who didn't. Assign both to a meeting before it runs.",
    pills: true,
    offset: 'md:translate-x-2 md:-translate-y-2',
  },
  {
    label: 'STEP 03 · PERSONALIZE',
    icon: Link2,
    title: 'Every send stays specific, without rewriting',
    body: 'Drop meeting details and a recording link straight into the subject or body. Variables fill themselves in per recipient.',
    offset: 'md:-translate-x-2 md:translate-y-2',
  },
  {
    label: 'STEP 04 · DELIVER',
    icon: Clock,
    title: 'Goes out on your delay, from your inbox',
    body: 'Choose how long to wait after the meeting ends. Emails send from your Gmail — not from FollowFunnel — so they land like you wrote them.',
    offset: 'md:translate-x-2 md:translate-y-2',
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Four parts, one flow. Set it once per meeting.
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Each piece does one job, and they run in order — capture, split, personalize, deliver.
        </p>

        <div className="relative">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {steps.map(({ label, icon: Icon, title, body, pills, offset }) => (
              <div
                key={label}
                className={`bg-white border border-gray-200 rounded-xl p-6 ${offset}`}
              >
                <p className="text-sm font-medium text-blue-600 mb-4">{label}</p>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">{body}</p>
                {pills && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                      Attendees
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
                      No-shows
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center md:mt-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:z-10">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </button>
          </div>
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
