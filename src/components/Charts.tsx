import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Area, AreaChart,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#0f1c33',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e2e8f0',
};

export function LiveLineChart({ data, height = 260 }: { data: { time: string; temperature: number; load: number; voltage: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis yAxisId="temp" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis yAxisId="volt" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
        <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#fb923c" strokeWidth={2} dot={false} />
        <Line yAxisId="temp" type="monotone" dataKey="load" name="Load (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
        <Line yAxisId="volt" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#34d399" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SingleLineChart({ data, dataKey, name, color, unit, height = 180 }: { data: any[]; dataKey: string; name: string; color: string; unit?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={`sg-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={dataKey} name={`${name}${unit ? ` (${unit})` : ''}`} stroke={color} strokeWidth={2} fill={`url(#sg-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MiniArea({ data, dataKey, color, height = 80 }: { data: any[]; dataKey: string; color: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey}-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
