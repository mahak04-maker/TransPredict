import type { RiskLevel } from '@/types';

export const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Low' },
  Medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Medium' },
  High: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-400', label: 'High' },
  Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Critical' },
};

export const RISK_CHART_COLORS: Record<RiskLevel, string> = {
  Low: '#34d399',
  Medium: '#facc15',
  High: '#fb923c',
  Critical: '#ef4444',
};

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const s = RISK_STYLES[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${s.bg} ${s.text} ${s.border} font-semibold ${size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Normal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Monitor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'Inspection Needed': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    'Immediate Action': 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
    Active: 'bg-red-500/10 text-red-400 border-red-500/30',
    Acknowledged: 'bg-accent-500/10 text-accent-400 border-accent-500/30',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Inspection Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'Inspection Started': 'bg-accent-500/10 text-accent-400 border-accent-500/30',
    Unassigned: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${map[status] ?? map.Unassigned}`}>
      {status}
    </span>
  );
}
