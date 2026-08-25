import type {
  Transformer,
  Alert,
  Contact,
  Maintenance,
  SensorReading,
  Scenario,
} from '@/types';

export const SCENARIOS: Scenario[] = [
  { key: 'normal', label: 'Normal Operation', temperature: 52, load: 60, voltage: 230, current: 28, humidity: 55, riskLevel: 'Low' },
  { key: 'increasing', label: 'Increasing Load', temperature: 68, load: 82, voltage: 224, current: 36, humidity: 62, riskLevel: 'Medium' },
  { key: 'overheating', label: 'Overheating', temperature: 78, load: 91, voltage: 215, current: 40, humidity: 70, riskLevel: 'High' },
  { key: 'critical', label: 'Critical Transformer', temperature: 86, load: 97, voltage: 207, current: 42, humidity: 78, riskLevel: 'Critical' },
];

export const BASE_TRANSFORMERS: Omit<Transformer, 'temperature' | 'load' | 'voltage' | 'current' | 'humidity' | 'riskScore' | 'riskLevel' | 'status' | 'healthScore' | 'lastUpdated'>[] = [
  { id: 'TR-001', location: 'Village Rampur', capacityKVA: 100, installedYear: 2019 },
  { id: 'TR-002', location: 'Village Lakhanpur', capacityKVA: 63, installedYear: 2017 },
  { id: 'TR-003', location: 'Village Bhatgaon', capacityKVA: 100, installedYear: 2016 },
  { id: 'TR-004', location: 'Village Kharsia', capacityKVA: 160, installedYear: 2015 },
  { id: 'TR-005', location: 'Village Kirodimal', capacityKVA: 63, installedYear: 2020 },
  { id: 'TR-006', location: 'Village Chhuriya', capacityKVA: 100, installedYear: 2018 },
  { id: 'TR-007', location: 'Village Pithora', capacityKVA: 63, installedYear: 2021 },
  { id: 'TR-008', location: 'Village Saraipali', capacityKVA: 100, installedYear: 2019 },
  { id: 'TR-009', location: 'Village Bagicha', capacityKVA: 160, installedYear: 2014 },
  { id: 'TR-010', location: 'Village Kasdol', capacityKVA: 63, installedYear: 2020 },
  { id: 'TR-011', location: 'Village Batouli', capacityKVA: 100, installedYear: 2018 },
  { id: 'TR-012', location: 'Village Simga', capacityKVA: 63, installedYear: 2017 },
  { id: 'TR-013', location: 'Village Aarang', capacityKVA: 100, installedYear: 2019 },
  { id: 'TR-014', location: 'Village Kharsiya', capacityKVA: 160, installedYear: 2016 },
  { id: 'TR-015', location: 'Village Dongargaon', capacityKVA: 63, installedYear: 2021 },
  { id: 'TR-016', location: 'Village Rajim', capacityKVA: 100, installedYear: 2018 },
  { id: 'TR-017', location: 'Village Fingeshwar', capacityKVA: 63, installedYear: 2020 },
  { id: 'TR-018', location: 'Village Gariaband', capacityKVA: 100, installedYear: 2017 },
  { id: 'TR-019', location: 'Village Mainpur', capacityKVA: 63, installedYear: 2019 },
  { id: 'TR-020', location: 'Village Deobhog', capacityKVA: 100, installedYear: 2018 },
  { id: 'TR-021', location: 'Village Mahasamund', capacityKVA: 160, installedYear: 2015 },
  { id: 'TR-022', location: 'Village Basna', capacityKVA: 63, installedYear: 2020 },
  { id: 'TR-023', location: 'Village Baloda', capacityKVA: 100, installedYear: 2019 },
  { id: 'TR-024', location: 'Village Sanjari', capacityKVA: 63, installedYear: 2021 },
];

// Per-transformer baseline offsets so not every transformer reads identically.
const OFFSETS: Record<string, { temp: number; load: number; volt: number }> = {
  'TR-001': { temp: 0, load: 2, volt: 1 },
  'TR-002': { temp: 14, load: 16, volt: -5 },
  'TR-003': { temp: 22, load: 29, volt: -12 },
  'TR-004': { temp: 32, load: 35, volt: -23 },
  'TR-005': { temp: 4, load: 3, volt: -1 },
  'TR-006': { temp: 2, load: 6, volt: 0 },
  'TR-007': { temp: 1, load: 4, volt: 2 },
  'TR-008': { temp: 6, load: 10, volt: -3 },
  'TR-009': { temp: 18, load: 20, volt: -8 },
  'TR-010': { temp: 3, load: 5, volt: 1 },
  'TR-011': { temp: 8, load: 12, volt: -4 },
  'TR-012': { temp: 2, load: 3, volt: 2 },
  'TR-013': { temp: 5, load: 8, volt: -2 },
  'TR-014': { temp: 20, load: 24, volt: -10 },
  'TR-015': { temp: 1, load: 2, volt: 3 },
  'TR-016': { temp: 4, load: 6, volt: 0 },
  'TR-017': { temp: 2, load: 4, volt: 1 },
  'TR-018': { temp: 10, load: 14, volt: -6 },
  'TR-019': { temp: 3, load: 5, volt: 2 },
  'TR-020': { temp: 6, load: 9, volt: -3 },
  'TR-021': { temp: 16, load: 18, volt: -7 },
  'TR-022': { temp: 2, load: 3, volt: 2 },
  'TR-023': { temp: 5, load: 7, volt: -1 },
  'TR-024': { temp: 1, load: 2, volt: 3 },
};

