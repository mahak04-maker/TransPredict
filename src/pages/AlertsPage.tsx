import { useState } from 'react';
import { useApp } from '@/store';
import { RiskBadge, StatusBadge } from '@/components/RiskBadge';
import { ConfirmDialog } from '@/components/Modal';
import type { PageKey } from '@/types';
import { Eye, CheckCircle2, Bell, Search } from 'lucide-react';

export function AlertsPage({ setPage }: { setPage: (p: PageKey) => void }) {
  const { alerts, acknowledgeAlert, resolveAlert, selectTransformer } = useApp();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Resolved'>('All');
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = alerts.filter((a) => {
    if (filter === 'All') return true;
    if (filter === 'Resolved') return a.status === 'Resolved';
    return a.riskLevel === filter && a.status !== 'Resolved';
  }).filter((a) => !search || `${a.id} ${a.transformerId} ${a.location}`.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    All: alerts.length,
    Critical: alerts.filter((a) => a.riskLevel === 'Critical' && a.status !== 'Resolved').length,
    High: alerts.filter((a) => a.riskLevel === 'High' && a.status !== 'Resolved').length,
    Medium: alerts.filter((a) => a.riskLevel === 'Medium' && a.status !== 'Resolved').length,
    Resolved: alerts.filter((a) => a.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Alert Management</h2>
          <p className="text-sm text-slate-400">{alerts.filter((a) => a.status === 'Active').length} active alerts requiring attention</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5">
          <Bell className="h-4 w-4 text-red-400" />
          <span className="text-xs font-semibold text-red-400">{counts.Critical} Critical</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search alerts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Critical', 'High', 'Medium', 'Resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === f ? 'bg-accent-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {f}
              <span className={`rounded-full px-1.5 text-[10px] ${filter === f ? 'bg-white/20' : 'bg-navy-900'}`}>{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Alert ID</th>
                <th className="px-5 py-3 font-semibold">Transformer</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Risk</th>
                <th className="px-5 py-3 font-semibold">Detected Condition</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                  <td className="px-5 py-3 font-mono font-semibold text-slate-200">{a.id}</td>
                  <td className="px-5 py-3 font-mono text-slate-300">{a.transformerId}</td>
                  <td className="px-5 py-3 text-slate-400">{a.location}</td>
                  <td className="px-5 py-3"><RiskBadge level={a.riskLevel} /></td>
                  <td className="px-5 py-3 text-slate-300">{a.reason}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{a.timestamp}</td>
                  <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn-ghost px-2.5 py-1.5 text-xs"
                        onClick={() => {
                          selectTransformer(a.transformerId);
                          setPage('transformers');
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      {a.status === 'Active' && (
                        <button className="btn-success px-2.5 py-1.5 text-xs" onClick={() => setConfirmId(a.id)}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
                        </button>
                      )}
                      {a.status === 'Acknowledged' && (
                        <button className="btn-ghost px-2.5 py-1.5 text-xs" onClick={() => resolveAlert(a.id)}>
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">No alerts match the current filter.</div>
        )}
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && acknowledgeAlert(confirmId)}
        title="Acknowledge Alert"
        message="Acknowledging this alert will mark it as reviewed and stop automated escalation for it."
        confirmLabel="Acknowledge"
      />
    </div>
  );
}
