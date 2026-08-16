import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { extractApiErrorMessage, extractErrorsArrayMessage, getApiErrorPayload, getRegistrantStatusPayload, isRegistrationDisabledError } from '../utils/apiError';

export function useDashboardData() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
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
      const response = await fetch(
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
      const response = await fetch(
        `/api/check-subscription?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
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
      const response = await fetch(`/api/templates?userId=${userData.userId}`, {
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
      const response = await fetch(
        `/api/zoom-meeting-registrant-status?connectionId=${zoomConnection.nango_connection_id}&meetingId=${selectedMeeting}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();
      const responseData = getRegistrantStatusPayload(data);
      const errorsMessage = extractErrorsArrayMessage(responseData?.errors);
      const isExplicitError = Boolean(getApiErrorPayload(data));
      const status = responseData?.status;

      if (isExplicitError) {
        const message = extractApiErrorMessage(data, 'Failed to load registrants for this meeting.');
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
        setMeetingOccurred(null);
        setRegistrationDisabled(isRegistrationDisabledError(data, message));
        setRegistrantsError(message);
        return;
      }

      if (status === 'meeting_not_held') {
        const message = errorsMessage || 'Could not load participants for this meeting.';
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
        setMeetingOccurred(false);
        setRegistrationDisabled(isRegistrationDisabledError(data, message));
        setRegistrantsError(message);
        return;
      }

      if ((status && status !== 'ok') || !response.ok) {
        const message = extractApiErrorMessage(data, errorsMessage || 'Failed to load registrants for this meeting.');
        setAttendeesList([]);
        setNoShowsList([]);
        setAllRegistrantsForPreview([]);
        setMeetingOccurred(typeof responseData?.meeting_occurred === 'boolean' ? responseData.meeting_occurred : null);
        setRegistrationDisabled(isRegistrationDisabledError(data, message));
        setRegistrantsError(message);
        return;
      }

      let attendees: any[] = [];
      let noShows: any[] = [];

      if (responseData?.attendees && Array.isArray(responseData.attendees)) {
        attendees = responseData.attendees.map((attendee: any) => {
          const nameParts = (attendee.name || '').trim().split(/\s+/);
          return {
            ...attendee,
            first_name: attendee.first_name || nameParts[0] || '',
            last_name: attendee.last_name || nameParts.slice(1).join(' ') || '',
          };
        });
      }

      if (responseData?.no_shows && Array.isArray(responseData.no_shows)) {
        noShows = responseData.no_shows;
      }

      const guestsOnly = (person: any) => String(person?.role || '').toLowerCase() !== 'host';
      setMeetingOccurred(typeof responseData?.meeting_occurred === 'boolean' ? responseData.meeting_occurred : null);
      setRegistrationDisabled(false);
      setAttendeesList(attendees.filter(guestsOnly));
      setNoShowsList(noShows.filter(guestsOnly));
      setAllRegistrantsForPreview([...attendees, ...noShows].filter(guestsOnly));
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
      const response = await fetch(
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
      const response = await fetch(
        `/api/meeting-assignments/${selectedMeeting}?userId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.template_id) {
          setAssignment(data);
          return data;
        } else {
          setAssignment(null);
          return null;
        }
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