export function riskFromValues(temp: number, load: number, voltage: number) {
  let score = 0;
  score += Math.max(0, (temp - 55) * 2.2);
  score += Math.max(0, (load - 70) * 1.6);
  score += Math.max(0, (235 - voltage) * 1.4);
  score = Math.min(100, Math.round(score));
  let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (score >= 75) level = 'Critical';
  else if (score >= 50) level = 'High';
  else if (score >= 25) level = 'Medium';
  return { riskScore: score, riskLevel: level };
}

export function statusFromRisk(level: 'Low' | 'Medium' | 'High' | 'Critical') {
  if (level === 'Critical') return 'Immediate Action' as const;
  if (level === 'High') return 'Inspection Needed' as const;
  if (level === 'Medium') return 'Monitor' as const;
  return 'Normal' as const;
}

export function buildTransformers(scenario: Scenario): Transformer[] {
  return BASE_TRANSFORMERS.map((base) => {
    const off = OFFSETS[base.id] ?? { temp: 0, load: 0, volt: 0 };
    const temperature = Math.round(scenario.temperature + off.temp);
    const load = Math.min(100, Math.round(scenario.load + off.load));
    const voltage = Math.round(scenario.voltage + off.volt);
    const current = Math.round((load / 100) * base.capacityKVA * 0.55 + 8);
    const humidity = Math.round(scenario.humidity + (off.temp > 15 ? 8 : 0));
    const { riskScore, riskLevel } = riskFromValues(temperature, load, voltage);
    const healthScore = Math.max(4, 100 - riskScore - Math.round(off.temp / 3));
    return {
      ...base,
      temperature,
      load,
      voltage,
      current,
      humidity,
      riskScore,
      riskLevel,
      status: statusFromRisk(riskLevel),
      healthScore,
      lastUpdated: new Date().toISOString(),
    };
  });
}

export function generateSensorHistory(
  transformer: Transformer,
  hours = 24,
): SensorReading[] {
  const out: SensorReading[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const wave = Math.sin((hours - i) / 4) * 4;
    const drift = (hours - i) * (transformer.riskScore / 24) * 0.3;
    out.push({
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature: Math.round(transformer.temperature + wave + drift),
      load: Math.min(100, Math.round(transformer.load + wave * 1.5)),
      voltage: Math.round(transformer.voltage - wave * 0.8 - drift * 0.4),
    });
  }
  return out;
}

export const INITIAL_ALERTS: Alert[] = [
  { id: 'ALT-1024', transformerId: 'TR-004', location: 'Village Kharsia', riskLevel: 'Critical', reason: 'High temperature + high load + voltage abnormality', timestamp: '10:42 AM', status: 'Active' },
  { id: 'ALT-1023', transformerId: 'TR-003', location: 'Village Bhatgaon', riskLevel: 'High', reason: 'Sustained high load (91%)', timestamp: '10:15 AM', status: 'Active' },
  { id: 'ALT-1022', transformerId: 'TR-014', location: 'Village Kharsiya', riskLevel: 'High', reason: 'Temperature above threshold', timestamp: '09:58 AM', status: 'Acknowledged' },
  { id: 'ALT-1021', transformerId: 'TR-009', location: 'Village Bagicha', riskLevel: 'Medium', reason: 'Load trending upward', timestamp: '09:30 AM', status: 'Resolved' },
  { id: 'ALT-1020', transformerId: 'TR-002', location: 'Village Lakhanpur', riskLevel: 'Medium', reason: 'Voltage deviation detected', timestamp: '08:50 AM', status: 'Resolved' },
  { id: 'ALT-1019', transformerId: 'TR-021', location: 'Village Mahasamund', riskLevel: 'Medium', reason: 'Humidity + temperature rise', timestamp: '08:12 AM', status: 'Resolved' },
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: 'C1', name: 'Rajesh Kumar', role: 'Primary Officer', phone: '+91 98XXXXXX01', priority: 1, status: 'Available', availability: 'On-duty', timeoutSeconds: 30 },
  { id: 'C2', name: 'Sunil Verma', role: 'Secondary Officer', phone: '+91 98XXXXXX02', priority: 2, status: 'Available', availability: 'On-duty', timeoutSeconds: 30 },
  { id: 'C3', name: 'Amit Sharma', role: 'Technician', phone: '+91 98XXXXXX03', priority: 3, status: 'Available', availability: 'Field-ready', timeoutSeconds: 45 },
  { id: 'C4', name: 'Priya Nair', role: 'Junior Engineer', phone: '+91 98XXXXXX04', priority: 4, status: 'Available', availability: 'On-call', timeoutSeconds: 60 },
  { id: 'C5', name: 'Vikram Singh', role: 'Backup Contact', phone: '+91 98XXXXXX05', priority: 5, status: 'On Leave', availability: 'Off-duty', timeoutSeconds: 90 },
];

