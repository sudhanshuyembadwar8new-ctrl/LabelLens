import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  DEFAULT_ADMIN,
  DEFAULT_INSPECTOR,
  DEFAULT_SETTINGS,
  DEMO_INSPECTION,
  SEED_INSPECTIONS,
  TEAM_INSPECTORS,
} from '../data/seedData';
import {
  ActivityEvent,
  Admin,
  AppSettings,
  EvidenceItem,
  ExtractedField,
  Finding,
  ImageAsset,
  Inspection,
  Inspector,
  InspectorPerformance,
  OCRBlock,
  ReviewStatus,
  UserRole,
} from '../types';
import { executeRegulatoryAnalysis } from '../services/analysisPipeline';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface AdminInspectorStat {
  inspectorId: string;
  inspectorName: string;
  designation: string;
  jurisdiction: string;
  district: string;
  realInspections: number;
  reports: number;
  pendingReviews: number;
  lastActivity: string;
  status: string;
}

interface InspectionContextType {
  // Inspections
  allInspections: Inspection[];
  inspections: Inspection[];
  realInspections: Inspection[];
  userRealInspections: Inspection[];
  demoInspection: Inspection;
  currentInspection: Inspection | null;
  activityEvents: ActivityEvent[];
  logActivity: (event: Omit<ActivityEvent, 'activityId' | 'timestamp'>) => void;
  startNewInspection: () => Inspection;
  runAnalysisOnInspection: (inspectionId: string) => Promise<void>;

  // Routing
  activeRoute: string;
  routeParams: Record<string, string>;
  navigateTo: (route: string) => void;

  // Authentication & Users
  isAuthenticated: boolean;
  currentRole: UserRole;
  currentUser: Inspector;
  currentAdmin: Admin;
  teamInspectors: Inspector[];
  login: (credentials?: {
    userId?: string;
    email?: string;
    password?: string;
    role?: UserRole;
  }) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchInspector: (inspectorId: string) => void;

  // Real Prototype Statistics
  adminStats: {
    totalInspectors: number;
    activeInspectors: number;
    totalRealInspections: number;
    pendingReviews: number;
    reportsGenerated: number;
  };
  adminInspectorStats: AdminInspectorStat[];

  // App Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateUserProfile: (profile: Partial<Inspector>) => void;

  // Notifications
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;

