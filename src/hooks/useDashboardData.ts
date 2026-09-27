import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { extractApiErrorMessage, extractErrorsArrayMessage, getApiErrorPayload, getRegistrantStatusPayload, isRegistrationDisabledError } from '../utils/apiError';
import { apiFetch } from '../utils/apiFetch';
import { parseSubscription } from '../utils/stripe';

export function useDashboardData() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [cancelsAt, setCancelsAt] = useState<string | null>(null);
  const [hasRequiredConnections, setHasRequiredConnections] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [attendeesList, setAttendeesList] = useState<any[]>([]);
  const [noShowsList, setNoShowsList] = useState<any[]>([]);
  const [allRegistrantsForPreview, setAllRegistrantsForPreview] = useState<any[]>([]);
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false);
  const [registrantsError, setRegistrantsError] = useState<string>('');
  const [registrationDisabled, setRegistrationDisabled] = useState(false);
  const [meetingOccurred, setMeetingOccurred] = useState<boolean | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string>('');
  const [assignment, setAssignment] = useState<any>(null);
  const templatesFetchedRef = useRef(false);

  const checkConnections = async (userId: string): Promise<boolean> => {
    try {
      const response = await apiFetch(
        `/api/check-connection?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const connectionsList = Array.isArray(data) ? data : [data];
        setConnections(connectionsList);
        
        let zoomActive = false;
        let gmailActive = false;
        
        connectionsList.forEach((conn: any) => {
          zoomActive = zoomActive || (conn.provider === 'zoom' && conn.status === 'active');
          gmailActive = gmailActive || ((conn.provider === 'gmail' || conn.provider === 'google-mail') && conn.status === 'active');
        });
        
        const bothActive = zoomActive && gmailActive;
        setHasRequiredConnections(bothActive);
        return bothActive;
      }
      
      setHasRequiredConnections(false);
      return false;
    } catch (error) {
      console.error('Error checking connections:', error);
      setHasRequiredConnections(false);
      return false;
    }
  };

  const checkSubscription = async (userId: string) => {
    try {
      const response = await apiFetch(
        `/api/check-subscription?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const parsed = parseSubscription(data);
        setHasSubscription(parsed.hasSubscription);
        setCancelsAt(parsed.cancelsAt);
      } else {
        setHasSubscription(false);
        setCancelsAt(null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
      setCancelsAt(null);
    }
  };

  const fetchMeetings = async () => {
    if (!userData?.userId) return;

    const zoomConnection = connections.find((conn: any) => conn.provider === 'zoom' && conn.status === 'active');
    if (!zoomConnection?.nango_connection_id) {
      console.log('No active Zoom connection found');
      return;
    }

    setIsLoadingMeetings(true);
    try {
      const response = await apiFetch(
        `/api/zoom-meeting-list?userId=${userData.userId}&connectionId=${zoomConnection.nango_connection_id}&provider=${zoomConnection.provider}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const responseData = Array.isArray(data) ? data[0] : data;
        const meetingsList = responseData?.meetings || [];
        setMeetings(meetingsList);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const fetchTemplates = async () => {
    if (!userData?.userId) return;

    setIsLoadingTemplates(true);
    try {
      const response = await apiFetch(`/api/templates?userId=${userData.userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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

  const fetchRegistrants = async (selectedMeeting: string) => {
    if (!selectedMeeting || !userData?.userId) {
      setRegistrantsError('');
      setRegistrationDisabled(false);
      setMeetingOccurred(null);
      return;
    }

    const zoomConnection = connections.find((conn: any) => conn.provider === 'zoom' && conn.status === 'active');
    if (!zoomConnection?.nango_connection_id) {
      setAttendeesList([]);
      setNoShowsList([]);
      setAllRegistrantsForPreview([]);
      setRegistrantsError('');
      setRegistrationDisabled(false);
      setMeetingOccurred(null);
      return;
    }

    setIsLoadingRegistrants(true);
    setRegistrantsError('');
    setRegistrationDisabled(false);
    try {
      const query = `connectionId=${zoomConnection.nango_connection_id}&meetingId=${selectedMeeting}`;
      const guestsOnly = (person: any) => String(person?.role || '').toLowerCase() !== 'host';
      const toList = (value: unknown): any[] => (Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : []);

      const registrantsResponse = await apiFetch(`/api/zoom-meeting-registrant-status?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const registrantsData = await registrantsResponse.json();
      const registrantsPayload = getRegistrantStatusPayload(registrantsData);
      const registrantsErrorsMessage = extractErrorsArrayMessage(registrantsPayload?.errors);

      if (isRegistrationDisabledError(registrantsData, registrantsErrorsMessage)) {
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
        setMeetingOccurred(null);
        setRegistrationDisabled(true);
        setRegistrantsError('');
        return;
      }

      const registrantsStatus = registrantsPayload?.status;
      if (
        getApiErrorPayload(registrantsData) ||
        !registrantsResponse.ok ||
        (registrantsStatus && registrantsStatus !== 'ok') ||
        registrantsErrorsMessage
      ) {
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
        setMeetingOccurred(null);
        setRegistrantsError(
          extractApiErrorMessage(registrantsData, registrantsErrorsMessage || 'Failed to load registrants for this meeting.')
        );
        return;
      }

      const registrants = toList(registrantsPayload?.registrants).filter(guestsOnly);
      setAllRegistrantsForPreview(registrants);

      // A participants error means the meeting has not happened yet.
      const participantsResponse = await apiFetch(`/api/zoom-meeting-participant-status?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const participantsData = await participantsResponse.json();
      const participantsPayload = getRegistrantStatusPayload(participantsData);
      const participantsStatus = participantsPayload?.status;

      if (
        getApiErrorPayload(participantsData) ||
        !participantsResponse.ok ||
        (participantsStatus && participantsStatus !== 'ok') ||
        extractErrorsArrayMessage(participantsPayload?.errors)
      ) {
        setAttendeesList([]);
        setNoShowsList([]);
        setMeetingOccurred(false);
        return;
      }

      const attendees = toList(participantsPayload?.attendees).map((attendee: any) => {
        const nameParts = (attendee.name || '').trim().split(/\s+/);
        return {
          ...attendee,
          first_name: attendee.first_name || nameParts[0] || '',
          last_name: attendee.last_name || nameParts.slice(1).join(' ') || '',
        };
      });
      setAttendeesList(attendees.filter(guestsOnly));
      setMeetingOccurred(true);

      const noShowsResponse = await apiFetch(`/api/zoom-meeting-noshows?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const noShowsData = await noShowsResponse.json();
      const noShowsPayload = getRegistrantStatusPayload(noShowsData);

      if (getApiErrorPayload(noShowsData) || !noShowsResponse.ok) {
        setNoShowsList([]);
        setRegistrantsError(extractApiErrorMessage(noShowsData, 'Failed to load no-shows for this meeting.'));
        return;
      }

      setNoShowsList(toList(noShowsPayload?.no_shows).filter(guestsOnly));
    } catch (error) {
      console.error('Error fetching registrant status:', error);
      setAttendeesList([]);
      setNoShowsList([]);
      setAllRegistrantsForPreview([]);
      setMeetingOccurred(null);
      setRegistrantsError('Failed to load registrants for this meeting.');
    } finally {
      setIsLoadingRegistrants(false);
    }
  };

  const fetchRecording = async (selectedMeeting: string) => {
    if (!selectedMeeting) {
      setRecordingUrl('');
      return;
    }

    try {
      const response = await apiFetch(
        `/api/zoom-meeting-recordings?meetingId=${selectedMeeting}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        let recordings: any[] = [];
        if (Array.isArray(data)) {
          recordings = data;
        } else if (data?.recordings && Array.isArray(data.recordings)) {
          recordings = data.recordings;
        } else if (data && !Array.isArray(data) && typeof data === 'object') {
          recordings = [data];
        }
        
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
            const url = mostRecent.play_url || mostRecent.download_url || mostRecent.share_url || mostRecent.recording_url || '';
            setRecordingUrl(url);
          } else {
            setRecordingUrl('');
          }
        } else {
          setRecordingUrl('');
        }
      } else {
        setRecordingUrl('');
      }
    } catch (error) {
      console.error('Error fetching recording:', error);
      setRecordingUrl('');
    }
  };

  const fetchAssignment = async (selectedMeeting: string, userId: string) => {
    if (!selectedMeeting || !userId) return null;

    try {
      const response = await apiFetch(
        `/api/meeting-assignments/${selectedMeeting}?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rows = Array.isArray(data) ? data : data ? [data] : [];
        const withTemplate = rows.filter((row: any) => row?.template_id);
        if (withTemplate.length > 0) {
          const assignmentData = withTemplate.length === 1 ? withTemplate[0] : withTemplate;
          setAssignment(assignmentData);
          return assignmentData;
        }
        setAssignment(null);
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return null;
    }
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate('/login');
      return;
    }

    const firstName = session.user.user_metadata?.first_name || 
                     JSON.parse(localStorage.getItem('user') || '{}').firstName || 
                     'there';
    
    setUserData({
      firstName,
      lastName: session.user.user_metadata?.last_name || '',
      email: session.user.email,
      userId: session.user.id,
    });

    const connectionsValid = await checkConnections(session.user.id);
    if (!connectionsValid) {
      navigate('/onboarding');
      return;
    }

    await checkSubscription(session.user.id);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userData?.userId && hasSubscription && hasRequiredConnections) {
      fetchMeetings();
      if (!templatesFetchedRef.current) {
        fetchTemplates();
        templatesFetchedRef.current = true;
      }
    }
  }, [userData?.userId, hasSubscription, hasRequiredConnections]);

  return {
    userData,
    isLoading,
    hasSubscription,
    cancelsAt,
    hasRequiredConnections,
    connections,
    meetings,
    isLoadingMeetings,
    templates,
    isLoadingTemplates,
    attendeesList,
    noShowsList,
    allRegistrantsForPreview,
    isLoadingRegistrants,
    registrantsError,
    registrationDisabled,
    meetingOccurred,
    recordingUrl,
    assignment,
    templatesFetchedRef,
    fetchMeetings,
    fetchTemplates,
    fetchRegistrants,
    fetchRecording,
    fetchAssignment,
    setAssignment,
    setTemplates,
  };
}
