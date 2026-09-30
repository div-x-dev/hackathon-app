import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  PickupRequest,
  PickupWasteType,
  PickupStatus,
  MunicipalWorker,
  AppNotification,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_PICKUPS,
  INITIAL_WORKERS,
  CITIZEN_PROFILES,
} from '../data/mockData';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  visible: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: (targetRole: UserRole, userProfile?: any) => void;
  logout: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: (typeof CITIZEN_PROFILES)[0];
  setCurrentUser: (user: (typeof CITIZEN_PROFILES)[0]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  complaints: Complaint[];
  pickups: PickupRequest[];
  workers: MunicipalWorker[];
  notifications: AppNotification[];
  toast: ToastInfo | null;
  showToast: (message: string, type?: ToastInfo['type']) => void;
  hideToast: () => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  selectedPickupId: string | null;
  setSelectedPickupId: (id: string | null) => void;

  // Theme & Language
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  
  // Complaint Actions
  createComplaint: (data: {
    title: string;
    category: ComplaintCategory;
    location: string;
    addressDetails?: string;
    priority: ComplaintPriority;
    description: string;
    beforePhotoUrl?: string;
  }) => Complaint;
  
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    workerId?: string,
    afterPhotoUrl?: string
  ) => void;

  assignComplaintWorker: (
    complaintId: string,
    workerId: string,
    note?: string
  ) => void;

  // Pickup Actions
  createPickupRequest: (data: {
    wasteType: PickupWasteType;
    scheduledDate: string;
    timeSlot: string;
    address: string;
    area: string;
    estimatedWeight?: string;
    specialInstructions?: string;
  }) => PickupRequest;

  updatePickupStatus: (
    id: string,
    newStatus: PickupStatus,
    note?: string,
    workerId?: string
  ) => void;

  assignPickupWorker: (
    pickupId: string,
    workerId: string
  ) => void;

  markNotificationRead: (id: string) => void;
  resetToDefaultDemoData: () => void;
}