  // Inspection actions
  setCurrentInspectionById: (id: string) => void;
  saveDraftInspection: (inspectionData: Partial<Inspection>) => Inspection;
  markInspectionComplete: (inspectionId: string) => void;
  addImageToInspection: (inspectionId: string, image: ImageAsset) => void;
  removeImageFromInspection: (inspectionId: string, imageId: string) => void;
  updateFindingStatus: (
    inspectionId: string,
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => void;
  updateFindingReviewStatus: (
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => void;
  updateEvidenceStatus: (
    inspectionId: string,
    evidenceId: string,
    status: ReviewStatus,
    note: string
  ) => void;
  updateEvidenceItem: (
    evidenceId: string,
    updates: Partial<EvidenceItem>
  ) => void;
  updateOverallNotes: (inspectionId: string, notes: string) => void;

  // Real-Time Cloud Synchronization
  isSyncing: boolean;
  lastSyncTime: string;
  forceSyncWithServer: () => Promise<void>;

  // Reset Mechanism (Admin only)
  resetPrototypeData: () => void;
  resetAllPrototypeData: () => void;
  loadReferenceBenchmark: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

// Storage keys versioned for clean testing environment
const STORAGE_KEY_INSPECTIONS = 'metrix_inspections_live_v1';
const STORAGE_KEY_CURRENT_ID = 'metrix_current_id_live_v1';
const STORAGE_KEY_SETTINGS = 'metrix_settings_live_v1';
const STORAGE_KEY_AUTH = 'metrix_auth_live_v1';
const STORAGE_KEY_ROLE = 'metrix_role_live_v1';
const STORAGE_KEY_USER_ID = 'metrix_user_id_live_v1';
const STORAGE_KEY_ACTIVITIES = 'metrix_activities_live_v1';

const INITIAL_ACTIVITIES: ActivityEvent[] = [];

export const InspectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All inspections stored (Clean start across inspector and admin dashboards)
  const [allInspections, setAllInspections] = useState<Inspection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSPECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved inspections', e);
    }
    // Clean default: empty array as requested
    return [];
  });

  const [currentInspectionId, setCurrentInspectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return '';
  });

  // Current Logged-in Inspector ID
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_ID);
      if (saved && TEAM_INSPECTORS.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return TEAM_INSPECTORS[0].id; // PRASAD_INS_01
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved !== null) return saved === 'true';
    } catch {
      // Fallback
    }
    return true; // Default ready for testing
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'ADMIN' || saved === 'INSPECTOR') return saved;
    } catch {
      // Fallback
    }
    return 'ADMIN';
  });

  // Authoritative synchronous auth state ref to prevent stale closures during navigation
  const authStateRef = useRef({
    isAuthenticated,
    currentRole,
    currentUserId,
  });

  useEffect(() => {
    authStateRef.current = {
      isAuthenticated,
      currentRole,
      currentUserId,
    };
  }, [isAuthenticated, currentRole, currentUserId]);

  const [currentAdmin] = useState<Admin>(DEFAULT_ADMIN);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Real Prototype Activity Event Ledger
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load activity events', e);
    }
    return INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activityEvents));
    } catch (e) {
      console.warn('Failed to save activity events', e);
    }
  }, [activityEvents]);

  // Cloud & Multi-Tab Real-Time Synchronization State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        syncChannelRef.current = new BroadcastChannel('metrix_realtime_sync');
        syncChannelRef.current.onmessage = (event) => {
          if (event.data?.type === 'SYNC_NOW') {
            fetchFromServer(false);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not available', e);
      }
    }
    return () => {
      syncChannelRef.current?.close();
    };
  }, []);

  const notifyOtherTabs = () => {
    try {
      syncChannelRef.current?.postMessage({ type: 'SYNC_NOW', timestamp: Date.now() });
    } catch {}
  };

  const syncInspectionToServer = async (inspection: Inspection) => {
    try {
      await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inspection),
      });
      notifyOtherTabs();
    } catch (e) {
      console.warn('Failed to sync inspection to server', e);
    }
  };

  const syncActivityToServer = async (event: ActivityEvent) => {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      notifyOtherTabs();
    } catch (e) {
      console.warn('Failed to sync activity to server', e);
    }
  };

  const fetchFromServer = async (showSyncIndicator = false) => {
    if (showSyncIndicator) setIsSyncing(true);
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.inspections)) {
          setAllInspections(data.inspections);
        }

        if (Array.isArray(data.activities)) {
          setActivityEvents(data.activities);
        }

        const nowTime = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastSyncTime(nowTime);
      }
    } catch (e) {
      console.warn('Sync failed', e);
    } finally {
      if (showSyncIndicator) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  };

  // Continuous background auto-polling for instant real-time updates across devices & tabs
  useEffect(() => {
    fetchFromServer(true);

    const interval = setInterval(() => {
      fetchFromServer(false);
    }, 3000);

    const handleFocus = () => {
      fetchFromServer(false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const forceSyncWithServer = async () => {
    setIsSyncing(true);
    await fetchFromServer(true);
    showToast('Real-time synchronization refreshed: Connected with Directorate HQ', 'success');
  };

  const logActivity = (event: Omit<ActivityEvent, 'activityId' | 'timestamp'>) => {
    const nowFormatted = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newActivity: ActivityEvent = {
      ...event,
      activityId: `ACT-${Date.now().toString().slice(-6)}`,
      timestamp: `Today, ${nowFormatted}`,
    };
    setActivityEvents((prev) => [newActivity, ...prev]);
    syncActivityToServer(newActivity);
  };

  // Current inspector object
  const currentUser =
    TEAM_INSPECTORS.find((t) => t.id === currentUserId) || TEAM_INSPECTORS[0];

  const demoInspection =
    allInspections.find((i) => i.isDemo || i.id === DEMO_INSPECTION.id) || DEMO_INSPECTION;

  // Real user-created inspections (strictly non-demo)
  const realInspections = allInspections.filter((i) => !i.isDemo && i.id !== DEMO_INSPECTION.id);

  // Inspector-isolated real inspections
  const userRealInspections = realInspections.filter((i) => i.inspectorId === currentUser.id);

  // Inspections visible to the current view
  // If role is INSPECTOR: only their own real inspections + demo inspection (available to open)
  // If role is ADMIN: all real inspections from all team members + demo inspection
  const inspections =
    currentRole === 'ADMIN'
      ? allInspections
      : [demoInspection, ...userRealInspections];

  const currentInspection =
    allInspections.find((i) => i.id === currentInspectionId) || demoInspection;

  // Routing State - Always load official homepage ('/') on link access
  const [activeRoute, setActiveRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== '/' && hash !== '/login' && hash !== '/admin') {
        return hash;
      }
    }
    return '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Clear stale url path on initial mount so link opens pure home page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (
        window.location.pathname === '/login' ||
        window.location.pathname === '/admin' ||
        window.location.pathname === '/dashboard' ||
        window.location.pathname === '/index.html'
      ) {
        try {
          window.history.replaceState({}, '', '/');
        } catch {}
      }
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(allInspections));
    } catch (e) {
      console.warn('Failed to save inspections', e);
    }
  }, [allInspections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_ID, currentInspectionId);
    } catch (e) {
      console.warn('Failed to save current id', e);
    }
  }, [currentInspectionId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, String(isAuthenticated));
    } catch (e) {
      console.warn('Failed to save auth', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
    } catch (e) {
      console.warn('Failed to save role', e);
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_ID, currentUserId);
    } catch (e) {
      console.warn('Failed to save user id', e);
    }
  }, [currentUserId]);

  // Route Parser
  const parsePath = (path: string) => {
    // Check inspector detail route: /admin/inspectors/:id
    const adminInspectorMatch = path.match(/^\/admin\/inspectors\/([^/]+)$/);
    if (adminInspectorMatch) {
      const [, inspectorId] = adminInspectorMatch;
      setRouteParams({ inspectorId });
      return;
    }

    const inspectionRouteMatch = path.match(
      /^\/inspections\/([^/]+)\/(analyzing|result|evidence|report|upload)$/
    );
    if (inspectionRouteMatch) {
      const [, id, sub] = inspectionRouteMatch;
      setRouteParams({ id, sub });
      setCurrentInspectionId(id);
      return;
    }
    setRouteParams({});
  };

  const getExpectedAdminPassword = (): string => {
    return (
      (import.meta.env.VITE_PRASAD_ADMIN_PASSWORD as string) ||
      (import.meta.env.PRASAD_ADMIN_PASSWORD as string) ||
      'Prasad@Admin2026'
    );
  };

  const getExpectedInspectorPassword = (userId: string): string => {
    switch (userId) {
      case 'NAVINYA_INS_02':
        return (
          (import.meta.env.VITE_NAVINYA_INSPECTOR_PASSWORD as string) ||
          (import.meta.env.NAVINYA_INSPECTOR_PASSWORD as string) ||
          'Navinya@2026'
        );
      case 'SUDHANSHU_INS_03':
        return (
          (import.meta.env.VITE_SUDHANSHU_INSPECTOR_PASSWORD as string) ||
          (import.meta.env.SUDHANSHU_INSPECTOR_PASSWORD as string) ||
          'Sudhanshu@2026'
        );
      case 'DEVANSH_INS_04':
        return (
          (import.meta.env.VITE_DEVANSH_INSPECTOR_PASSWORD as string) ||
          (import.meta.env.DEVANSH_INSPECTOR_PASSWORD as string) ||
          'Devansh@2026'
        );
      case 'NIRMITI_INS_05':
        return (
          (import.meta.env.VITE_NIRMITI_INSPECTOR_PASSWORD as string) ||
          (import.meta.env.NIRMITI_INSPECTOR_PASSWORD as string) ||
          'Nirmiti@2026'
        );
      case 'KSHITIJA_INS_06':
        return (
          (import.meta.env.VITE_KSHITIJA_INSPECTOR_PASSWORD as string) ||
          (import.meta.env.KSHITIJA_INSPECTOR_PASSWORD as string) ||
          'Kshitija@2026'
        );
      default:
        return 'LabelLens@2026';
    }
  };

  const navigateTo = (route: string) => {
    const isAuthed = authStateRef.current.isAuthenticated;
    const activeRole = authStateRef.current.currentRole;

    // 1. Public routes check
    const publicRoutes = ['/', '/home', '/legal-metrology', '/login', '/login/inspector', '/login/admin'];
    if (!isAuthed && !publicRoutes.includes(route)) {
      showToast('Please sign in to access the legal metrology workspace.', 'warning');
      setActiveRoute('/login');
      parsePath('/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Role access check: Inspector cannot access /admin routes
    if (activeRole === 'INSPECTOR' && route.startsWith('/admin')) {
      showToast('Access Denied: Inspectors do not have administrative permissions.', 'error');
      setActiveRoute('/dashboard');
      parsePath('/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveRoute(route);
    parsePath(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const clearToast = () => setToast(null);

  // Authentication Flow - Instant 1-Click Resolution
  const login = (credentials?: {
    userId?: string;
    email?: string;
    password?: string;
    role?: UserRole;
  }): boolean => {
    const universalDemoPassword = 'LabelLens@2026';
    const legacyUniversalDemoPassword = 'Metrix@2026';

    // 1. Admin Authentication Check
    if (
      credentials?.role === 'ADMIN' ||
      credentials?.userId === 'PRASAD_ADMIN_01' ||
      credentials?.userId === 'LABELLENS_ADMIN_01' ||
      credentials?.userId === 'LABLELENS_ADMIN_01' ||
      credentials?.userId === 'METRIX_ADMIN_01' ||
      credentials?.userId?.toLowerCase().includes('admin') ||
      credentials?.email?.toLowerCase().includes('admin') ||
      credentials?.email?.toLowerCase().includes('prasad')
    ) {
      const expectedAdminPass = getExpectedAdminPassword();
      const enteredPass = credentials?.password || '';

      if (
        enteredPass &&
        enteredPass !== expectedAdminPass &&
        enteredPass !== universalDemoPassword &&
        enteredPass !== legacyUniversalDemoPassword &&
        enteredPass !== 'admin'
      ) {
        showToast('Invalid password for Directorate Administrator account.', 'error');
        return false;
      }

      // Synchronously update ref to prevent stale closure race conditions
      authStateRef.current = {
        isAuthenticated: true,
        currentRole: 'ADMIN',
        currentUserId: DEFAULT_ADMIN.id,
      };
      setIsAuthenticated(true);
      setCurrentRole('ADMIN');
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        localStorage.setItem(STORAGE_KEY_ROLE, 'ADMIN');
      } catch (e) {
        console.warn('Failed to save admin auth to localStorage', e);
      }

      showToast(`Supervisory session established: ${DEFAULT_ADMIN.name}`, 'info');
      setActiveRoute('/admin/dashboard');
      parsePath('/admin/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }

    // 2. Inspector Authentication Match
    let targetInspector = TEAM_INSPECTORS[0]; // default Navinya
    if (credentials?.userId) {
      const found = TEAM_INSPECTORS.find((t) => t.id === credentials.userId);
      if (found) targetInspector = found;
    } else if (credentials?.email) {
      const found = TEAM_INSPECTORS.find(
        (t) =>
          t.email.toLowerCase() === credentials.email?.toLowerCase() ||
          t.id.toLowerCase() === credentials.email?.toLowerCase()
      );
      if (found) targetInspector = found;
    }

    const expectedInspectorPass = getExpectedInspectorPassword(targetInspector.id);
    const enteredPass = credentials?.password || '';

    if (
      enteredPass &&
      enteredPass !== expectedInspectorPass &&
      enteredPass !== universalDemoPassword &&
      enteredPass !== legacyUniversalDemoPassword &&
      enteredPass !== 'demo'
    ) {
      showToast(`Invalid password for inspector account ${targetInspector.name}.`, 'error');
      return false;
    }

    // Synchronously update ref to prevent stale closure race conditions
    authStateRef.current = {
      isAuthenticated: true,
      currentRole: 'INSPECTOR',
      currentUserId: targetInspector.id,
    };
    setIsAuthenticated(true);
    setCurrentRole('INSPECTOR');
    setCurrentUserId(targetInspector.id);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      localStorage.setItem(STORAGE_KEY_ROLE, 'INSPECTOR');
      localStorage.setItem(STORAGE_KEY_USER_ID, targetInspector.id);
    } catch (e) {
      console.warn('Failed to save inspector auth to localStorage', e);
    }

    showToast(`Inspector workspace loaded: ${targetInspector.name} (${targetInspector.id})`, 'info');
    setActiveRoute('/dashboard');
    parsePath('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN' && currentRole !== 'ADMIN') {
      showToast('Admin privilege elevation requires administrator authentication.', 'error');
      navigateTo('/login/admin');
      return;
    }
    setCurrentRole(role);
    if (role === 'ADMIN') {
      showToast('Switched to Legal Metrology Supervisory / Admin Workspace', 'info');
      navigateTo('/admin/dashboard');
    } else {
      showToast(`Switched to Inspector Workspace (${currentUser.name})`, 'info');
      navigateTo('/dashboard');
    }
  };

  const switchInspector = (inspectorId: string) => {
    const target = TEAM_INSPECTORS.find((t) => t.id === inspectorId);
    if (target) {
      setCurrentUserId(target.id);
      setCurrentRole('INSPECTOR');
      showToast(`Active Inspector switched to: ${target.name} (${target.id})`, 'info');
      navigateTo('/dashboard');
    }
  };

  const logout = () => {
    authStateRef.current = {
      isAuthenticated: false,
      currentRole: 'INSPECTOR',
      currentUserId: TEAM_INSPECTORS[0].id,
    };
    setIsAuthenticated(false);
    setCurrentRole('INSPECTOR');
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'false');
      localStorage.setItem(STORAGE_KEY_ROLE, 'INSPECTOR');
    } catch (e) {
      console.warn('Failed to clear auth in localStorage', e);
    }
    showToast('Signed out of LabelLens session', 'info');
    setActiveRoute('/login');
    parsePath('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrentInspectionById = (id: string) => {
    setCurrentInspectionId(id);
  };

  // Create or Update Inspection
  const saveDraftInspection = (inspectionData: Partial<Inspection>): Inspection => {
    const existingIndex = allInspections.findIndex((i) => i.id === inspectionData.id);
    let updatedInspection: Inspection;

    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (existingIndex >= 0) {
      updatedInspection = {
        ...allInspections[existingIndex],
        ...inspectionData,
        updatedAt: nowIso,
        lastUpdated: nowFormatted,
      };
      setAllInspections((prev) => {
        const next = [...prev];
        next[existingIndex] = updatedInspection;
        return next;
      });
      syncInspectionToServer(updatedInspection);
      logActivity({
        userId: currentUser.id,
        userName: currentUser.name,
        inspectionId: updatedInspection.id,
        type: 'details_completed',
        description: `${currentUser.name} updated details for inspection ${updatedInspection.id}`,
      });
    } else {
      // Generating a new real inspection automatically
      const sequentialNumber = Math.floor(1000 + Math.random() * 9000);
      const newId = inspectionData.id || `INS-2026-${sequentialNumber}`;

      updatedInspection = {
        id: newId,
        isDemo: false,
        status: 'DRAFT',
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectorId: currentUser.id,
        inspectorName: currentUser.name,
        jurisdiction: currentUser.jurisdiction,
        inspectionType: 'Routine market surveillance',
        business: {
          name: '',
          type: 'Retailer',
          address: '',
        },
        product: {
          category: 'Packaged food',
          brand: '',
          name: '',
          packageType: 'Printed retail pack',
          declaredQuantity: '',
        },
        context: {
          inspectionType: 'Routine market surveillance',
          source: 'Field visit',
          inspectorNotes: '',
        },
        images: [],
        fieldsReviewed: 0,
        findings: [],
        extractedFields: [],
        evidence: [],
        createdAt: nowIso,
        updatedAt: nowIso,
        lastUpdated: nowFormatted,
        analysisMode: 'REAL_PROTOTYPE',
        ...inspectionData,
      };

      setAllInspections((prev) => [updatedInspection, ...prev]);
      syncInspectionToServer(updatedInspection);

      logActivity({
        userId: currentUser.id,
        userName: currentUser.name,
        inspectionId: updatedInspection.id,
        type: 'inspection_created',
        description: `${currentUser.name} created inspection ${updatedInspection.id} for ${updatedInspection.business.name || 'field visit'}`,
      });
    }

    setCurrentInspectionId(updatedInspection.id);
    return updatedInspection;
  };

  const markInspectionComplete = (inspectionId: string) => {
    let completedInspection: Inspection | null = null;
    setAllInspections((prev) => {
      const idx = prev.findIndex((i) => i.id === inspectionId);
      if (idx === -1) return prev;
      const target = prev[idx];
      const updatedFindings = (target.findings || []).map((f) => ({
        ...f,
        reviewStatus: (f.reviewStatus === 'PENDING' ? 'VERIFIED' : f.reviewStatus) as ReviewStatus,
      }));
      const updatedEvidence = (target.evidence || []).map((e) => ({
        ...e,
        reviewStatus: (e.reviewStatus === 'PENDING' ? 'VERIFIED' : e.reviewStatus) as ReviewStatus,
      }));
      completedInspection = {
        ...target,
        status: 'REPORT_READY',
        findings: updatedFindings,
        evidence: updatedEvidence,
        lastUpdated: 'Just now',
        updatedAt: new Date().toISOString(),
      };
      const next = [...prev];
      next[idx] = completedInspection;
      return next;
    });

    if (completedInspection) {
      syncInspectionToServer(completedInspection);
    }

    logActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      inspectionId,
      type: 'report_generated',
      description: `${currentUser.name} completed inspection ${inspectionId} • Form 1 Statutory Report ready & automatically updated on Directorate Admin Portal`,
    });

    showToast(`Inspection ${inspectionId} completed! Automatically updated to Directorate Admin portal.`, 'success');
  };

  const startNewInspection = (): Inspection => {
    const sequentialNumber = Math.floor(1000 + Math.random() * 9000);
    const newId = `INS-2026-${sequentialNumber}`;
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newDraft: Inspection = {
      id: newId,
      isDemo: false,
      status: 'DRAFT',
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorId: currentUser.id,
      inspectorName: currentUser.name,
      jurisdiction: currentUser.jurisdiction || 'Field Inspection Unit',
      inspectionType: 'Routine market surveillance',
      business: {
        name: 'Retail Store (Field Surveillance)',
        type: 'Retailer',
        address: `${currentUser.jurisdiction || 'Local'} Market Area`,
        contact: '',
      },
      product: {
        category: 'Packaged Commodities',
        brand: '',
        name: '',
        packageType: 'Standard Retail Pack',
        declaredQuantity: '',
      },
      context: {
        inspectionType: 'Routine market surveillance',
        source: 'Store Shelf Sample',
        inspectorNotes: '',
        location: `${currentUser.jurisdiction || 'Local'} Market Area`,
      },
      images: [],
      fieldsReviewed: 0,
      findings: [],
      extractedFields: [],
      evidence: [],
      createdAt: nowIso,
      updatedAt: nowIso,
      lastUpdated: nowFormatted,
      analysisMode: 'REAL_PROTOTYPE',
    };

    setAllInspections((prev) => [newDraft, ...prev]);
    setCurrentInspectionId(newDraft.id);
    syncInspectionToServer(newDraft);

    logActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      inspectionId: newDraft.id,
      type: 'inspection_created',
      description: `${currentUser.name} initiated rapid zero-fill inspection ${newDraft.id}`,
    });

    navigateTo(`/inspections/${newDraft.id}/upload`);
    showToast(`New Inspection ${newDraft.id} opened. Capture package photos to auto-extract details!`, 'info');
    return newDraft;
  };

  const runAnalysisOnInspection = async (inspectionId: string): Promise<void> => {
    const targetIns = allInspections.find((i) => i.id === inspectionId);
    let detectedProductOverride: { brand?: string; name?: string; category?: string; declaredQuantity?: string } | undefined;
    let serverOcrBlocks: OCRBlock[] | undefined;
    let serverExtractedFields: ExtractedField[] | undefined;

    if (targetIns && targetIns.images.length > 0) {
      try {
        const frontImage = targetIns.images.find((img) => img.role === 'FRONT') || targetIns.images[0];
        const backImage = targetIns.images.find((img) => img.role === 'BACK') || targetIns.images[1] || frontImage;

        const response = await fetch('/api/analyze-commodity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inspectionId,
            frontImage,
            backImage,
            product: targetIns.product,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.detectedProduct) {
            detectedProductOverride = result.detectedProduct;
          }
          if (result.ocrBlocks && Array.isArray(result.ocrBlocks)) {
            serverOcrBlocks = result.ocrBlocks;
          }
          if (result.extractedFields && Array.isArray(result.extractedFields)) {
            serverExtractedFields = result.extractedFields;
          }
        }
      } catch (apiErr) {
        console.warn('Multimodal OCR API call failed, falling back to local optical parser:', apiErr);
      }
    }

    let analyzedInspection: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          const { extractedFields, findings, evidence, detectedProduct } = executeRegulatoryAnalysis(
            ins,
            serverExtractedFields,
            serverOcrBlocks,
            detectedProductOverride
          );

          analyzedInspection = {
            ...ins,
            product: {
              ...ins.product,
              brand: detectedProduct.brand || ins.product.brand || 'Scanned Brand',
              name: detectedProduct.name || ins.product.name || 'Packaged Commodity',
              category: detectedProduct.category || ins.product.category || 'Packaged Commodities',
              declaredQuantity: detectedProduct.declaredQuantity || ins.product.declaredQuantity || '500 g',
            },
            extractedFields,
            findings,
            evidence,
            fieldsReviewed: extractedFields.length,
            status: 'REVIEW_REQUIRED',
            lastUpdated: 'Just now',
            updatedAt: new Date().toISOString(),
          };
          return analyzedInspection;
        }
        return ins;
      })
    );

    if (analyzedInspection) {
      syncInspectionToServer(analyzedInspection);
      const prod = (analyzedInspection as Inspection).product;
      showToast(`✨ Scanner extracted: ${prod.brand} ${prod.name} (${prod.declaredQuantity})`, 'success');
    }

    logActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      inspectionId,
      type: 'analysis_completed',
      description: `${currentUser.name} completed package scan and statutory analysis for ${inspectionId}`,
    });
  };

  const addImageToInspection = (inspectionId: string, image: ImageAsset) => {
    let targetWithImg: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          const filtered = ins.images.filter((img) => img.role !== image.role || img.id === image.id);
          targetWithImg = {
            ...ins,
            images: [...filtered, image],
            lastUpdated: 'Just now',
          };
          return targetWithImg;
        }
        return ins;
      })
    );

    if (targetWithImg) {
      syncInspectionToServer(targetWithImg);
    }

    logActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      inspectionId,
      type: 'image_captured',
      description: `${currentUser.name} attached ${image.role} package photograph (${image.filename})`,
    });
    showToast(`Image "${image.filename}" (${image.role}) attached to inspection`, 'success');
  };

  const removeImageFromInspection = (inspectionId: string, imageId: string) => {
    let targetAfterRemove: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          targetAfterRemove = {
            ...ins,
            images: ins.images.filter((img) => img.id !== imageId),
            lastUpdated: 'Just now',
          };
          return targetAfterRemove;
        }
        return ins;
      })
    );
    if (targetAfterRemove) {
      syncInspectionToServer(targetAfterRemove);
    }
  };

  const updateFindingStatus = (
    inspectionId: string,
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => {
    let updatedTarget: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          const updatedFindings = ins.findings.map((f) =>
            f.id === findingId ? { ...f, reviewStatus: status } : f
          );
          const allVerified = updatedFindings.every((f) => f.reviewStatus === 'VERIFIED');
          updatedTarget = {
            ...ins,
            findings: updatedFindings,
            status: allVerified ? 'REPORT_READY' : 'REVIEW_REQUIRED',
            lastUpdated: 'Just now',
          };
          return updatedTarget;
        }
        return ins;
      })
    );

    if (updatedTarget) {
      syncInspectionToServer(updatedTarget);
    }
    showToast(`Observation ${findingId} marked as ${status}`, 'info');
  };

  const updateFindingReviewStatus = (
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => {
    if (currentInspectionId) {
      updateFindingStatus(currentInspectionId, findingId, status, note);
    }
  };

  const updateEvidenceStatus = (
    inspectionId: string,
    evidenceId: string,
    status: ReviewStatus,
    note: string
  ) => {
    let updatedTarget: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          const updatedEvidence = ins.evidence.map((ev) =>
            ev.id === evidenceId
              ? { ...ev, reviewStatus: status, reviewerNote: note || ev.reviewerNote }
              : ev
          );
          updatedTarget = {
            ...ins,
            evidence: updatedEvidence,
            lastUpdated: 'Just now',
          };
          return updatedTarget;
        }
        return ins;
      })
    );

    if (updatedTarget) {
      syncInspectionToServer(updatedTarget);
    }
    showToast(`Evidence item ${evidenceId} verified`, 'success');
  };

  const updateEvidenceItem = (evidenceId: string, updates: Partial<EvidenceItem>) => {
    if (!currentInspectionId) return;
    let updatedTarget: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === currentInspectionId) {
          updatedTarget = {
            ...ins,
            evidence: ins.evidence.map((ev) =>
              ev.id === evidenceId ? { ...ev, ...updates } : ev
            ),
            lastUpdated: 'Just now',
          };
          return updatedTarget;
        }
        return ins;
      })
    );

    if (updatedTarget) {
      syncInspectionToServer(updatedTarget);
    }
  };

  const updateOverallNotes = (inspectionId: string, notes: string) => {
    let updatedTarget: Inspection | null = null;
    setAllInspections((prev) =>
      prev.map((ins) => {
        if (ins.id === inspectionId) {
          updatedTarget = {
            ...ins,
            reviewerOverallNotes: notes,
            lastUpdated: 'Just now',
          };
          return updatedTarget;
        }
        return ins;
      })
    );

    if (updatedTarget) {
      syncInspectionToServer(updatedTarget);
    }
    showToast('Inspection officer notes saved', 'success');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  };

  const updateUserProfile = (profile: Partial<Inspector>) => {
    // Allows updating current user
    showToast('Profile updated', 'info');
  };

  // Reset Data Mechanism (Admin only)
  // Deletes all inspections and activities across all inspectors and admin portal
  const resetPrototypeData = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Could not reset server data', e);
    }
    setAllInspections([]);
    setCurrentInspectionId('');
    setActivityEvents([]);
    localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, '');
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify([]));
    notifyOtherTabs();
    showToast('All inspection records and activity ledgers cleared across all inspector dashboards and admin portal.', 'info');
  };
  const resetAllPrototypeData = resetPrototypeData;

  const loadReferenceBenchmark = () => {
    setAllInspections((prev) => {
      const exists = prev.some((i) => i.id === DEMO_INSPECTION.id);
      if (exists) return prev;
      const updated = [DEMO_INSPECTION, ...prev];
      syncInspectionToServer(DEMO_INSPECTION);
      return updated;
    });
    setCurrentInspectionId(DEMO_INSPECTION.id);
    showToast('Loaded standard reference benchmark commodity (Annapurna Packaged Rice)', 'info');
  };

  // Real Dynamic Admin Statistics (Computed from actual prototype inspections)
  const totalRealInspections = realInspections.length;
  const pendingReviews = realInspections.filter((i) => i.status === 'REVIEW_REQUIRED').length;
  const reportsGenerated = realInspections.filter(
    (i) => i.status === 'REPORT_READY' || i.status === 'VERIFIED'
  ).length;

  // Active inspectors: inspectors with >= 1 real inspection
  const activeInspectorsCount = TEAM_INSPECTORS.filter((insp) =>
    realInspections.some((i) => i.inspectorId === insp.id)
  ).length;

  const adminStats = {
    totalInspectors: TEAM_INSPECTORS.length, // exactly 6 team members
    activeInspectors: activeInspectorsCount,
    totalRealInspections,
    pendingReviews,
    reportsGenerated,
  };

  // Real Inspector Performance Table (dynamically calculated for each team member)
  const adminInspectorStats: AdminInspectorStat[] = TEAM_INSPECTORS.map((insp) => {
    const inspInspections = realInspections.filter((i) => i.inspectorId === insp.id);
    const inspReports = inspInspections.filter(
      (i) => i.status === 'REPORT_READY' || i.status === 'VERIFIED'
    ).length;
    const inspPending = inspInspections.filter((i) => i.status === 'REVIEW_REQUIRED').length;

    let lastActivity = 'No inspections yet';
    if (inspInspections.length > 0) {
      const sorted = [...inspInspections].sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      lastActivity = sorted[0]?.lastUpdated || 'Recently recorded';
    }

    const status = inspInspections.length > 0 ? 'Active Field Testing' : 'Ready for Field Test';

    return {
      inspectorId: insp.id,
      inspectorName: insp.name,
      designation: insp.designation,
      jurisdiction: insp.jurisdiction,
      district: insp.district || 'Pune District',
      realInspections: inspInspections.length,
      reports: inspReports,
      pendingReviews: inspPending,
      lastActivity,
      status,
    };
  });

  return (
    <InspectionContext.Provider
      value={{
        allInspections,
        inspections,
        realInspections,
        userRealInspections,
        demoInspection,
        currentInspection,
        activityEvents,
        logActivity,
        startNewInspection,
        runAnalysisOnInspection,
        activeRoute,
        routeParams,
        navigateTo,
        isAuthenticated,
        currentRole,
        currentUser,
        currentAdmin,
        teamInspectors: TEAM_INSPECTORS,
        login,
        logout,
        switchRole,
        switchInspector,
        adminStats,
        adminInspectorStats,
        settings,
        updateSettings,
        updateUserProfile,
        toast,
        showToast,
        clearToast,
        setCurrentInspectionById,
        saveDraftInspection,
        markInspectionComplete,
        addImageToInspection,
        removeImageFromInspection,
        updateFindingStatus,
        updateFindingReviewStatus,
        updateEvidenceStatus,
        updateEvidenceItem,
        updateOverallNotes,
        isSyncing,
        lastSyncTime,
        forceSyncWithServer,
        resetPrototypeData,
        resetAllPrototypeData,
        loadReferenceBenchmark,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};
