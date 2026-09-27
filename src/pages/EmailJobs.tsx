import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Pause, Pencil, Trash2, Video, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmailJob {
  id: string;
  meeting_id: string;
  meeting_title: string | null;
  recipient_type: string;
  template_id: string;
  recording_url: string | null;
  recipient_list: Record<string, any> | any[] | null;
  meeting_end_time: string | null;
  delay_minutes: number | null;
  scheduled_send_time: string | null;
  send_status: string;
  created_at: string;
  error_msg: string | null;
}

const toRecipients = (list: EmailJob['recipient_list']): any[] =>
  Array.isArray(list) ? list : list && typeof list === 'object' ? Object.values(list) : [];

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString() : '—');

const audienceLabel = (type: string) => (type === 'no_shows' ? 'No-shows' : type === 'attendees' ? 'Attendees' : type);

const statusClasses = (status: string) => {
  switch (status) {
    case 'sent':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function EmailJobs() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<EmailJob[]>([]);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<EmailJob | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/email-jobs?userId=${session.user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          throw new Error();
        }
        setJobs(data);
      } catch {
        setError('Failed to load email jobs.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Jobs</h1>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {!error && jobs.length === 0 && (
          <p className="text-sm text-gray-600">No email jobs yet.</p>
        )}

        {jobs.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span>Meeting</span>
              <span>Audience</span>
              <span>Recipients</span>
              <span>Scheduled send</span>
              <span>Status</span>
              <span className="w-[228px]" />
            </div>

            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr_1fr_auto] gap-2 md:gap-4 items-center px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <span className="font-medium text-gray-900 truncate">{job.meeting_title || job.meeting_id}</span>
                <span className="text-sm text-gray-700">{audienceLabel(job.recipient_type)}</span>
                <span className="text-sm text-gray-700">{toRecipients(job.recipient_list).length}</span>
                <span className="text-sm text-gray-700">{formatDate(job.scheduled_send_time)}</span>
                <span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClasses(job.send_status)}`}>
                    {job.send_status}
                  </span>
                </span>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
                <dt className="text-gray-500">Meeting</dt>
                <dd className="text-gray-900">{selectedJob.meeting_title || '—'}</dd>
                <dt className="text-gray-500">Meeting ID</dt>
                <dd className="text-gray-900">{selectedJob.meeting_id}</dd>
                <dt className="text-gray-500">Audience</dt>
                <dd className="text-gray-900">{audienceLabel(selectedJob.recipient_type)}</dd>
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClasses(selectedJob.send_status)}`}>
                    {selectedJob.send_status}
                  </span>
                </dd>
                <dt className="text-gray-500">Meeting end</dt>
                <dd className="text-gray-900">{formatDate(selectedJob.meeting_end_time)}</dd>
                <dt className="text-gray-500">Delay</dt>
                <dd className="text-gray-900">{selectedJob.delay_minutes ?? '—'} minutes</dd>
                <dt className="text-gray-500">Scheduled send</dt>
                <dd className="text-gray-900">{formatDate(selectedJob.scheduled_send_time)}</dd>
                <dt className="text-gray-500">Template ID</dt>
                <dd className="text-gray-900 break-all">{selectedJob.template_id}</dd>
                <dt className="text-gray-500">Recording URL</dt>
                <dd className="text-gray-900 break-all">{selectedJob.recording_url || '—'}</dd>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{formatDate(selectedJob.created_at)}</dd>
                {selectedJob.error_msg && (
                  <>
                    <dt className="text-gray-500">Error</dt>
                    <dd className="text-red-600 break-all">{selectedJob.error_msg}</dd>
                  </>
                )}
              </dl>

              <h3 className="text-sm font-medium text-gray-700 mt-6 mb-3">
                Recipients ({toRecipients(selectedJob.recipient_list).length})
              </h3>
              {toRecipients(selectedJob.recipient_list).length === 0 ? (
                <p className="text-sm text-gray-500">No recipients.</p>
              ) : (
                <div className="space-y-2">
                  {toRecipients(selectedJob.recipient_list).map((recipient: any, index: number) => (
                    <div key={recipient.id || recipient.email || index} className="p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-sm text-gray-900">
                        {recipient.first_name} {recipient.last_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{recipient.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Cancel Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
