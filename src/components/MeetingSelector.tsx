import { RefreshCw } from 'lucide-react';

interface MeetingSelectorProps {
  meetings: any[];
  selectedMeeting: string;
  isLoading: boolean;
  onMeetingChange: (meetingId: string) => void;
  onRefresh: () => void;
}

export default function MeetingSelector({
  meetings,
  selectedMeeting,
  isLoading,
  onMeetingChange,
  onRefresh,
}: MeetingSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Meeting
        </label>
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh meetings"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <select
        value={selectedMeeting}
        onChange={(e) => onMeetingChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isLoading}
      >
        <option value="">Choose a meeting...</option>
        {meetings.map((meeting: any) => {
          const meetingId = meeting.id || meeting.uuid;
          const displayName = meeting.topic || `Meeting ${meetingId}`;
          return (
            <option key={meetingId} value={meetingId}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
