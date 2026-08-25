import { useMemo, useState } from 'react';
import { useApp } from '@/store';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { RiskBadge, StatusBadge, RISK_STYLES } from '@/components/RiskBadge';
import { LiveLineChart } from '@/components/Charts';
import { generateSensorHistory } from '@/data/mockData';
import type { PageKey } from '@/types';
import {
  Zap, Heart, AlertTriangle, ShieldAlert, Bell, Wrench,
  Thermometer, Gauge, Activity, MapPin, ChevronRight, Radio, TrendingUp,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function KpiCard({ icon: Icon, label, value, suffix, color, delay = 0 }: { icon: typeof Zap; label: string; value: number; suffix?: string; color: string; delay?: number }) {
  return (
    <div className="card card-hover p-4 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-slate-100">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

export function DashboardPage({ setPage }: { setPage: (p: PageKey) => void }) {
  const { transformers, scenario, alerts, maintenance, selectTransformer, voiceEscalationActive } = useApp();
  const [chartTf, setChartTf] = useState('TR-004');
  const tf = transformers.find((t) => t.id === chartTf) ?? transformers[0];
  const history = useMemo(() => generateSensorHistory(tf), [tf]);

  const counts = {
    total: transformers.length,
    healthy: transformers.filter((t) => t.riskLevel === 'Low').length,
    high: transformers.filter((t) => t.riskLevel === 'High').length,
    critical: transformers.filter((t) => t.riskLevel === 'Critical').length,
    activeAlerts: alerts.filter((a) => a.status === 'Active').length,
    pendingMaint: maintenance.filter((m) => m.status !== 'Resolved').length,
  };

  const riskData = [
    { name: 'Low Risk', value: counts.healthy, color: RISK_STYLES.Low.dot },
    { name: 'Medium Risk', value: transformers.filter((t) => t.riskLevel === 'Medium').length, color: RISK_STYLES.Medium.dot },
    { name: 'High Risk', value: counts.high, color: RISK_STYLES.High.dot },
    { name: 'Critical Risk', value: counts.critical, color: RISK_STYLES.Critical.dot },
  ].filter((d) => d.value > 0);

  const criticalTf = transformers.find((t) => t.riskLevel === 'Critical');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-100">Rural Transformer Monitoring</h2>
        <p className="text-sm text-slate-400">Real-time health monitoring and predictive maintenance</p>
      </div>

      {/* Scenario banner */}
      <div className="card flex flex-col gap-3 border-accent-500/30 bg-accent-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/15">
            <Radio className="h-5 w-5 text-accent-400 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Live Demo Scenario</p>
            <p className="text-sm font-semibold text-slate-200">{scenario.label}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400"><Thermometer className="h-4 w-4 text-orange-400" /> {scenario.temperature}°C</span>
          <span className="flex items-center gap-1.5 text-slate-400"><Gauge className="h-4 w-4 text-accent-400" /> {scenario.load}%</span>
          <span className="flex items-center gap-1.5 text-slate-400"><Activity className="h-4 w-4 text-emerald-400" /> {scenario.voltage}V</span>
          <RiskBadge level={scenario.riskLevel} size="md" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard icon={Zap} label="Total Transformers" value={counts.total} color="bg-accent-500/15 text-accent-400" delay={0} />
        <KpiCard icon={Heart} label="Healthy" value={counts.healthy} color="bg-emerald-500/15 text-emerald-400" delay={60} />
        <KpiCard icon={AlertTriangle} label="High Risk" value={counts.high} color="bg-orange-500/15 text-orange-400" delay={120} />
        <KpiCard icon={ShieldAlert} label="Critical" value={counts.critical} color="bg-red-500/15 text-red-400" delay={180} />
        <KpiCard icon={Bell} label="Active Alerts" value={counts.activeAlerts} color="bg-yellow-500/15 text-yellow-400" delay={240} />
        <KpiCard icon={Wrench} label="Pending Maintenance" value={counts.pendingMaint} color="bg-slate-500/15 text-slate-300" delay={300} />
      </div>

      {/* Critical alert panel */}
      {criticalTf && (
        <div className="card overflow-hidden border-red-500/40 animate-slide-up">
          <div className="flex items-center gap-3 border-b border-red-500/20 bg-red-500/10 px-5 py-3">
            <ShieldAlert className="h-5 w-5 text-red-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">Critical Transformer Alert</h3>
            <span className="ml-auto text-xs font-mono text-slate-500">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="label">Transformer</p>
              <p className="text-xl font-bold text-slate-100">{criticalTf.id}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="h-4 w-4" /> {criticalTf.location}</p>
              <div className="mt-3"><RiskBadge level="Critical" size="md" /></div>
            </div>
            <div className="md:col-span-1 space-y-2">
              <p className="label">Detected Conditions</p>
              <div className="space-y-1.5 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">Temperature</span><span className="font-semibold text-orange-400">{criticalTf.temperature}°C</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Load</span><span className="font-semibold text-accent-400">{criticalTf.load}%</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Voltage</span><span className="font-semibold text-red-400">{criticalTf.voltage}V</span></p>
              </div>
            </div>
            <div className="md:col-span-1 flex flex-col justify-between">
              <div>
                <p className="label">Message</p>
                <p className="text-sm text-slate-300">
                  Multiple abnormal operating conditions detected. Immediate inspection is recommended.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="btn-ghost"
                  onClick={() => {
                    selectTransformer(criticalTf.id);
                    setPage('transformers');
                  }}
                >
                  View Transformer <ChevronRight className="h-4 w-4" />
                </button>
                <button className="btn-danger" onClick={() => setPage('voice')}>
                  Trigger AI Voice Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live chart + risk distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Live Monitoring — 24 Hours</h3>
              <p className="text-xs text-slate-500">Temperature, Load & Voltage trends</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Transformer</label>
              <select
                value={chartTf}
                onChange={(e) => setChartTf(e.target.value)}
                className="rounded-lg border border-white/10 bg-navy-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:border-accent-500 focus:outline-none"
              >
                {['TR-001', 'TR-002', 'TR-003', 'TR-004'].map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>
          <LiveLineChart data={history} />
          <p className="mt-3 text-center text-[11px] font-medium text-slate-600">
            Data Source: Prototype Simulation
          </p>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Risk Distribution</h3>
          <p className="text-xs text-slate-500">Across {counts.total} monitored transformers</p>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {riskData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transformer health table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Transformer Health Overview</h3>
            <p className="text-xs text-slate-500">Click a transformer to view detailed monitoring</p>
          </div>
          <button className="btn-ghost text-xs" onClick={() => setPage('transformers')}>
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Transformer ID</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Temperature</th>
                <th className="px-5 py-3 font-semibold">Load</th>
                <th className="px-5 py-3 font-semibold">Voltage</th>
                <th className="px-5 py-3 font-semibold">Risk</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {transformers.slice(0, 5).map((t) => (
                <tr
                  key={t.id}
                  onClick={() => {
                    selectTransformer(t.id);
                    setPage('transformers');
                  }}
                  className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-5 py-3 font-mono font-semibold text-slate-200">{t.id}</td>
                  <td className="px-5 py-3 text-slate-400">{t.location}</td>
                  <td className="px-5 py-3"><span className={t.temperature > 75 ? 'text-orange-400 font-semibold' : 'text-slate-300'}>{t.temperature}°C</span></td>
                  <td className="px-5 py-3 text-slate-300">{t.load}%</td>
                  <td className="px-5 py-3"><span className={t.voltage < 215 ? 'text-red-400 font-semibold' : 'text-slate-300'}>{t.voltage}V</span></td>
                  <td className="px-5 py-3"><RiskBadge level={t.riskLevel} /></td>
                  <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-5 py-3 text-right"><ChevronRight className="h-4 w-4 text-slate-600" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {voiceEscalationActive && (
        <div className="card flex items-center gap-3 border-red-500/30 bg-red-500/5 p-4 animate-fade-in">
          <TrendingUp className="h-5 w-5 text-red-400" />
          <p className="text-sm text-slate-300">
            Critical threshold exceeded. The <span className="font-semibold text-red-400">Voice Escalation</span> workflow is now armed and ready.
          </p>
          <button className="btn-danger ml-auto text-xs" onClick={() => setPage('voice')}>
            Go to Voice Escalation
          </button>
        </div>
      )}
    </div>
  );
}
