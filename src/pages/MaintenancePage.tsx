import { useApp } from '@/store';
import { StatusBadge } from '@/components/RiskBadge';
import { MAINTENANCE_HISTORY } from '@/data/mockData';
import { Wrench, UserPlus, Play, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-500/10 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

export function MaintenancePage() {
  const { maintenance, assignTechnician, startInspection, resolveMaintenance } = useApp();
  const active = maintenance.filter((m) => m.status !== 'Resolved');
  const resolved = maintenance.filter((m) => m.status === 'Resolved');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Maintenance Management</h2>
        <p className="text-sm text-slate-400">{active.length} active work orders · {resolved.length} resolved</p>
      </div>

      {/* Active maintenance cards */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Active Maintenance</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {active.map((m) => (
            <div key={m.id} className={`card p-5 ${m.priority === 'URGENT' ? 'border-red-500/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg font-bold text-slate-100">{m.transformerId}</p>
                  <p className="text-xs text-slate-400">{m.location}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${PRIORITY_STYLES[m.priority]}`}>
                  {m.priority}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-slate-500">Issue:</span>
                  <span className="text-slate-200">{m.issue}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Assigned To:</span>
                  <span className="text-slate-200">{m.assignedTo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Created:</span>
                  <span className="font-mono text-xs text-slate-400">{m.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <StatusBadge status={m.status} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {m.assignedTo.includes('unassigned') && (
                  <button className="btn-ghost text-xs" onClick={() => assignTechnician(m.id)}>
                    <UserPlus className="h-3.5 w-3.5" /> Assign Technician
                  </button>
                )}
                {m.status === 'Inspection Pending' && !m.assignedTo.includes('unassigned') && (
                  <button className="btn-ghost text-xs" onClick={() => startInspection(m.id)}>
                    <Play className="h-3.5 w-3.5" /> Mark Inspection Started
                  </button>
                )}
                {m.status === 'Inspection Started' && (
                  <button className="btn-success text-xs" onClick={() => resolveMaintenance(m.id)}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                  </button>
                )}
                {m.assignedTo.includes('unassigned') && m.status === 'Inspection Pending' && (
                  <button className="btn-ghost text-xs" onClick={() => { assignTechnician(m.id); }}>
                    <Play className="h-3.5 w-3.5" /> Start Inspection
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance history */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
          <Wrench className="h-5 w-5 text-slate-400" />
          <h3 className="text-base font-bold text-slate-100">Maintenance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Transformer</th>
                <th className="px-5 py-3 font-semibold">Issue</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Action Taken</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {MAINTENANCE_HISTORY.map((h, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 font-mono font-semibold text-slate-200">{h.transformer}</td>
                  <td className="px-5 py-3 text-slate-300">{h.issue}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{h.date}</td>
                  <td className="px-5 py-3 text-slate-300">{h.action}</td>
                  <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                </tr>
              ))}
              {resolved.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 font-mono font-semibold text-slate-200">{m.transformerId}</td>
                  <td className="px-5 py-3 text-slate-300">{m.issue}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{m.resolvedAt?.slice(0, 10) ?? m.createdAt.slice(0, 10)}</td>
                  <td className="px-5 py-3 text-slate-300">Inspection & repair completed</td>
                  <td className="px-5 py-3"><StatusBadge status="Resolved" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300">
        <AlertTriangle className="h-4 w-4" /> Maintenance records are prototype simulation data.
      </div>
    </div>
  );
}
