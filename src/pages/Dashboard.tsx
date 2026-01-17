import { useEffect, useState, useRef } from 'react';
import { Video, CreditCard, CheckCircle, Loader2, Users, UserX, Eye } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import MeetingSelector from '../components/MeetingSelector';
import TemplateSelector from '../components/TemplateSelector';
import EmailEditor, { EmailEditorRef } from '../components/EmailEditor';
import PreviewModal from '../components/PreviewModal';
import VariableButtons from '../components/VariableButtons';
import {
  variables,
  substituteVariables,
  calculateDelayMinutes,
  calculateMeetingEndTime,
  stripColorStyles,
} from '../utils/templateUtils';

export default function Dashboard() {
  // Use custom hooks for data and template management
  const dashboardData = useDashboardData();
  const templateEditor = useTemplateEditor();

  // Extract values from hooks
  const {
    userData,
    isLoading,
    hasSubscription,
    hasRequiredConnections,
    connections,
    meetings,
    isLoadingMeetings,
    templates,
    attendeesList,
    noShowsList,
    allRegistrantsForPreview,
    recordingUrl,
    templatesFetchedRef,
    fetchMeetings,
    fetchTemplates,
    fetchRegistrants,
    fetchRecording,
    fetchAssignment,
    setAssignment,
  } = dashboardData;

  const {
    activeTab,
    setActiveTab,
    getSelectedTemplateId,
    setSelectedTemplateId,
    getCurrentTemplate,
    setCurrentTemplate,
    getEmailSubject,
    setEmailSubject,
    getCurrentEmailContent,
    getTemplateName,
    setTemplateName,
    loadTemplateForTab,
    clearTabState,
    handleEditorChange,
  } = templateEditor;

  // Local state for UI interactions
  const [selectedMeeting, setSelectedMeeting] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRegistrantForPreview, setSelectedRegistrantForPreview] = useState<any>(null);
  const [delayAmount, setDelayAmount] = useState<number>(5);
  const [delayUnit, setDelayUnit] = useState<string>('minutes');
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const emailEditorRef = useRef<EmailEditorRef>(null);

  // Helper functions
  const getCurrentRegistrantsList = (): any[] => {
    return activeTab === 'attendees' ? attendeesList : noShowsList;
  };

  const handleVariableClick = (variable: string) => {
    if (emailEditorRef.current) {
      emailEditorRef.current.insertVariable(variable);
    }
  };

  const handlePreviewClick = () => {
    if (!selectedMeeting) return;
    setIsPreviewOpen(true);
  };

  const handleRegistrantSelect = (registrant: any) => {
    setSelectedRegistrantForPreview(registrant);
  };

  const getPreviewContent = (): string => {
    if (!selectedRegistrantForPreview) return '';
    const currentContent = getCurrentEmailContent();
    const meeting = meetings.find((m: any) => {
      const meetingId = m.id || m.uuid;
      return meetingId === selectedMeeting || meetingId?.toString() === selectedMeeting?.toString();
    });
    return substituteVariables(
      currentContent,
      selectedRegistrantForPreview,
      meeting?.topic,
      recordingUrl
    );
  };

  const getPreviewSubject = (): string => {
    if (!selectedRegistrantForPreview) return getEmailSubject();
      const meeting = meetings.find((m: any) => {
        const meetingId = m.id || m.uuid;
        return meetingId === selectedMeeting || meetingId?.toString() === selectedMeeting?.toString();
      });
    return substituteVariables(
      getEmailSubject(),
      selectedRegistrantForPreview,
      meeting?.topic,
      recordingUrl
    );
  };

  const templateUsesRecordingLink = (): boolean => {
    const currentContent = getCurrentEmailContent();
    const currentSubject = getEmailSubject();
    return currentContent.includes('{{recording_link}}') || currentSubject.includes('{{recording_link}}');
  };

  const getDelayInMinutes = (): number => {
    return calculateDelayMinutes(delayAmount, delayUnit);
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('🟦 handleTemplateSelect called:', {
      templateId,
      activeTab,
      currentSelectedId: getSelectedTemplateId(),
    });

    const currentTab = activeTab === 'attendees' ? 'attendees' : 'noShows';
    setSelectedTemplateId(templateId, currentTab);
    if (templateId) {
      // Find template in loaded templates array
      const template = templates.find((t: any) => t.id === templateId);
      if (template) {
        loadTemplateForTab(template, currentTab);
        } else {
        console.error('❌ Template not found in array:', templateId);
        }
      } else {
      clearTabState(currentTab);
    }
  };

  const handleSave = async () => {
    if (!selectedMeeting || !userData?.userId) {
      setSaveError('Please select a meeting first');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    setSaveError('');

    try {
      let templateId = getSelectedTemplateId();
      const templateType = activeTab === 'attendees' ? 'attendees' : 'no_shows';
      const emailBody = getCurrentEmailContent();
      const currentSubject = getEmailSubject();
      const currentName = getTemplateName();
      const currentTemplateData = getCurrentTemplate();

      console.log('Saving template:', {
        selectedTemplateId: templateId,
        templateType,
        hasSubject: !!currentSubject,
        hasBody: !!emailBody,
      });

      // Strip color styles from body before saving
      const cleanedBody = stripColorStyles(emailBody);

      // If template ID exists, update it
      if (templateId) {
        const updatedTemplate = {
          user_id: userData.userId,
          template_type: templateType,
          subject: currentSubject,
          body: cleanedBody,
          name: currentName || currentTemplateData?.name || currentSubject || `${templateType} template`,
        };

        console.log('Updating template:', updatedTemplate);

        const updateResponse = await fetch(
          `/api/templates?userId=${userData.userId}&templateId=${templateId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTemplate),
          }
        );

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update template: ${updateResponse.status} ${errorText}`);
        }

        console.log('Template updated successfully');
      } else {
        // No template selected - create a new one
        if (!currentName) {
          setSaveError('Please provide a template name');
          setIsSaving(false);
          return;
        }

        const newTemplate = {
          user_id: userData.userId,
          template_type: templateType,
          subject: currentSubject,
          body: cleanedBody,
          name: currentName,
        };

        console.log('Creating new template:', newTemplate);

        const createResponse = await fetch(`/api/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTemplate),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create template: ${createResponse.status} ${errorText}`);
        }

        const createdTemplate = await createResponse.json();
        console.log('Template created:', createdTemplate);

        const template = Array.isArray(createdTemplate) ? createdTemplate[0] : createdTemplate;

        if (!template || !template.id) {
          throw new Error(
            'Template created but no ID returned from server. Response: ' + JSON.stringify(createdTemplate)
          );
        }

        templateId = template.id;
        setSelectedTemplateId(templateId, activeTab);
        setCurrentTemplate(template, activeTab);
      }

      // Validate templateId exists before saving assignment
      if (!templateId) {
        throw new Error('Template ID is required to save assignment');
      }

      // UPSERT assignment
      console.log('Creating/updating assignment:', {
        user_id: userData.userId,
        meeting_id: selectedMeeting,
        template_id: templateId,
        template_type: templateType,
      });

      const assignmentResponse = await fetch(
        `/api/meeting-assignments?userId=${userData.userId}&meetingId=${selectedMeeting}&templateType=${templateType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userData.userId,
            meeting_id: selectedMeeting,
            template_id: templateId,
            template_type: templateType,
            delay_amount: delayAmount,
            delay_unit: delayUnit,
          }),
        }
      );

      if (!assignmentResponse.ok) {
        const errorText = await assignmentResponse.text();
        throw new Error(`Failed to save assignment: ${assignmentResponse.status} ${errorText}`);
      }

      console.log('Assignment saved successfully');

      // Refresh assignment and templates
      await fetchAssignment(selectedMeeting, userData.userId);
      templatesFetchedRef.current = false;
      await fetchTemplates();
      templatesFetchedRef.current = true;

      setSaveMessage('Template and assignment saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving:', error);
      setSaveError(error.message || 'Failed to save. Please try again.');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSendingPackage = async () => {
    if (!selectedMeeting || !userData?.userId || !getSelectedTemplateId()) {
      setSaveError('Please select a meeting and template first');
      return;
    }

    setIsCreatingPackage(true);
    setSaveError('');

    try {
      console.log('Looking for meeting:', selectedMeeting);
      console.log('Available meetings:', meetings);

      const meeting = meetings.find((m: any) => {
        const meetingId = m.id || m.uuid;
        return meetingId === selectedMeeting || meetingId?.toString() === selectedMeeting?.toString();
      });

      if (!meeting) {
        console.error('Meeting not found in meetings array', { selectedMeeting, meetings });
        throw new Error('Meeting not found. Please refresh and try again.');
      }

      console.log('Found meeting:', meeting);

      const meetingEndTime = calculateMeetingEndTime(meeting);
      const delayMinutes = calculateDelayMinutes(delayAmount, delayUnit);
      const recipientType = activeTab === 'attendees' ? 'attendees' : 'no_shows';
      const recordingUrlForPackage = recordingUrl || meeting.recording_url || null;
      const recipientList = getCurrentRegistrantsList().map((registrant: any) => ({
        ...registrant,
      }));

      const payload = {
        user_id: userData.userId,
        meeting_id: selectedMeeting,
        meeting_title: meeting.topic || '',
        recipient_type: recipientType,
        template_id: getSelectedTemplateId(),
        recording_url: recordingUrlForPackage,
        recipient_list: recipientList,
        meeting_end_time: meetingEndTime,
        delay_minutes: delayMinutes,
        send_status: 'pending',
      };

      const url = `/api/outreach-sending-jobs`;
      console.log('Creating sending package - URL:', url);
      console.log('Creating sending package - Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create sending package: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Sending package created:', result);
      setSaveMessage('Sending package created successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error creating sending package:', error);
      setSaveError(error.message || 'Failed to create sending package. Please try again.');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsCreatingPackage(false);
    }
  };

  const handleMeetingChange = (meetingId: string) => {
    setSelectedMeeting(meetingId);
  };

  const handleMeetingRefresh = () => {
    fetchMeetings();
    if (selectedMeeting && connections.length > 0) {
      fetchAssignment(selectedMeeting, userData?.userId || '');
      fetchRegistrants(selectedMeeting);
      fetchRecording(selectedMeeting);
    }
  };


  // Effects
  useEffect(() => {
    if (selectedMeeting && hasRequiredConnections) {
      const loadData = async () => {
        // Ensure templates are loaded first
        if (!templatesFetchedRef.current && userData?.userId && hasSubscription) {
          console.log('🟧 Calling fetchTemplates from selectedMeeting useEffect');
          await fetchTemplates();
          templatesFetchedRef.current = true;
        }
        
        // Fetch assignment
        await fetchAssignment(selectedMeeting, userData?.userId || '');
        
        // Fetch other data
        fetchRegistrants(selectedMeeting);
        fetchRecording(selectedMeeting);
      };
      
      loadData();
    } else if (!selectedMeeting) {
      setAssignment(null);
      clearTabState('attendees');
      clearTabState('noShows');
    }
  }, [selectedMeeting, hasRequiredConnections, userData?.userId, hasSubscription]);

  // Load template when assignment is found and templates are available
  useEffect(() => {
    const assignmentData = dashboardData.assignment;
    if (assignmentData && assignmentData.template_id && templates.length > 0) {
      const templateType = assignmentData.template_type;
      const tab = templateType === 'attendees' ? 'attendees' : 'noShows';
      setSelectedTemplateId(assignmentData.template_id, tab);
      
      const template = templates.find((t: any) => t.id === assignmentData.template_id);
      if (template) {
        loadTemplateForTab(template, tab);
      }
    }
  }, [dashboardData.assignment, templates]);

  // Load template content when tab changes (only if no content exists)
  useEffect(() => {
    if (userData?.userId && hasSubscription) {
      const selectedTemplateId =
        activeTab === 'attendees'
          ? templateEditor.attendeesSelectedTemplateId
          : templateEditor.noShowsSelectedTemplateId;

      if (selectedTemplateId) {
        const currentContent = getCurrentEmailContent();
        const hasContent = currentContent && currentContent.trim() !== '' && currentContent !== '<p><br></p>';

        if (!hasContent) {
          const template = templates.find((t: any) => t.id === selectedTemplateId);
          if (template) {
            loadTemplateForTab(template, activeTab);
          }
        }
      }
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu firstName={userData?.firstName || 'User'} userId={userData?.userId || ''} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Subscription Paywall */}
        {!hasSubscription && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Continue</h2>
                <p className="text-gray-600">Choose a plan to start automating your Zoom follow-ups</p>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 max-w-3xl mx-auto">
              {/* Monthly Plan */}
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$45</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automated Zoom follow-ups</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited meetings</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/00waEX3rd1xm7rVb7p3ZK04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Select Plan
                </a>
              </div>

              {/* Lifetime Plan */}
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$129</span>
                  <span className="text-gray-600"> one-time</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>All Monthly features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pay once, use forever</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No recurring charges</span>
                  </li>
                </ul>
                <a
                  href="https://buy.stripe.com/3cI8wPgdZdg44fJb7p3ZK03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Select Plan
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content (shown when subscribed) */}
        {hasSubscription && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Meeting Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-6 flex flex-col">
                <MeetingSelector
                  meetings={meetings}
                  selectedMeeting={selectedMeeting}
                  isLoading={isLoadingMeetings}
                  onMeetingChange={handleMeetingChange}
                  onRefresh={handleMeetingRefresh}
                />

                {meetings.length === 0 && !isLoadingMeetings && (
                  <p className="mt-4 text-sm text-gray-500">
                    No meetings found. Click refresh to load meetings from Zoom.
                  </p>
                )}
                {isLoadingMeetings && (
                  <p className="mt-4 text-sm text-blue-600 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading meetings...
                  </p>
                )}

                {/* Variable Chips */}
                {selectedMeeting && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Template Variables</h3>
                    <VariableButtons
                      variables={variables}
                      onVariableClick={handleVariableClick}
                      disabled={!selectedMeeting}
                    />
                    <p className="mt-2 text-xs text-gray-500">Click to insert into email</p>
                  </div>
                )}

                {/* Send Schedule */}
                {selectedMeeting && (
                  <div className="mt-auto pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Send Schedule</h3>
                    
                    {/* Delay Amount Box */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Delay Amount</label>
                      <input
                        type="number"
                        value={delayAmount}
                        onChange={(e) => setDelayAmount(parseInt(e.target.value) || 5)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                      />
                    </div>

                    {/* Delay Unit Box */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Time Unit</label>
                      <select
                        value={delayUnit}
                        onChange={(e) => setDelayUnit(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                      >
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                        <option value="days">days</option>
                      </select>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Send after meeting ends</p>

                    {/* Recording Link Delay Suggestion */}
                    {templateUsesRecordingLink() && getDelayInMinutes() < 30 && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800">
                          <strong>💡 Tip:</strong> Recording links typically become available 15-30 minutes after a
                          meeting ends.
                          {getDelayInMinutes() < 20 && (
                            <span className="block mt-1">
                              Consider increasing your delay to at least 20-30 minutes to ensure recording links are
                              included.
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {/* Create Sending Package Button */}
                    <button
                      onClick={handleCreateSendingPackage}
                      disabled={!selectedMeeting || !getSelectedTemplateId() || isCreatingPackage}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCreatingPackage && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isCreatingPackage ? 'Creating...' : 'Create Sending Package'}
                    </button>
                    {saveError && <p className="text-xs text-red-600 mt-2">{saveError}</p>}
                    {saveMessage && <p className="text-xs text-green-600 mt-2">{saveMessage}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Email Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('attendees')}
                      className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                        activeTab === 'attendees'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Attendees</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('noShows')}
                      className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                        activeTab === 'noShows'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <UserX className="w-4 h-4" />
                        <span>No Shows</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Template Name */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={getTemplateName()}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedMeeting}
                  />
                </div>

                {/* Template Selector */}
                <TemplateSelector
                  templates={templates}
                  selectedTemplateId={getSelectedTemplateId()}
                  onTemplateSelect={handleTemplateSelect}
                    disabled={!selectedMeeting}
                  />

                {/* Email Editor */}
                  {!selectedMeeting ? (
                  <div className="p-6">
                    <div className="min-h-[400px] p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                      Select a meeting to start editing
                    </div>
                    </div>
                  ) : (
                  <EmailEditor
                    ref={emailEditorRef}
                    subject={getEmailSubject()}
                    body={getCurrentEmailContent()}
                    onSubjectChange={setEmailSubject}
                    onBodyChange={(content) => {
                      const cleaned = stripColorStyles(content);
                      handleEditorChange(cleaned);
                    }}
                    disabled={!selectedMeeting}
                    keyValue={`${activeTab}-${getSelectedTemplateId()}`}
                  />
                )}

                {/* Save Button */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={handlePreviewClick}
                      disabled={!selectedMeeting}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!selectedMeeting || isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                  {saveMessage && <div className="text-sm text-green-600 mt-2">{saveMessage}</div>}
                  {saveError && <div className="text-sm text-red-600 mt-2">{saveError}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
                    setIsPreviewOpen(false);
                    setSelectedRegistrantForPreview(null);
                  }}
          subject={getPreviewSubject()}
          content={getPreviewContent()}
          registrants={allRegistrantsForPreview}
          selectedRegistrant={selectedRegistrantForPreview}
          onRegistrantSelect={handleRegistrantSelect}
        />
      </div>
    </div>
  );
}
