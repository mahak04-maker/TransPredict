import type { PageKey } from '@/types';
import { useApp } from '@/store';
import {
  LayoutDashboard,
  Zap,
  Brain,
  Bell,
  PhoneCall,
  Wrench,
  Users,
  BarChart3,
  Activity,
  ShieldAlert,
} from 'lucide-react';

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transformers', label: 'Transformers', icon: Zap },
  { key: 'risk', label: 'Risk Prediction', icon: Brain },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'voice', label: 'Voice Escalation', icon: PhoneCall },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'contacts', label: 'Contacts', icon: Users },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({
  page,
  setPage,
  open,
  onClose,
}: {
  page: PageKey;
  setPage: (p: PageKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { voiceEscalationActive, alerts } = useApp();
  const activeAlerts = alerts.filter((a) => a.status === 'Active').length;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-navy-900 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-slate-100">SmartGrid</p>
            <p className="text-xs font-semibold text-accent-400">SENTINEL</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = page === item.key;
            const Icon = item.icon;
            const badge = item.key === 'alerts' && activeAlerts > 0 ? activeAlerts : null;
            const pulse = item.key === 'voice' && voiceEscalationActive;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key);
                  onClose();
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-accent-500/15 text-accent-400 shadow-glow'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? '' : 'group-hover:text-slate-300'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {pulse && <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />}
                {badge && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="rounded-xl bg-navy-850 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Prototype</p>
            <p className="mt-1 text-xs text-slate-400">
              Simulation data only. Not connected to live grid infrastructure.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
