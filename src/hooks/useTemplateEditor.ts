import { useState, useCallback } from 'react';

export type TabType = 'attendees' | 'noShows';

export function useTemplateEditor() {
  const [activeTab, setActiveTab] = useState<TabType>('attendees');
  const [attendeesEmail, setAttendeesEmail] = useState<string>('');
  const [noShowsEmail, setNoShowsEmail] = useState<string>('');
  const [attendeesEmailSubject, setAttendeesEmailSubject] = useState<string>('');
  const [noShowsEmailSubject, setNoShowsEmailSubject] = useState<string>('');
  const [attendeesTemplateName, setAttendeesTemplateName] = useState<string>('');
  const [noShowsTemplateName, setNoShowsTemplateName] = useState<string>('');
  const [attendeesSelectedTemplateId, setAttendeesSelectedTemplateId] = useState<string>('');
  const [noShowsSelectedTemplateId, setNoShowsSelectedTemplateId] = useState<string>('');
  const [attendeesCurrentTemplate, setAttendeesCurrentTemplate] = useState<any>(null);
  const [noShowsCurrentTemplate, setNoShowsCurrentTemplate] = useState<any>(null);

  const getSelectedTemplateId = (): string => {
    return activeTab === 'attendees' ? attendeesSelectedTemplateId : noShowsSelectedTemplateId;
  };

  const setSelectedTemplateId = (value: string, tab?: TabType) => {
    const targetTab = tab || activeTab;
    if (targetTab === 'attendees') {
      setAttendeesSelectedTemplateId(value);
    } else {
      setNoShowsSelectedTemplateId(value);
    }
  };

  const getCurrentTemplate = (): any => {
    return activeTab === 'attendees' ? attendeesCurrentTemplate : noShowsCurrentTemplate;
  };

  const setCurrentTemplate = (value: any, tab?: TabType) => {
    const targetTab = tab || activeTab;
    if (targetTab === 'attendees') {
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

  const getCurrentEmailContent = (): string => {
    return activeTab === 'attendees' ? attendeesEmail : noShowsEmail;
  };

  const setCurrentEmailContent = (value: string) => {
    if (activeTab === 'attendees') {
      setAttendeesEmail(value);
    } else {
      setNoShowsEmail(value);
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

  const loadTemplateForTab = (template: any, tab: TabType) => {
    if (!template) return;

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
  };

  const clearTabState = (tab: TabType) => {
    if (tab === 'attendees') {
      setAttendeesSelectedTemplateId('');
      setAttendeesCurrentTemplate(null);
      setAttendeesTemplateName('');
      setAttendeesEmailSubject('');
      setAttendeesEmail('');
    } else {
      setNoShowsSelectedTemplateId('');
      setNoShowsCurrentTemplate(null);
      setNoShowsTemplateName('');
      setNoShowsEmailSubject('');
      setNoShowsEmail('');
    }
  };

  const handleEditorChange = useCallback((content: string) => {
    // Strip color styles before saving
    const cleanedContent = content.replace(/style="[^"]*color:[^"]*"/gi, '');
    
    if (activeTab === 'attendees') {
      setAttendeesEmail(cleanedContent);
    } else {
      setNoShowsEmail(cleanedContent);
    }
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    attendeesEmail,
    noShowsEmail,
    attendeesEmailSubject,
    noShowsEmailSubject,
    attendeesTemplateName,
    noShowsTemplateName,
    attendeesSelectedTemplateId,
    noShowsSelectedTemplateId,
    attendeesCurrentTemplate,
    noShowsCurrentTemplate,
    getSelectedTemplateId,
    setSelectedTemplateId,
    getCurrentTemplate,
    setCurrentTemplate,
    getEmailSubject,
    setEmailSubject,
    getCurrentEmailContent,
    setCurrentEmailContent,
    getTemplateName,
    setTemplateName,
    loadTemplateForTab,
    clearTabState,
    handleEditorChange,
  };
}
