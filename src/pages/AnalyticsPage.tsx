import { useApp } from '@/store';
import { RISK_STYLES } from '@/components/RiskBadge';
import { ANALYTICS } from '@/data/mockData';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Clock, AlertTriangle, CheckCircle2, Hourglass, TrendingUp, BarChart3 } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#0f1c33',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e2e8f0',
};

export function AnalyticsPage() {
  const { transformers } = useApp();
  const riskData = (['Low', 'Medium', 'High', 'Critical'] as const).map((lvl) => ({
    name: lvl,
    count: transformers.filter((t) => t.riskLevel === lvl).length,
    color: RISK_STYLES[lvl].dot,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Analytics</h2>
        <p className="text-sm text-slate-400">Grid performance and incident analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4">
          <Clock className="h-5 w-5 text-accent-400" />
          <p className="mt-2 text-2xl font-bold text-slate-100"><AnimatedCounter value={2} />.<AnimatedCounter value={4} />h</p>
          <p className="text-xs text-slate-400">Avg Response Time</p>
        </div>
        <div className="card p-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="mt-2 text-2xl font-bold text-slate-100"><AnimatedCounter value={12} /></p>
          <p className="text-xs text-slate-400">Critical Alerts</p>
        </div>
        <div className="card p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="mt-2 text-2xl font-bold text-slate-100"><AnimatedCounter value={9} /></p>
          <p className="text-xs text-slate-400">Resolved</p>
        </div>
        <div className="card p-4">
          <Hourglass className="h-5 w-5 text-yellow-400" />
          <p className="mt-2 text-2xl font-bold text-slate-100"><AnimatedCounter value={3} /></p>
          <p className="text-xs text-slate-400">Pending</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk distribution */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Transformer Risk Distribution</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts by month */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Alerts by Month</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS.alertsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="High" stackId="a" fill="#fb923c" />
                <Bar dataKey="medium" name="Medium" stackId="a" fill="#facc15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg temp trend */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Average Temperature Trend</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS.avgTempTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="temp" name="Avg Temp (°C)" stroke="#fb923c" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg load trend */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Average Load Trend</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS.avgLoadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="load" name="Avg Load (%)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response time */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Maintenance Response Time</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS.responseTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="hours" name="Response (hours)" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical by village */}
        <div className="card p-5">
          <h3 className="text-base font-bold text-slate-100">Critical Alerts by Village</h3>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS.criticalByVillage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="village" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" name="Critical Alerts" fill="#ef4444" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300">
        <BarChart3 className="h-4 w-4" /> All analytics are based on prototype simulation data.
      </div>
    </div>
  );
}
