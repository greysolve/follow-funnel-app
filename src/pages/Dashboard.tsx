import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, CreditCard, CheckCircle, Loader2, Users, UserX, RefreshCw, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserMenu from '../components/UserMenu';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'attendees' | 'noShows'>('attendees');
  const [attendeesEmail, setAttendeesEmail] = useState<string>('');
  const [noShowsEmail, setNoShowsEmail] = useState<string>('');
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [attendeesSelectedTemplateId, setAttendeesSelectedTemplateId] = useState<string>('');
  const [noShowsSelectedTemplateId, setNoShowsSelectedTemplateId] = useState<string>('');
  const [attendeesCurrentTemplate, setAttendeesCurrentTemplate] = useState<any>(null);
  const [noShowsCurrentTemplate, setNoShowsCurrentTemplate] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [_isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attendeesEmailSubject, setAttendeesEmailSubject] = useState<string>('');
  const [noShowsEmailSubject, setNoShowsEmailSubject] = useState<string>('');
  const [attendeesTemplateName, setAttendeesTemplateName] = useState<string>('');
  const [noShowsTemplateName, setNoShowsTemplateName] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [attendeesList, setAttendeesList] = useState<any[]>([]);
  const [noShowsList, setNoShowsList] = useState<any[]>([]);
  const [allRegistrantsForPreview, setAllRegistrantsForPreview] = useState<any[]>([]);
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRegistrantForPreview, setSelectedRegistrantForPreview] = useState<any>(null);
  const [delayAmount, setDelayAmount] = useState<number>(5);
  const [delayUnit, setDelayUnit] = useState<string>('minutes');
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string>('');
  const quillRef = useRef<any>(null);

  // Variable definitions
  const variables = [
    { label: '{{First Name}}', value: '{{first_name}}' },
    { label: '{{Last Name}}', value: '{{last_name}}' },
    { label: '{{Email}}', value: '{{email}}' },
    { label: '{{Company}}', value: '{{org}}' },
    { label: '{{Job Title}}', value: '{{job_title}}' },
    { label: '{{City}}', value: '{{city}}' },
    { label: '{{Country}}', value: '{{country}}' },
    { label: '{{Recording Link}}', value: '{{recording_link}}' },
    { label: '{{Meeting Title}}', value: '{{meeting_title}}' },
  ];

  // Helper function to get the current list based on active tab
  const getCurrentRegistrantsList = (): any[] => {
    return activeTab === 'attendees' ? attendeesList : noShowsList;
  };

  // Helper functions to get/set tab-specific template state
  const getSelectedTemplateId = (): string => {
    return activeTab === 'attendees' ? attendeesSelectedTemplateId : noShowsSelectedTemplateId;
  };

  const setSelectedTemplateId = (value: string) => {
    if (activeTab === 'attendees') {
      setAttendeesSelectedTemplateId(value);
    } else {
      setNoShowsSelectedTemplateId(value);
    }
  };

  const getCurrentTemplate = (): any => {
    return activeTab === 'attendees' ? attendeesCurrentTemplate : noShowsCurrentTemplate;
  };

  const setCurrentTemplate = (value: any) => {
    if (activeTab === 'attendees') {
      setAttendeesCurrentTemplate(value);
    } else {
      setNoShowsCurrentTemplate(value);
    }
  };

  const getEmailSubject = (): string => {
    return activeTab === 'attendees' ? attendeesEmailSubject : noShowsEmailSubject;
  };

  const setEmailSubject = (value: string) => {
    if (activeTab === 'attendees') {
      setAttendeesEmailSubject(value);
    } else {
      setNoShowsEmailSubject(value);
    }
  };

  const getTemplateName = (): string => {
    return activeTab === 'attendees' ? attendeesTemplateName : noShowsTemplateName;
  };

  const setTemplateName = (value: string) => {
    if (activeTab === 'attendees') {
      setAttendeesTemplateName(value);
    } else {
      setNoShowsTemplateName(value);
    }
  };

  const handleVariableDragStart = (e: React.DragEvent, variable: string) => {
    e.dataTransfer.setData('text/plain', variable);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleEditorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const variable = e.dataTransfer.getData('text/plain');
    if (variable && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertText(range.index, variable, 'user');
      quill.setSelection(range.index + variable.length);
    }
  };

  const handleVariableClick = (variable: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertText(range.index, variable, 'user');
      quill.setSelection(range.index + variable.length);
    }
  };

  const stripColorStyles = (html: string): string => {
    // Remove color and background-color styles from HTML
    // This ensures saved emails don't have unwanted color styling
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allElements = doc.querySelectorAll('*');
    
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.color = '';
        el.style.backgroundColor = '';
        // Remove color from style attribute if it exists
        if (el.getAttribute('style')) {
          const style = el.getAttribute('style') || '';
          const newStyle = style
            .split(';')
            .filter((s) => !s.trim().startsWith('color') && !s.trim().startsWith('background-color'))
            .join(';');
          if (newStyle.trim()) {
            el.setAttribute('style', newStyle);
          } else {
            el.removeAttribute('style');
          }
        }
      }
    });
    
    return doc.body.innerHTML;
  };

  const substituteVariables = (content: string, registrant: any, meetingTopic?: string): string => {
    if (!registrant) return content;
    
    // Get the selected meeting to access meeting topic
    const meeting = meetings.find((m: any) => {
      const meetingId = m.id || m.uuid;
      return meetingId === selectedMeeting || meetingId?.toString() === selectedMeeting?.toString();
    });
    const topic = meetingTopic || meeting?.topic || '';
    const recordingLink = recordingUrl || meeting?.recording_url || '';
    
    // Map of variable placeholders to registrant fields or meeting data
    const variableMap: { [key: string]: { field?: string, label: string, value?: string } } = {
      '{{first_name}}': { field: 'first_name', label: 'first_name' },
      '{{last_name}}': { field: 'last_name', label: 'last_name' },
      '{{email}}': { field: 'email', label: 'email' },
      '{{org}}': { field: 'org', label: 'org' },
      '{{job_title}}': { field: 'job_title', label: 'job_title' },
      '{{city}}': { field: 'city', label: 'city' },
      '{{country}}': { field: 'country', label: 'country' },
      '{{recording_link}}': { label: 'recording_link', value: recordingLink },
      '{{meeting_title}}': { label: 'meeting_title', value: topic },
    };

    let substitutedContent = content;
    Object.keys(variableMap).forEach((key) => {
      const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
      let value: string | undefined;
      
      if (variableMap[key].value !== undefined) {
        // Meeting-specific variable
        value = variableMap[key].value;
      } else if (variableMap[key].field) {
        // Registrant field
        value = registrant[variableMap[key].field!];
      }
      
      if (value && value.trim() !== '') {
        // Value exists, substitute it
        substitutedContent = substitutedContent.replace(regex, value);
      } else {
        // Value is missing, show red placeholder
        const missingPlaceholder = `<span style="color: red; font-weight: bold;">{{${variableMap[key].label}_missing}}</span>`;
        substitutedContent = substitutedContent.replace(regex, missingPlaceholder);
      }
    });

    return substitutedContent;
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
    return substituteVariables(currentContent, selectedRegistrantForPreview);
  };

  const getPreviewSubject = (): string => {
    if (!selectedRegistrantForPreview) return getEmailSubject();
    return substituteVariables(getEmailSubject(), selectedRegistrantForPreview);
  };

  const calculateDelayMinutes = (amount: number, unit: string): number => {
    switch (unit) {
      case 'hours':
        return amount * 60;
      case 'days':
        return amount * 24 * 60;
      case 'minutes':
      default:
        return amount;
    }
  };

  const calculateMeetingEndTime = (meeting: any): string => {
    if (!meeting.start_time || !meeting.duration) {
      throw new Error('Meeting missing start_time or duration');
    }
    const startTime = new Date(meeting.start_time);
    const durationMinutes = meeting.duration;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    
    // Convert to meeting's timezone if provided, otherwise use UTC
    if (meeting.timezone) {
      // Format as YYYY-MM-DD HH:mm:ss in the meeting's timezone
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: meeting.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(endTime);
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      const hour = parts.find(p => p.type === 'hour')?.value;
      const minute = parts.find(p => p.type === 'minute')?.value;
      const second = parts.find(p => p.type === 'second')?.value;
      
      // Calculate timezone offset for the meeting timezone at this specific date/time
      // Create a formatter to get the offset
      const tzFormatter = new Intl.DateTimeFormat('en', {
        timeZone: meeting.timezone,
        timeZoneName: 'longOffset',
      });
      
      // Get offset string (e.g., "GMT-08:00")
      const tzOffset = tzFormatter.formatToParts(endTime).find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
      
      // Extract offset from format like "GMT-08:00" or "GMT+05:30"
      const offsetMatch = tzOffset.match(/GMT([+-])(\d{1,2}):(\d{2})/);
      if (offsetMatch) {
        const offsetStr = `${offsetMatch[1]}${offsetMatch[2].padStart(2, '0')}:${offsetMatch[3]}`;
        return `${year}-${month}-${day} ${hour}:${minute}:${second}${offsetStr}`;
      }
      
      // Fallback if offset parsing fails
      return `${year}-${month}-${day} ${hour}:${minute}:${second}+00:00`;
    }
    
    // Fallback to UTC ISO string if no timezone
    return endTime.toISOString();
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
      
      // Find the selected meeting object
      const meeting = meetings.find((m: any) => {
        const meetingId = m.id || m.uuid;
        return meetingId === selectedMeeting || meetingId?.toString() === selectedMeeting?.toString();
      });
      
      if (!meeting) {
        console.error('Meeting not found in meetings array', { selectedMeeting, meetings });
        throw new Error('Meeting not found. Please refresh and try again.');
      }
      
      console.log('Found meeting:', meeting);

      // Calculate meeting end time
      const meetingEndTime = calculateMeetingEndTime(meeting);

      // Calculate delay in minutes
      const delayMinutes = calculateDelayMinutes(delayAmount, delayUnit);

      // Determine recipient type from active tab
      const recipientType = activeTab === 'attendees' ? 'attendees' : 'no_shows';

      // Get recording URL if available (from state or meeting data)
      const recordingUrlForPackage = recordingUrl || meeting.recording_url || null;

      // Include all registrant fields in recipient_list for maximum flexibility
      // This allows the backend to use any variables from the template without
      // needing to regenerate the recipient_list if the template changes
      // Send data as-is - no default values to preserve user's ability to see missing data
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

      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userData?.userId && hasSubscription && connections.length > 0) {
      fetchMeetings();
      fetchTemplates();
    }
  }, [userData?.userId, hasSubscription, connections]);

  useEffect(() => {
    if (selectedMeeting && connections.length > 0) {
      fetchAssignment();
      fetchRegistrants();
      fetchRecording();
    } else if (!selectedMeeting) {
      setAssignment(null);
      setAttendeesSelectedTemplateId('');
      setNoShowsSelectedTemplateId('');
      setAttendeesCurrentTemplate(null);
      setNoShowsCurrentTemplate(null);
      setAttendeesTemplateName('');
      setNoShowsTemplateName('');
      setAttendeesEmailSubject('');
      setNoShowsEmailSubject('');
      setAttendeesEmail('');
      setNoShowsEmail('');
      setAttendeesList([]);
      setNoShowsList([]);
      setAllRegistrantsForPreview([]);
      setRecordingUrl('');
    }
  }, [selectedMeeting, connections]);

  const checkAuth = async () => {
    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Not logged in - redirect to login
      navigate('/login');
      return;
    }

    // Get user data
    const firstName = session.user.user_metadata?.first_name || 
                     JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                     'there';
    
    setUserData({
      firstName,
      lastName: session.user.user_metadata?.last_name || '',
      email: session.user.email,
      userId: session.user.id,
    });

    // Check connections first - both required
    const connectionsValid = await checkConnections(session.user.id);
    if (!connectionsValid) {
      // Missing connections - redirect to onboarding
      navigate('/onboarding');
      return;
    }

    // Check subscription status
    await checkSubscription(session.user.id);
    setIsLoading(false);
  };

  const checkConnections = async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/check-connection?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Normalize to array
        const connectionsList = Array.isArray(data) ? data : [data];
        
        // Store connections for later use
        setConnections(connectionsList);
        
        // Initialize both as false
        let zoomActive = false;
        let gmailActive = false;
        
        // Loop through connections and set state based on what we find
        connectionsList.forEach((conn: any) => {
          zoomActive = zoomActive || (conn.provider === 'zoom' && conn.status === 'active');
          gmailActive = gmailActive || ((conn.provider === 'gmail' || conn.provider === 'google-mail') && conn.status === 'active');
        });
        
        return zoomActive && gmailActive;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking connections:', error);
      return false;
    }
  };

  const checkSubscription = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/check-subscription?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // API can return either a single object or an array
        if (Array.isArray(data)) {
          const hasActiveSubscription = data.length > 0 && data.some(
            (sub: any) => sub.subscription_status === 'active'
          );
          setHasSubscription(hasActiveSubscription);
        } else if (data && typeof data === 'object') {
          const hasActiveSubscription = data.subscription_status === 'active';
          setHasSubscription(hasActiveSubscription);
        } else {
          setHasSubscription(false);
        }
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
    }
  };

  const fetchMeetings = async () => {
    if (!userData?.userId) return;

    // Get Zoom connection ID from stored connections
    const zoomConnection = connections.find((conn: any) => conn.provider === 'zoom' && conn.status === 'active');
    if (!zoomConnection?.nango_connection_id) {
      console.log('No active Zoom connection found');
      return;
    }

    setIsLoadingMeetings(true);
    try {
      const response = await fetch(
        `/api/zoom-meeting-list?userId=${userData.userId}&connectionId=${zoomConnection.nango_connection_id}&provider=${zoomConnection.provider}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Meetings API response:', data);
        // API returns array with object containing meetings: [{ meetings: [...], page_size, ... }]
        const responseData = Array.isArray(data) ? data[0] : data;
        const meetingsList = responseData?.meetings || [];
        console.log('Extracted meetings list:', meetingsList);
        setMeetings(meetingsList);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const handleDropdownClick = () => {
    // If meetings list is empty, fetch them
    if (meetings.length === 0) {
      fetchMeetings();
    }
  };

  const fetchTemplates = async () => {
    if (!userData?.userId) return;

    setIsLoadingTemplates(true);
    try {
      // Get template_type based on active tab (attendees or no_shows)
      const templateType = activeTab === 'attendees' ? 'attendees' : 'no_shows';
      const response = await fetch(
        `/api/templates?userId=${userData.userId}&template_type=${templateType}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const templatesList = Array.isArray(data) ? data : (data ? [data] : []);
        setTemplates(templatesList);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const fetchAssignment = async () => {
    if (!selectedMeeting || !userData?.userId) return;

    try {
      const response = await fetch(
        `/api/meeting-assignments/${selectedMeeting}?userId=${userData.userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.template_id) {
          setAssignment(data);
          // Load template and set it for the correct tab based on template_type
          const templateType = data.template_type;
          if (templateType === 'attendees') {
            setAttendeesSelectedTemplateId(data.template_id);
            // Load template content for attendees tab
            loadTemplateForTab(data.template_id, 'attendees');
          } else if (templateType === 'no_shows') {
            setNoShowsSelectedTemplateId(data.template_id);
            // Load template content for no_shows tab
            loadTemplateForTab(data.template_id, 'noShows');
          } else {
            // Fallback: set for current tab
            setSelectedTemplateId(data.template_id);
            loadTemplate(data.template_id);
          }
        } else {
          setAssignment(null);
          // Don't clear tab-specific state - just leave it as is
        }
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  };

  const fetchRegistrants = async () => {
    console.log('fetchRegistrants called', { selectedMeeting, userId: userData?.userId, connectionsLength: connections.length });
    
    if (!selectedMeeting || !userData?.userId) {
      console.log('Early return: missing selectedMeeting or userId');
      return;
    }

    // Get Zoom connection ID from stored connections
    const zoomConnection = connections.find((conn: any) => conn.provider === 'zoom' && conn.status === 'active');
    console.log('Zoom connection found:', zoomConnection);
    
    if (!zoomConnection?.nango_connection_id) {
      console.log('No active Zoom connection found - early return');
      setAttendeesList([]);
      setNoShowsList([]);
      setAllRegistrantsForPreview([]);
      return;
    }

    console.log('Making API call to fetch registrant status...');
    setIsLoadingRegistrants(true);
    try {
      const response = await fetch(
        `/api/zoom-meeting-registrant-status?connectionId=${zoomConnection.nango_connection_id}&meetingId=${selectedMeeting}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Registrant status API response:', data);
        
        // Parse the new response format: [{ attendees: [], no_shows: [] }]
        let attendees: any[] = [];
        let noShows: any[] = [];
        
        if (Array.isArray(data) && data.length > 0) {
          const responseData = data[0];
          
          // Extract attendees list
          if (responseData?.attendees && Array.isArray(responseData.attendees)) {
            // Normalize attendees: split 'name' into first_name/last_name for consistency
            attendees = responseData.attendees.map((attendee: any) => {
              const nameParts = (attendee.name || '').trim().split(/\s+/);
              return {
                ...attendee,
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || '',
              };
            });
          }
          
          // Extract no_shows list
          if (responseData?.no_shows && Array.isArray(responseData.no_shows)) {
            noShows = responseData.no_shows;
          }
        }
        
        // Combine attendees and no_shows for preview
        const allRegistrants = [...attendees, ...noShows];
        
        console.log('Parsed attendees list:', attendees);
        console.log('Parsed no_shows list:', noShows);
        console.log('Parsed all registrants list (for preview):', allRegistrants);
        
        if (attendees.length > 0) {
          console.log('First attendee structure:', attendees[0]);
          console.log('Available attendee fields:', Object.keys(attendees[0]));
        }
        if (noShows.length > 0) {
          console.log('First no-show structure:', noShows[0]);
          console.log('Available no-show fields:', Object.keys(noShows[0]));
        }
        
        setAttendeesList(attendees);
        setNoShowsList(noShows);
        setAllRegistrantsForPreview(allRegistrants);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch registrant status:', response.status, errorText);
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
      }
    } catch (error) {
      console.error('Error fetching registrant status:', error);
      setAttendeesList([]);
      setNoShowsList([]);
      setAllRegistrantsForPreview([]);
    } finally {
      setIsLoadingRegistrants(false);
    }
  };

  const fetchRecording = async () => {
    if (!selectedMeeting) {
      setRecordingUrl('');
      return;
    }

    try {
      const response = await fetch(
        `/api/zoom-meeting-recordings?meetingId=${selectedMeeting}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Recording API response:', data);
        
        // Handle different response formats
        let recordings: any[] = [];
        if (Array.isArray(data)) {
          recordings = data;
        } else if (data?.recordings && Array.isArray(data.recordings)) {
          recordings = data.recordings;
        } else if (data && !Array.isArray(data) && typeof data === 'object') {
          recordings = [data];
        }
        
        // Get most recent recording (sorted by created_at or recording_start_time)
        if (recordings.length > 0) {
          const sortedRecordings = [...recordings].sort((a: any, b: any) => {
            try {
              const dateA = new Date(a.created_at || a.recording_start_time || 0);
              const dateB = new Date(b.created_at || b.recording_start_time || 0);
              return dateB.getTime() - dateA.getTime();
            } catch (e) {
              return 0;
            }
          });
          
          const mostRecent = sortedRecordings[0];
          if (mostRecent) {
            // Use play_url, download_url, or share_url (depending on API response format)
            const url = mostRecent.play_url || mostRecent.download_url || mostRecent.share_url || mostRecent.recording_url || '';
            setRecordingUrl(url);
            console.log('Set recording URL:', url);
          } else {
            setRecordingUrl('');
          }
        } else {
          setRecordingUrl('');
        }
      } else {
        // No recording found or error - set empty
        setRecordingUrl('');
      }
    } catch (error) {
      console.error('Error fetching recording:', error);
      setRecordingUrl('');
    }
  };

  const loadTemplateForTab = async (templateId: string, tab: 'attendees' | 'noShows') => {
    if (!userData?.userId) return;

    try {
      const response = await fetch(
        `/api/templates?userId=${userData.userId}&templateId=${templateId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle array response (consistent with fetchTemplates pattern)
        const template = Array.isArray(data) ? data[0] : data;
        console.log('Template from API:', template);

console.log('Template body:', template.body);
        
        if (template) {
          if (tab === 'attendees') {
            setAttendeesCurrentTemplate(template);
            setAttendeesTemplateName(template.name || '');
            setAttendeesEmailSubject(template.subject || '');
            setAttendeesEmail(template.body || '');
          } else {
            setNoShowsCurrentTemplate(template);
            setNoShowsTemplateName(template.name || '');
            setNoShowsEmailSubject(template.subject || '');
            setNoShowsEmail(template.body || '');
          }
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const loadTemplate = async (templateId: string) => {
    if (!userData?.userId) return;

    try {
      const response = await fetch(
        `/api/templates?userId=${userData.userId}&templateId=${templateId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle array response (consistent with fetchTemplates pattern)
        const template = Array.isArray(data) ? data[0] : data;
        
        if (template) {
          setCurrentTemplate(template);
          setTemplateName(template.name || '');
          setEmailSubject(template.subject || '');
          if (activeTab === 'attendees') {
            setAttendeesEmail(template.body || '');
          } else {
            setNoShowsEmail(template.body || '');
          }
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId) {
      // Always fetch from API when user explicitly selects a template
      // This ensures we get the latest saved content
      loadTemplateForTab(templateId, activeTab === 'attendees' ? 'attendees' : 'noShows');
    } else {
      setCurrentTemplate(null);
      setTemplateName('');
      setEmailSubject('');
      if (activeTab === 'attendees') {
        setAttendeesEmail('');
      } else {
        setNoShowsEmail('');
      }
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
      const emailBody = activeTab === 'attendees' ? attendeesEmail : noShowsEmail;
      const currentSubject = getEmailSubject();
      const currentName = getTemplateName();
      const currentTemplateData = getCurrentTemplate();

      console.log('Saving template:', { selectedTemplateId: templateId, templateType, hasSubject: !!currentSubject, hasBody: !!emailBody });

      // If template ID exists, update it (don't require currentTemplateData - we have the ID)
      if (templateId) {
        const updatedTemplate = {
          user_id: userData.userId,
          template_type: templateType,
          subject: currentSubject,
          body: emailBody,
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
          body: emailBody,
          name: currentName,
        };

        console.log('Creating new template:', newTemplate);

        const createResponse = await fetch(
          `/api/templates`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTemplate),
          }
        );

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create template: ${createResponse.status} ${errorText}`);
        }

        const createdTemplate = await createResponse.json();
        console.log('Template created:', createdTemplate);
        
        // Handle array response (consistent with fetchTemplates pattern)
        const template = Array.isArray(createdTemplate) ? createdTemplate[0] : createdTemplate;
        
        if (!template || !template.id) {
          throw new Error('Template created but no ID returned from server. Response: ' + JSON.stringify(createdTemplate));
        }
        
        templateId = template.id;
        setSelectedTemplateId(templateId);
        setCurrentTemplate(template);
      }

      // Validate templateId exists before saving assignment
      if (!templateId) {
        throw new Error('Template ID is required to save assignment');
      }

      // UPSERT assignment
      console.log('Creating/updating assignment:', { user_id: userData.userId, meeting_id: selectedMeeting, template_id: templateId, template_type: templateType });

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
      await fetchAssignment();
      await fetchTemplates();

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

  const getCurrentEmailContent = () => {
    return activeTab === 'attendees' ? attendeesEmail : noShowsEmail;
  };

  const templateUsesRecordingLink = (): boolean => {
    const currentContent = getCurrentEmailContent();
    const currentSubject = getEmailSubject();
    return currentContent.includes('{{recording_link}}') || currentSubject.includes('{{recording_link}}');
  };

  const getDelayInMinutes = (): number => {
    return calculateDelayMinutes(delayAmount, delayUnit);
  };

  // Refetch templates when tab changes
  // Load template content only if there's no current content (preserves unsaved edits)
  useEffect(() => {
    if (userData?.userId && hasSubscription) {
      fetchTemplates();
      
      // Load the selected template for the current tab if one exists
      const selectedTemplateId = activeTab === 'attendees' 
        ? attendeesSelectedTemplateId 
        : noShowsSelectedTemplateId;
      
      if (selectedTemplateId) {
        // Check if there's existing content in state for this tab
        const currentContent = activeTab === 'attendees' ? attendeesEmail : noShowsEmail;
        const hasContent = currentContent && currentContent.trim() !== '' && currentContent !== '<p><br></p>';
        
        // Only load from API if there's no current content (preserve unsaved edits)
        if (!hasContent) {
          loadTemplateForTab(selectedTemplateId, activeTab === 'attendees' ? 'attendees' : 'noShows');
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
            <UserMenu 
              firstName={userData?.firstName || 'User'} 
              userId={userData?.userId || ''} 
            />
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscribe to Continue
                </h2>
                <p className="text-gray-600">
                  Choose a plan to start automating your Zoom follow-ups
                </p>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Select Meeting</h2>
                  <button
                    onClick={() => {
                      fetchMeetings();
                      if (selectedMeeting && connections.length > 0) {
                        fetchAssignment();
                        fetchRegistrants();
                        fetchRecording();
                      }
                    }}
                    disabled={isLoadingMeetings}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                    title="Refresh meetings"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoadingMeetings ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <select
                  value={selectedMeeting}
                  onChange={(e) => setSelectedMeeting(e.target.value)}
                  onClick={handleDropdownClick}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a meeting...</option>
                  {meetings.map((meeting: any) => {
                    console.log('Rendering meeting option:', meeting);
                    return (
                      <option key={meeting.id || meeting.uuid} value={meeting.id || meeting.uuid}>
                        {meeting.topic || 'Untitled Meeting'}
                      </option>
                    );
                  })}
                </select>
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
                    <div className="flex flex-wrap gap-2">
                      {variables.map((variable) => (
                        <div
                          key={variable.value}
                          draggable
                          onDragStart={(e) => handleVariableDragStart(e, variable.value)}
                          onClick={() => handleVariableClick(variable.value)}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-sm font-mono text-blue-700 cursor-move hover:bg-blue-100 hover:border-blue-300 transition select-none"
                          title="Drag to editor or click to insert"
                        >
                          {variable.label}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Drag and drop or click to insert into email
                    </p>
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
                          <strong>💡 Tip:</strong> Recording links typically become available 15-30 minutes after a meeting ends. 
                          {getDelayInMinutes() < 20 && (
                            <span className="block mt-1">Consider increasing your delay to at least 20-30 minutes to ensure recording links are included.</span>
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
                    {saveError && (
                      <p className="text-xs text-red-600 mt-2">{saveError}</p>
                    )}
                    {saveMessage && (
                      <p className="text-xs text-green-600 mt-2">{saveMessage}</p>
                    )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
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
                <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={getSelectedTemplateId()}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedMeeting}
                  >
                    <option value="">
                      {assignment ? 'Select template...' : 'Select template...'}
                    </option>
                    {templates.map((template: any) => (
                      <option key={template.id} value={template.id}>
                        {template.name || `Template ${template.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Subject */}
                <div className="px-6 pt-4 pb-2 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={getEmailSubject()}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedMeeting}
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="p-6">
                  {!selectedMeeting ? (
                    <div className="min-h-[400px] p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                      Select a meeting to start editing
                    </div>
                  ) : (
                    <div onDrop={handleEditorDrop} onDragOver={(e) => e.preventDefault()}>
                      <ReactQuill
                        key={activeTab}
                        ref={quillRef}
                        theme="snow"
                        value={getCurrentEmailContent()}
                        onChange={(content) => {
                          // Strip color styles before saving
                          const cleanedContent = stripColorStyles(content);
                          if (activeTab === 'attendees') {
                            setAttendeesEmail(cleanedContent);
                          } else {
                            setNoShowsEmail(cleanedContent);
                          }
                        }}
                        className="min-h-[400px] [&_.ql-editor]:text-black [&_.ql-editor]:text-lg"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                          ],
                          clipboard: {
                            // Explicitly enable clipboard module for paste functionality
                            matchVisual: false
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

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
                  {saveMessage && (
                    <div className="text-sm text-green-600 mt-2">{saveMessage}</div>
                  )}
                  {saveError && (
                    <div className="text-sm text-red-600 mt-2">{saveError}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Email Preview</h2>
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setSelectedRegistrantForPreview(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Registrant Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Registrant
                  </label>
                  {isLoadingRegistrants ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading registrants...
                    </div>
                  ) : (
                    <select
                      value={selectedRegistrantForPreview?.id || ''}
                      onChange={(e) => {
                        const registrant = allRegistrantsForPreview.find((r: any) => r.id === e.target.value);
                        handleRegistrantSelect(registrant);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={allRegistrantsForPreview.length === 0}
                    >
                      <option value="">
                        {allRegistrantsForPreview.length === 0 ? 'No registrants found' : 'Choose a registrant...'}
                      </option>
                      {allRegistrantsForPreview.map((registrant: any) => (
                        <option key={registrant.id} value={registrant.id}>
                          {registrant.first_name} {registrant.last_name} ({registrant.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Preview Content */}
                {selectedRegistrantForPreview && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                      <div 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: getPreviewSubject() || '<span class="text-gray-400">No subject</span>' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body:</label>
                      <div
                        className="px-4 py-4 bg-white border border-gray-300 rounded-lg min-h-[300px] prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: getPreviewContent() || '<span class="text-gray-400">No content</span>' }}
                      />
                    </div>
                  </div>
                )}

                {!selectedRegistrantForPreview && (
                  <div className="text-center py-12 text-gray-500">
                    Select a registrant to preview the email
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
