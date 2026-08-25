import { useEffect, useState } from 'react';
import type { PageKey } from '@/types';
import { useApp } from '@/store';
import { SCENARIOS } from '@/data/mockData';
import { Menu, Bell, User, FlaskConical } from 'lucide-react';

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  transformers: 'Transformers',
  risk: 'Risk Prediction',
  alerts: 'Alerts',
  voice: 'Voice Escalation',
  maintenance: 'Maintenance',
  contacts: 'Contacts',
  analytics: 'Analytics',
};

export function Topbar({ onMenu, page }: { onMenu: () => void; page: PageKey }) {
  const { scenarioKey, setScenarioKey, notificationCount } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-navy-900/90 px-4 backdrop-blur lg:px-6">
      <button onClick={onMenu} className="text-slate-400 hover:text-slate-200 lg:hidden">
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="hidden text-lg font-bold text-slate-100 sm:block">{PAGE_TITLES[page]}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 px-3 py-1.5 md:flex">
          <FlaskConical className="h-4 w-4 text-accent-400" />
          <span className="text-xs font-semibold text-accent-400">Prototype Simulation</span>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <label className="text-xs font-medium text-slate-500">Scenario</label>
          <select
            value={scenarioKey}
            onChange={(e) => setScenarioKey(e.target.value as typeof scenarioKey)}
            className="rounded-lg border border-white/10 bg-navy-850 px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:border-accent-500 focus:outline-none"
          >
            {SCENARIOS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden text-right md:block">
          <p className="text-xs font-semibold text-slate-300">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </p>
        </div>

        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-850 px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-200">Grid Operator</p>
            <p className="text-[10px] text-slate-500">Control Room</p>
          </div>
        </div>
      </div>
    </header>
  );
}
