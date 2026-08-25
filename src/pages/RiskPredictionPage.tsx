import { useState } from 'react';
import { useApp } from '@/store';
import { RiskBadge, RISK_STYLES } from '@/components/RiskBadge';
import { riskFromValues } from '@/data/mockData';
import {
  Brain, Play, Loader2, AlertTriangle, Cpu, Sparkles, Thermometer, Zap, Activity, Gauge, Droplets,
} from 'lucide-react';

type Phase = 'idle' | 'analyzing' | 'result';

export function RiskPredictionPage() {
  const { transformers } = useApp();
  const criticalDefault = transformers.find((t) => t.riskLevel === 'Critical') ?? transformers[3];
  const [tfId, setTfId] = useState(criticalDefault.id);
  const tf = transformers.find((t) => t.id === tfId) ?? criticalDefault;

  const [temp, setTemp] = useState(tf.temperature);
  const [current, setCurrent] = useState(tf.current);
  const [voltage, setVoltage] = useState(tf.voltage);
  const [load, setLoad] = useState(tf.load);
  const [humidity, setHumidity] = useState(tf.humidity);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<{ riskScore: number; riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' } | null>(null);

  const onTfChange = (id: string) => {
    const t = transformers.find((x) => x.id === id);
    if (!t) return;
    setTfId(id);
    setTemp(t.temperature);
    setCurrent(t.current);
    setVoltage(t.voltage);
    setLoad(t.load);
    setHumidity(t.humidity);
    setPhase('idle');
    setResult(null);
  };

  const runPrediction = () => {
    setPhase('analyzing');
    setResult(null);
    setTimeout(() => {
      setResult(riskFromValues(temp, load, voltage));
      setPhase('result');
    }, 2200);
  };

  const patterns: string[] = [];
  if (load > 90) patterns.push('High load condition');
  if (temp > 75) patterns.push('Elevated temperature');
  if (voltage < 215) patterns.push('Voltage abnormality');
  if (temp > 80) patterns.push('Increasing temperature trend');
  if (humidity > 70) patterns.push('High humidity accelerating insulation ageing');

  const inputs = [
    { icon: Thermometer, label: 'Temperature', value: temp, set: setTemp, min: 20, max: 120, unit: '°C', color: 'text-orange-400' },
    { icon: Zap, label: 'Current', value: current, set: setCurrent, min: 0, max: 100, unit: 'A', color: 'text-yellow-400' },
    { icon: Activity, label: 'Voltage', value: voltage, set: setVoltage, min: 180, max: 260, unit: 'V', color: 'text-emerald-400' },
    { icon: Gauge, label: 'Load', value: load, set: setLoad, min: 0, max: 100, unit: '%', color: 'text-accent-400' },
    { icon: Droplets, label: 'Humidity', value: humidity, set: setHumidity, min: 20, max: 100, unit: '%', color: 'text-slate-300' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">AI Transformer Risk Prediction</h2>
        <p className="text-sm text-slate-400">Simulated ML inference over real-time sensor parameters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input panel */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent-400" />
              <h3 className="text-base font-bold text-slate-100">Sensor Input Parameters</h3>
            </div>
            <select
              value={tfId}
              onChange={(e) => onTfChange(e.target.value)}
              className="rounded-lg border border-white/10 bg-navy-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:border-accent-500 focus:outline-none"
            >
              {transformers.slice(0, 8).map((t) => (
                <option key={t.id} value={t.id}>{t.id} — {t.location}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {inputs.map((inp) => {
              const Icon = inp.icon;
              return (
                <div key={inp.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Icon className={`h-4 w-4 ${inp.color}`} /> {inp.label}
                    </label>
                    <span className="font-mono text-sm font-semibold text-slate-200">{inp.value}{inp.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={inp.min}
                    max={inp.max}
                    value={inp.value}
                    onChange={(e) => { inp.set(Number(e.target.value)); setPhase('idle'); setResult(null); }}
                    className="w-full accent-accent-500"
                  />
                </div>
              );
            })}
          </div>

          <button
            className="btn-primary mt-6 w-full"
            onClick={runPrediction}
            disabled={phase === 'analyzing'}
          >
            {phase === 'analyzing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {phase === 'analyzing' ? 'Analyzing...' : 'Run Risk Prediction'}
          </button>
        </div>

        {/* Result panel */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent-400" />
            <h3 className="text-base font-bold text-slate-100">Prediction Output</h3>
          </div>

          {phase === 'idle' && (
            <div className="flex h-[340px] flex-col items-center justify-center text-center text-slate-500">
              <Sparkles className="mb-3 h-10 w-10 text-slate-600" />
              <p className="text-sm">Adjust the sensor parameters and run a prediction to see the simulated risk score.</p>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="flex h-[340px] flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-accent-500/40" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/15">
                  <Loader2 className="h-10 w-10 animate-spin text-accent-400" />
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-200">Analyzing Sensor Data...</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <p className="animate-fade-in">Normalizing input vector...</p>
                <p className="animate-fade-in" style={{ animationDelay: '400ms' }}>Running risk classifier...</p>
                <p className="animate-fade-in" style={{ animationDelay: '900ms' }}>Computing anomaly patterns...</p>
              </div>
            </div>
          )}

          {phase === 'result' && result && (
            <div className="animate-slide-up space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-navy-900 p-4">
                <div>
                  <p className="label">Risk Score</p>
                  <p className={`text-4xl font-extrabold ${RISK_STYLES[result.riskLevel].text}`}>{result.riskScore}%</p>
                </div>
                <div className="text-right">
                  <p className="label">Risk Level</p>
                  <RiskBadge level={result.riskLevel} size="md" />
                </div>
              </div>

              <div>
                <p className="label">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-900">
                    <div className="h-full rounded-full bg-accent-500" style={{ width: '88%' }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Demo Prediction</span>
                </div>
              </div>

              <div>
                <p className="label">Detected Patterns</p>
                <ul className="space-y-1.5">
                  {patterns.length === 0 ? (
                    <li className="text-sm text-emerald-400">No anomalous patterns detected.</li>
                  ) : (
                    patterns.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                        <AlertTriangle className="h-4 w-4 text-orange-400" /> {p}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
                <p className="text-xs text-yellow-300">
                  <strong>Prototype ML Simulation</strong> — Replace with a trained model during production deployment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
