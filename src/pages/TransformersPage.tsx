import { useMemo, useState } from 'react';
import { useApp } from '@/store';
import { RiskBadge, StatusBadge, RISK_STYLES } from '@/components/RiskBadge';
import { LiveLineChart, SingleLineChart } from '@/components/Charts';
import { generateSensorHistory } from '@/data/mockData';
import type { Transformer, PageKey } from '@/types';
import {
  MapPin, Thermometer, Gauge, Activity, Zap, Heart, Brain, ArrowLeft,
  AlertTriangle, TrendingUp, Clock,
} from 'lucide-react';

function MetricCard({ icon: Icon, label, value, unit, color }: { icon: typeof Zap; label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="card p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-100">{value}<span className="text-sm text-slate-500">{unit}</span></p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function TransformerDetail({ tf, onBack, setPage }: { tf: Transformer; onBack: () => void; setPage: (p: PageKey) => void }) {
  const history = useMemo(() => generateSensorHistory(tf), [tf]);
  const anomalies: string[] = [];
  if (tf.temperature > 75) anomalies.push('High temperature');
  if (tf.load > 90) anomalies.push('High load');
  if (tf.voltage < 215) anomalies.push('Voltage deviation');
  if (tf.temperature > 80) anomalies.push('Rapid temperature increase');

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to Transformers
      </button>

      <div className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15">
              <Zap className="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{tf.id}</h2>
              <p className="flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="h-4 w-4" /> {tf.location}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={tf.riskLevel} size="md" />
          <StatusBadge status={tf.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MetricCard icon={Thermometer} label="Temperature" value={tf.temperature} unit="°C" color="bg-orange-500/15 text-orange-400" />
        <MetricCard icon={Gauge} label="Load" value={tf.load} unit="%" color="bg-accent-500/15 text-accent-400" />
        <MetricCard icon={Activity} label="Voltage" value={tf.voltage} unit="V" color="bg-emerald-500/15 text-emerald-400" />
        <MetricCard icon={Zap} label="Current" value={tf.current} unit="A" color="bg-yellow-500/15 text-yellow-400" />
        <MetricCard icon={Heart} label="Health Score" value={tf.healthScore} unit="/100" color="bg-red-500/15 text-red-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Temperature Trend', data: history.map((h) => ({ time: h.time, temperature: h.temperature })), key: 'temperature', name: 'Temperature', unit: '°C', color: '#fb923c' },
          { title: 'Load Trend', data: history.map((h) => ({ time: h.time, load: h.load })), key: 'load', name: 'Load', unit: '%', color: '#38bdf8' },
          { title: 'Voltage Trend', data: history.map((h) => ({ time: h.time, voltage: h.voltage })), key: 'voltage', name: 'Voltage', unit: 'V', color: '#34d399' },
        ].map((c) => (
          <div key={c.title} className="card p-5">
            <h3 className="text-sm font-bold text-slate-100">{c.title}</h3>
            <p className="text-xs text-slate-500">Last 24 hours</p>
            <SingleLineChart data={c.data} dataKey={c.key} name={c.name} unit={c.unit} color={c.color} />
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent-400" />
          <h3 className="text-base font-bold text-slate-100">AI Risk Analysis</h3>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="label">Risk Score</p>
            <div className="flex items-end gap-2">
              <p className={`text-4xl font-extrabold ${RISK_STYLES[tf.riskLevel].text}`}>{tf.riskScore}%</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-900">
              <div className={`h-full rounded-full ${RISK_STYLES[tf.riskLevel].dot}`} style={{ width: `${tf.riskScore}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Risk Level: <span className={`font-semibold ${RISK_STYLES[tf.riskLevel].text}`}>{tf.riskLevel}</span></p>
          </div>
          <div>
            <p className="label">Detected Anomalies</p>
            {anomalies.length === 0 ? (
              <p className="text-sm text-emerald-400">No anomalies detected</p>
            ) : (
              <ul className="space-y-1.5">
                {anomalies.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertTriangle className="h-4 w-4 text-orange-400" /> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="label">Recommendation</p>
            <p className="text-sm text-slate-300">
              {tf.riskLevel === 'Critical' && 'Immediate field inspection recommended.'}
              {tf.riskLevel === 'High' && 'Schedule inspection within 24 hours.'}
              {tf.riskLevel === 'Medium' && 'Increase monitoring frequency.'}
              {tf.riskLevel === 'Low' && 'Continue routine monitoring.'}
            </p>
            {tf.riskLevel === 'Critical' && (
              <button className="btn-danger mt-4 text-xs" onClick={() => setPage('voice')}>
                Trigger AI Voice Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransformerCard({ tf, onClick }: { tf: Transformer; onClick: () => void }) {
  const s = RISK_STYLES[tf.riskLevel];
  return (
    <div className={`card card-hover cursor-pointer p-4 ${tf.riskLevel === 'Critical' ? 'border-red-500/30' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-lg font-bold text-slate-100">{tf.id}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> {tf.location}</p>
        </div>
        <RiskBadge level={tf.riskLevel} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-navy-900 py-2">
          <p className="text-base font-bold text-orange-400">{tf.temperature}°C</p>
          <p className="text-[10px] text-slate-500">Temp</p>
        </div>
        <div className="rounded-lg bg-navy-900 py-2">
          <p className="text-base font-bold text-accent-400">{tf.load}%</p>
          <p className="text-[10px] text-slate-500">Load</p>
        </div>
        <div className="rounded-lg bg-navy-900 py-2">
          <p className="text-base font-bold text-emerald-400">{tf.voltage}V</p>
          <p className="text-[10px] text-slate-500">Volt</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" /> {new Date(tf.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <button className="text-xs font-semibold text-accent-400 hover:text-accent-300">View Details →</button>
      </div>
    </div>
  );
}

export function TransformersPage({ setPage }: { setPage: (p: PageKey) => void }) {
  const { transformers, selectedTransformerId, selectTransformer } = useApp();
  const [filter, setFilter] = useState<'All' | 'Low' | 'Medium' | 'High' | 'Critical'>('All');
  const [search, setSearch] = useState('');

  const selected = transformers.find((t) => t.id === selectedTransformerId);
  if (selected) {
    return <TransformerDetail tf={selected} onBack={() => selectTransformer(null)} setPage={setPage} />;
  }

  const filtered = transformers.filter((t) => {
    if (filter !== 'All' && t.riskLevel !== filter) return false;
    if (search && !`${t.id} ${t.location}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Transformers</h2>
        <p className="text-sm text-slate-400">{transformers.length} rural distribution transformers under monitoring</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input sm:max-w-xs"
          placeholder="Search by ID or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Low', 'Medium', 'High', 'Critical'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === f ? 'bg-accent-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tf) => (
          <TransformerCard key={tf.id} tf={tf} onClick={() => selectTransformer(tf.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-10 text-center text-sm text-slate-500">No transformers match your filter.</div>
      )}
    </div>
  );
}
