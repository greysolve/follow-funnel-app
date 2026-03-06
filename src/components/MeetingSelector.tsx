import { RefreshCw } from 'lucide-react';
import Select, { type SingleValue } from 'react-select';

interface MeetingOption {
  value: string;
  label: string;
}

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
  const options: MeetingOption[] = meetings.map((meeting: any) => {
    const meetingId = String(meeting.id ?? meeting.uuid ?? '');
    const displayName = meeting.topic || `Meeting ${meetingId}`;
    return { value: meetingId, label: displayName };
  });

  const selectedOption = options.find((opt) => opt.value === selectedMeeting) ?? null;

  const handleChange = (option: SingleValue<MeetingOption>) => {
    onMeetingChange(option?.value ?? '');
  };

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
      <Select<MeetingOption>
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable
        isClearable
        isDisabled={isLoading}
        placeholder="Choose a meeting..."
        classNamePrefix="meeting-select"
        classNames={{
          control: () =>
            '!min-h-[42px] !border-gray-300 !rounded-lg !shadow-none hover:!border-gray-400 focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:!border-blue-500',
          menu: () => '!rounded-lg !border !border-gray-200 !shadow-lg !z-50',
          option: (state) =>
            state.isFocused
              ? '!bg-blue-50 !text-gray-900'
              : state.isSelected
                ? '!bg-blue-100 !text-gray-900'
                : '',
          input: () => '!text-gray-900',
          placeholder: () => '!text-gray-500',
        }}
      />
    </div>
  );
}