const STORAGE_KEYS = {
  COMPLAINTS: 'binsync_complaints_v1',
  PICKUPS: 'binsync_pickups_v1',
  WORKERS: 'binsync_workers_v1',
  ROLE: 'binsync_role_v1',
  USER: 'binsync_user_v1',
  THEME: 'binsync_theme_v1',
  LANG: 'binsync_lang_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as LanguageCode) || 'english';
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'citizen';
  });

  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return CITIZEN_PROFILES[0]; // Aarav Sharma
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [pickups, setPickups] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PICKUPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PICKUPS;
  });

  const [workers, setWorkers] = useState<MunicipalWorker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_WORKERS;
  });

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n-1',
      title: 'Daily Ward Inspection Complete',
      message: 'Zone 2 North route sweep reports 94% bin clearance rate today.',
      timestamp: new Date().toISOString(),
      type: 'info',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Scheduled Dry Waste Drive',
      message: 'Door-to-door dry waste segregation drive active in Civil Lines & College Road.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'success',
      read: false,
    }
  ]);

  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
  }, [pickups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // Theme synchronization effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Language synchronization effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    showToast(`Switched theme to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched theme to ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
      return next;
    });
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const langObj = TRANSLATIONS[lang];
    showToast(`Language set to ${lang.toUpperCase()}`, 'info');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.english;
    return langDict[key] || TRANSLATIONS.english[key] || fallback || key;
  };

  const login = (targetRole: UserRole, userProfile?: any) => {
    setRoleState(targetRole);
    if (userProfile) {
      setCurrentUserState(userProfile);
    }
    if (targetRole === 'admin') {
      setActiveTab('priority-queue');
    } else if (targetRole === 'worker') {
      setActiveTab('my-tasks');
    } else {
      setActiveTab('dashboard');
    }
    setIsAuthenticated(true);
    sessionStorage.setItem('binsync_auth', 'true');
    showToast(`Welcome! Signed in as ${targetRole.toUpperCase()}`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('binsync_auth');
    showToast('Signed out of BINSYNC', 'info');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      setActiveTab('priority-queue');
    } else if (newRole === 'worker') {
      setActiveTab('my-tasks');
    } else {
      setActiveTab('dashboard');
    }
    showToast(`Switched workspace to ${newRole.toUpperCase()} view`, 'info');
  };

  const setCurrentUser = (user: (typeof CITIZEN_PROFILES)[0]) => {
    setCurrentUserState(user);
    showToast(`Switched active citizen to ${user.name}`, 'info');
  };

  const showToast = (message: string, type: ToastInfo['type'] = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const hideToast = () => {
    setToast(null);
  };

  const createComplaint = (data: {
    title: string;
    category: ComplaintCategory;
    location: string;
    addressDetails?: string;
    priority: ComplaintPriority;
    description: string;
    beforePhotoUrl?: string;
  }): Complaint => {
    // Generate sequential ticket ID or exact demo ID
    const exists125 = complaints.some((c) => c.id === 'WM-2026-00125');
    const newId = !exists125
      ? 'WM-2026-00125'
      : `WM-2026-00${126 + Math.floor(Math.random() * 100)}`;

    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      id: newId,
      title: data.title || `${data.category} at ${data.location}`,
      category: data.category,
      location: data.location,
      addressDetails: data.addressDetails || `Near Main Junction, ${data.location}`,
      priority: data.priority,
      description: data.description,
      status: 'submitted',
      reporterName: currentUser.name,
      reporterEmail: currentUser.email,
      reporterPhone: currentUser.phone,
      createdAt: now,
      updatedAt: now,
      beforePhotoUrl:
        data.beforePhotoUrl ||
        'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'submitted',
          title: 'Complaint Registered',
          description: `Report filed by ${currentUser.name} for ${data.category}. Priority: ${data.priority}.`,
          timestamp: now,
          actor: currentUser.name,
          actorRole: 'Citizen',
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    showToast(`Report submitted successfully! Ticket #${newComplaint.id}`, 'success');
    return newComplaint;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    workerId?: string,
    afterPhotoUrl?: string
  ) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        let assignedWorker = c.assignedWorker;
        if (workerId) {
          const w = workers.find((item) => item.id === workerId);
          if (w) {
            assignedWorker = {
              id: w.id,
              name: w.name,
              phone: w.phone,
              unit: w.unit,
            };
          }
        }

        const statusTitles: Record<ComplaintStatus, string> = {
          submitted: 'Complaint Resubmitted',
          under_review: 'Under Zonal Review',
          assigned: `Dispatched to Sanitation Worker`,
          in_progress: 'Sanitation Operation in Progress',
          resolved: 'Sanitized & Resolved',
          closed: 'Complaint Closed & Confirmed',
        };

        const defaultDescriptions: Record<ComplaintStatus, string> = {
          submitted: 'Ticket entered triage queue.',
          under_review: 'Ward Inspector verified coordinates and categorized priority.',
          assigned: assignedWorker
            ? `Assigned to ${assignedWorker.name} (${assignedWorker.unit}).`
            : 'Assigned to field sanitation crew.',
          in_progress: 'Worker has arrived at location and initiated cleanup.',
          resolved: 'Litter cleared, bin emptied and area disinfected with lime.',
          closed: 'Citizen verified and closed the ticket.',
        };

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: newStatus,
          title: statusTitles[newStatus],
          description: note || defaultDescriptions[newStatus],
          timestamp: now,
          actor: role === 'admin' ? 'Vikram Saxena (Admin)' : role === 'worker' ? 'Ramesh Kumar (Worker)' : currentUser.name,
          actorRole: (role === 'admin' ? 'Admin' : role === 'worker' ? 'Worker' : 'Citizen') as any,
        };

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          assignedWorker,
          adminNotes: note ? `${c.adminNotes ? c.adminNotes + ' | ' : ''}${note}` : c.adminNotes,
          afterPhotoUrl: afterPhotoUrl || c.afterPhotoUrl || (newStatus === 'resolved' ? 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80' : undefined),
          timeline: [...c.timeline, newTimelineEvent],
        };
      })
    );

    showToast(`Ticket #${id} status updated to ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
  };

  const assignComplaintWorker = (complaintId: string, workerId: string, note?: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    updateComplaintStatus(
      complaintId,
      'assigned',
      note || `Assigned to ${worker.name} (${worker.unit})`,
      workerId
    );

    // Update worker task count
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId ? { ...w, assignedTasks: w.assignedTasks + 1 } : w
      )
    );
  };

  const createPickupRequest = (data: {
    wasteType: PickupWasteType;
    scheduledDate: string;
    timeSlot: string;
    address: string;
    area: string;
    estimatedWeight?: string;
    specialInstructions?: string;
  }): PickupRequest => {
    const exists45 = pickups.some((p) => p.id === 'PU-2026-00045');
    const newId = !exists45
      ? 'PU-2026-00045'
      : `PU-2026-000${46 + Math.floor(Math.random() * 50)}`;

    const now = new Date().toISOString();
    const newPickup: PickupRequest = {
      id: newId,
      wasteType: data.wasteType,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      status: 'Requested',
      address: data.address,
      area: data.area,
      estimatedWeight: data.estimatedWeight || '10-15 kg',
      specialInstructions: data.specialInstructions || '',
      requesterName: currentUser.name,
      requesterPhone: currentUser.phone,
      createdAt: now,
      timeline: [
        {
          status: 'Requested',
          timestamp: now,
          note: `Pickup request created for ${data.wasteType} on ${data.scheduledDate} (${data.timeSlot}).`,
          actor: currentUser.name,
        },
      ],
    };

    setPickups((prev) => [newPickup, ...prev]);
    showToast(`Pickup scheduled! Booking ID: ${newPickup.id}`, 'success');
    return newPickup;
  };

  const updatePickupStatus = (
    id: string,
    newStatus: PickupStatus,
    note?: string,
    workerId?: string
  ) => {
    const now = new Date().toISOString();
    setPickups((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        let assignedWorker = p.assignedWorker;
        if (workerId) {
          const w = workers.find((item) => item.id === workerId);
          if (w) {
            assignedWorker = {
              id: w.id,
              name: w.name,
              phone: w.phone,
              truckId: `DL-01-MW-${1000 + Math.floor(Math.random() * 9000)}`,
            };
          }
        }

        const descriptions: Record<PickupStatus, string> = {
          Requested: 'Booking received in system queue.',
          Scheduled: 'Slot confirmed in municipal logistics roster.',
          Assigned: assignedWorker ? `Assigned to ${assignedWorker.name} (${assignedWorker.truckId}).` : 'Assigned to collection truck.',
          'Picked Up': 'Waste loaded onto collection vehicle.',
          Completed: 'Delivered to sorting & upcycling depot.',
        };

        return {
          ...p,
          status: newStatus,
          assignedWorker,
          timeline: [
            ...p.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: note || descriptions[newStatus],
              actor: role === 'admin' ? 'Logistics Control Desk' : 'Field Staff',
            },
          ],
        };
      })
    );

    showToast(`Pickup #${id} marked as ${newStatus}`, 'success');
  };

  const assignPickupWorker = (pickupId: string, workerId: string) => {
    updatePickupStatus(pickupId, 'Assigned', undefined, workerId);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetToDefaultDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setPickups(INITIAL_PICKUPS);
    setWorkers(INITIAL_WORKERS);
    setCurrentUserState(CITIZEN_PROFILES[0]);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.PICKUPS);
    localStorage.removeItem(STORAGE_KEYS.WORKERS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    showToast('Demo data restored to initial clean state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        role,
        setRole,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        complaints,
        pickups,
        workers,
        notifications,
        toast,
        showToast,
        hideToast,
        selectedComplaintId,
        setSelectedComplaintId,
        selectedPickupId,
        setSelectedPickupId,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        createComplaint,
        updateComplaintStatus,
        assignComplaintWorker,
        createPickupRequest,
        updatePickupStatus,
        assignPickupWorker,
        markNotificationRead,
        resetToDefaultDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
