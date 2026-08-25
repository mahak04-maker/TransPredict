import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Transformer, Alert, Contact, Maintenance, Scenario, ScenarioKey } from '@/types';
import { SCENARIOS, buildTransformers, INITIAL_ALERTS, INITIAL_CONTACTS, INITIAL_MAINTENANCE } from '@/data/mockData';

interface Toast {
  id: number;
  title: string;
  message?: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  scenario: Scenario;
  scenarioKey: ScenarioKey;
  setScenarioKey: (k: ScenarioKey) => void;
  transformers: Transformer[];
  selectedTransformerId: string | null;
  selectTransformer: (id: string | null) => void;
  selectedTransformer: Transformer | null;
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  contacts: Contact[];
  addContact: (c: Omit<Contact, 'id'>) => void;
  maintenance: Maintenance[];
  maintenanceById: (id: string) => Maintenance | undefined;
  assignTechnician: (id: string) => void;
  startInspection: (id: string) => void;
  resolveMaintenance: (id: string) => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  notificationCount: number;
  voiceEscalationActive: boolean;
  setVoiceEscalationActive: (v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('normal');
  const scenario = useMemo(() => SCENARIOS.find((s) => s.key === scenarioKey)!, [scenarioKey]);
  const [transformers, setTransformers] = useState<Transformer[]>(() => buildTransformers(SCENARIOS[0]));
  const [selectedTransformerId, setSelectedTransformerId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [maintenance, setMaintenance] = useState<Maintenance[]>(INITIAL_MAINTENANCE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [voiceEscalationActive, setVoiceEscalationActive] = useState(false);

  const pushToast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  };
  const dismissToast = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));

  // Rebuild transformer readings whenever the scenario changes.
  useEffect(() => {
    setTransformers(buildTransformers(scenario));
    if (scenario.key === 'critical') {
      pushToast({
        title: 'Critical alert triggered',
        message: 'TR-004 has crossed the critical threshold. Emergency escalation is now available.',
        variant: 'error',
      });
      setVoiceEscalationActive(true);
    } else {
      setVoiceEscalationActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioKey]);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a)));
    pushToast({ title: 'Alert acknowledged', message: `Alert ${id} has been acknowledged.`, variant: 'success' });
  };
  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
    pushToast({ title: 'Alert resolved', message: `Alert ${id} marked as resolved.`, variant: 'success' });
  };

  const addContact = (c: Omit<Contact, 'id'>) => {
    setContacts((prev) => [...prev, { ...c, id: `C${prev.length + 1}` }]);
    pushToast({ title: 'Contact added', message: `${c.name} added to escalation chain.`, variant: 'success' });
  };

  const assignTechnician = (id: string) => {
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, assignedTo: 'Amit Sharma', status: 'Inspection Pending' } : m)));
    pushToast({ title: 'Technician assigned', message: 'Amit Sharma has been assigned.', variant: 'info' });
  };
  const startInspection = (id: string) => {
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'Inspection Started' } : m)));
    pushToast({ title: 'Inspection started', message: 'Field inspection is now in progress.', variant: 'info' });
  };
  const resolveMaintenance = (id: string) => {
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'Resolved', resolvedAt: new Date().toISOString() } : m)));
    pushToast({ title: 'Maintenance resolved', message: 'Work order marked as resolved.', variant: 'success' });
  };

  const selectedTransformer = transformers.find((t) => t.id === selectedTransformerId) ?? null;
  const maintenanceById = (id: string) => maintenance.find((m) => m.id === id);

  const notificationCount = alerts.filter((a) => a.status === 'Active').length;

  const value: AppState = {
    scenario,
    scenarioKey,
    setScenarioKey,
    transformers,
    selectedTransformerId,
    selectTransformer: setSelectedTransformerId,
    selectedTransformer,
    alerts,
    acknowledgeAlert,
    resolveAlert,
    contacts,
    addContact,
    maintenance,
    maintenanceById,
    assignTechnician,
    startInspection,
    resolveMaintenance,
    toasts,
    pushToast,
    dismissToast,
    notificationCount,
    voiceEscalationActive,
    setVoiceEscalationActive,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