export const INITIAL_MAINTENANCE: Maintenance[] = [
  { id: 'M1', transformerId: 'TR-004', location: 'Village Kharsia', issue: 'High temperature + high load', priority: 'URGENT', assignedTo: 'Technician (unassigned)', status: 'Inspection Pending', createdAt: '2026-08-25 10:42' },
  { id: 'M2', transformerId: 'TR-003', location: 'Village Bhatgaon', issue: 'Sustained high load', priority: 'HIGH', assignedTo: 'Amit Sharma', status: 'Inspection Started', createdAt: '2026-08-25 09:20' },
  { id: 'M3', transformerId: 'TR-009', location: 'Village Bagicha', issue: 'Oil level low', priority: 'MEDIUM', assignedTo: 'Field Crew B', status: 'Inspection Pending', createdAt: '2026-08-24 16:10' },
  { id: 'M4', transformerId: 'TR-014', location: 'Village Kharsiya', issue: 'Voltage regulator fault', priority: 'HIGH', assignedTo: 'Priya Nair', status: 'Inspection Pending', createdAt: '2026-08-24 11:05' },
  { id: 'M5', transformerId: 'TR-021', location: 'Village Mahasamund', issue: 'Annual preventive check', priority: 'LOW', assignedTo: 'Field Crew A', status: 'Inspection Pending', createdAt: '2026-08-23 14:30' },
];

export const MAINTENANCE_HISTORY: { transformer: string; issue: string; date: string; action: string; status: string }[] = [
  { transformer: 'TR-009', issue: 'Oil replacement', date: '2026-08-12', action: 'Oil refilled, gasket replaced', status: 'Resolved' },
  { transformer: 'TR-002', issue: 'Loose connection', date: '2026-08-08', action: 'Terminal re-torqued', status: 'Resolved' },
  { transformer: 'TR-014', issue: 'Cooling fan fault', date: '2026-07-29', action: 'Fan motor replaced', status: 'Resolved' },
  { transformer: 'TR-021', issue: 'Bushing cleaning', date: '2026-07-15', action: 'Bushings cleaned, tested', status: 'Resolved' },
  { transformer: 'TR-003', issue: 'Tap changer service', date: '2026-07-02', action: 'Tap changer serviced', status: 'Resolved' },
];

export const ANALYTICS = {
  alertsByMonth: [
    { month: 'Mar', critical: 2, high: 5, medium: 9 },
    { month: 'Apr', critical: 1, high: 7, medium: 11 },
    { month: 'May', critical: 4, high: 8, medium: 12 },
    { month: 'Jun', critical: 3, high: 6, medium: 10 },
    { month: 'Jul', critical: 2, high: 9, medium: 8 },
    { month: 'Aug', critical: 5, high: 7, medium: 6 },
  ],
  responseTime: [
    { week: 'W1', hours: 4.2 },
    { week: 'W2', hours: 3.6 },
    { week: 'W3', hours: 2.9 },
    { week: 'W4', hours: 2.4 },
  ],
  criticalByVillage: [
    { village: 'Kharsia', count: 5 },
    { village: 'Bhatgaon', count: 3 },
    { village: 'Kharsiya', count: 2 },
    { village: 'Bagicha', count: 1 },
    { village: 'Mahasamund', count: 1 },
  ],
  avgTempTrend: [
    { day: 'Mon', temp: 58 },
    { day: 'Tue', temp: 61 },
    { day: 'Wed', temp: 64 },
    { day: 'Thu', temp: 67 },
    { day: 'Fri', temp: 63 },
    { day: 'Sat', temp: 60 },
    { day: 'Sun', temp: 59 },
  ],
  avgLoadTrend: [
    { day: 'Mon', load: 68 },
    { day: 'Tue', load: 72 },
    { day: 'Wed', load: 78 },
    { day: 'Thu', load: 81 },
    { day: 'Fri', load: 75 },
    { day: 'Sat', load: 70 },
    { day: 'Sun', load: 66 },
  ],
};
