import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  content: string;
  registrants: any[];
  selectedRegistrant: any;
  onRegistrantSelect: (registrant: any) => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  subject,
  content,
  registrants,
  selectedRegistrant,
  onRegistrantSelect,
}: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Email Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Registrant List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recipients</h3>
              <div className="space-y-2">
                {registrants.map((registrant) => (
                  <button
                    key={registrant.id || registrant.email}
                    onClick={() => onRegistrantSelect(registrant)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRegistrant?.id === registrant.id || selectedRegistrant?.email === registrant.email
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {registrant.first_name} {registrant.last_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{registrant.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Email Preview */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedRegistrant ? (
              <div>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">To:</div>
                  <div className="font-medium text-gray-900">
                    {selectedRegistrant.first_name} {selectedRegistrant.last_name} &lt;{selectedRegistrant.email}&gt;
                  </div>
                </div>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Subject:</div>
                  <div className="font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: subject }} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Body:</div>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Select a recipient to preview the email
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
