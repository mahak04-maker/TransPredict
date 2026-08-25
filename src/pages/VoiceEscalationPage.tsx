import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/store';
import { Modal } from '@/components/Modal';
import type { Contact, EscalationStep } from '@/types';
import {
  PhoneCall, Phone, PhoneOff, CheckCircle2, ShieldAlert, Clock, User, ChevronDown,
  PhoneIncoming, Volume2, AlertTriangle, Sparkles, X,
} from 'lucide-react';

type CallPhase = 'idle' | 'initializing' | 'calling' | 'in-call' | 'no-answer' | 'acknowledged';

export function VoiceEscalationPage() {
  const { transformers, contacts, voiceEscalationActive, pushToast, acknowledgeAlert } = useApp();
  const criticalTf = transformers.find((t) => t.riskLevel === 'Critical') ?? transformers[3];

  const [steps, setSteps] = useState<EscalationStep[]>(() =>
    contacts.map((c) => ({ contact: c, status: 'Waiting' as const })),
  );
  const [phase, setPhase] = useState<CallPhase>('idle');
  const [activeIdx, setActiveIdx] = useState(0);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const acknowledgedRef = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const reset = () => {
    clearTimers();
    acknowledgedRef.current = false;
    setSteps(contacts.map((c) => ({ contact: c, status: 'Waiting' as const })));
    setPhase('idle');
    setActiveIdx(0);
    setCallModalOpen(false);
  };

  const startDemo = () => {
    reset();
    setPhase('initializing');
    timers.current.push(setTimeout(() => {
      setPhase('calling');
      callContact(0);
    }, 1800));
  };

  const callContact = (idx: number) => {
    if (acknowledgedRef.current) return;
    setActiveIdx(idx);
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, status: 'Calling' } : s)));
    setPhase('calling');
    setCallModalOpen(true);

    // Auto "no answer" after 6s if not acknowledged
    timers.current.push(setTimeout(() => {
      if (acknowledgedRef.current) return;
      handleNoAnswer(idx);
    }, 6000));
  };

  const handleNoAnswer = (idx: number) => {
    clearTimers();
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, status: 'No Answer' } : s)));
    setPhase('no-answer');
    setCallModalOpen(false);

    if (idx + 1 < contacts.length) {
      timers.current.push(setTimeout(() => {
        setPhase('calling');
        callContact(idx + 1);
      }, 1600));
    } else {
      // All exhausted
      timers.current.push(setTimeout(() => setPhase('idle'), 2000));
    }
  };

  const handleAcknowledge = () => {
    acknowledgedRef.current = true;
    clearTimers();
    const idx = activeIdx;
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, status: 'Acknowledged' } : s)));
    setPhase('acknowledged');
    setCallModalOpen(false);
    const activeAlert = `ALT-1024`;
    acknowledgeAlert(activeAlert);
    pushToast({ title: 'Alert acknowledged', message: 'Maintenance response initiated. Escalation stopped.', variant: 'success' });
  };

  const statusColor = (s: EscalationStep['status']) => {
    if (s === 'Calling') return 'text-accent-400';
    if (s === 'Acknowledged') return 'text-emerald-400';
    if (s === 'No Answer') return 'text-red-400';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">AI Voice Emergency Escalation</h2>
        <p className="text-sm text-slate-400">Automated voice-call escalation chain for critical transformer alerts</p>
      </div>

      {/* Active alert banner */}
      <div className={`card overflow-hidden ${criticalTf.riskLevel === 'Critical' ? 'border-red-500/40' : 'border-white/5'}`}>
        <div className="flex items-center gap-3 border-b border-white/5 bg-red-500/10 px-5 py-3">
          <ShieldAlert className={`h-5 w-5 text-red-400 ${criticalTf.riskLevel === 'Critical' ? 'animate-pulse' : ''}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">Active Alert</h3>
          {voiceEscalationActive && <span className="ml-auto rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold uppercase text-red-400">Escalation Armed</span>}
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-4">
          <div><p className="label">Transformer</p><p className="font-mono font-bold text-slate-100">{criticalTf.id}</p></div>
          <div><p className="label">Location</p><p className="text-sm text-slate-300">{criticalTf.location}</p></div>
          <div><p className="label">Risk</p><RiskBadgeLite level={criticalTf.riskLevel} /></div>
          <div><p className="label">Reason</p><p className="text-sm text-slate-300">High temperature + high load + voltage abnormality</p></div>
        </div>
      </div>

      {/* Start button */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-navy-850 p-8 text-center">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${phase === 'initializing' || phase === 'calling' ? 'animate-pulse-ring' : ''} border-2 border-accent-500/40`} />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15">
            <PhoneCall className="h-8 w-8 text-accent-400" />
          </div>
        </div>
        <p className="text-sm text-slate-400">
          {phase === 'idle' && 'Start the AI voice-call demo to simulate the emergency escalation workflow.'}
          {phase === 'initializing' && 'AI Voice Agent Initializing...'}
          {phase === 'calling' && `Calling ${steps[activeIdx]?.contact.role}...`}
          {phase === 'no-answer' && `${steps[activeIdx]?.contact.role} did not respond.`}
          {phase === 'acknowledged' && 'Alert acknowledged. Escalation stopped.'}
        </p>
        <button
          className="btn-primary px-8 py-3 text-base"
          onClick={startDemo}
          disabled={phase === 'initializing' || phase === 'calling' || phase === 'no-answer'}
        >
          <PhoneCall className="h-5 w-5" />
          {phase === 'idle' || phase === 'acknowledged' ? 'Start AI Voice Call Demo' : 'Call In Progress...'}
        </button>
        {(phase !== 'idle') && (
          <button className="text-xs text-slate-500 hover:text-slate-300" onClick={reset}>Reset Demo</button>
        )}
      </div>

      {/* Escalation timeline */}
      <div className="card p-5">
        <h3 className="mb-4 text-base font-bold text-slate-100">Escalation Chain</h3>
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const c = step.contact;
            const isActive = idx === activeIdx && (phase === 'calling' || phase === 'no-answer');
            return (
              <div key={c.id}>
                <div className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                  isActive ? 'border-accent-500/40 bg-accent-500/5 shadow-glow' :
                  step.status === 'Acknowledged' ? 'border-emerald-500/40 bg-emerald-500/5' :
                  step.status === 'No Answer' ? 'border-red-500/30 bg-red-500/5' :
                  'border-white/5 bg-navy-900'
                }`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-850">
                    {step.status === 'Acknowledged' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> :
                     step.status === 'No Answer' ? <PhoneOff className="h-5 w-5 text-red-400" /> :
                     step.status === 'Calling' ? <PhoneIncoming className="h-5 w-5 text-accent-400 animate-pulse" /> :
                     <User className="h-5 w-5 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-200">{c.name}</p>
                      <span className="rounded-full bg-navy-850 px-2 py-0.5 text-[10px] font-medium text-slate-400">Priority {c.priority}</span>
                    </div>
                    <p className="text-xs text-slate-500">{c.role} · {c.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold uppercase ${statusColor(step.status)}`}>
                      {step.status === 'Calling' && 'Calling...'}
                      {step.status === 'Waiting' && 'Waiting'}
                      {step.status === 'No Answer' && 'No Answer'}
                      {step.status === 'Acknowledged' && 'Acknowledged'}
                    </p>
                    {isActive && (
                      <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" /> {c.timeoutSeconds}s timeout
                      </p>
                    )}
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300">
          Demo phone numbers are masked. No real calls are placed — the voice agent is simulated for the prototype.
        </p>
      </div>

      {/* Call modal */}
      <Modal open={callModalOpen} onClose={() => {}}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15">
            <Volume2 className="h-8 w-8 text-accent-400 animate-pulse" />
          </div>
          <div className="mb-1 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <p className="text-sm font-bold uppercase tracking-wider text-accent-400">AI Voice Assistant</p>
          </div>
          <p className="text-xs text-slate-500">Calling {steps[activeIdx]?.contact.role} · {steps[activeIdx]?.contact.name}</p>

          <div className="my-5 space-y-3 rounded-xl bg-navy-900 p-4 text-left">
            <p className="text-sm text-slate-200">
              <AlertTriangle className="mr-1 inline h-4 w-4 text-red-400" />
              Critical transformer alert.
            </p>
            <p className="text-sm text-slate-300">
              Transformer <span className="font-semibold text-slate-100">{criticalTf.id}</span> at {criticalTf.location} has reached critical risk.
            </p>
            <p className="text-sm text-slate-300">
              Temperature is <span className="font-semibold text-orange-400">{criticalTf.temperature} degrees Celsius</span> and load is <span className="font-semibold text-accent-400">{criticalTf.load} percent</span>.
            </p>
            <p className="text-sm text-slate-300">Immediate inspection is recommended.</p>
          </div>

          {/* Audio waveform animation */}
          <div className="mb-5 flex items-end justify-center gap-1">
            {[...Array(18)].map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-accent-400/60"
                style={{
                  height: `${8 + Math.abs(Math.sin(i * 0.8)) * 24}px`,
                  animation: `pulse-ring 0.8s ease-in-out ${i * 0.05}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-success flex-1" onClick={handleAcknowledge}>
              <CheckCircle2 className="h-4 w-4" /> Acknowledge Alert
            </button>
            <button className="btn-danger flex-1" onClick={() => handleNoAnswer(activeIdx)}>
              <PhoneOff className="h-4 w-4" /> Simulate No Answer
            </button>
          </div>
        </div>
      </Modal>

      {/* Acknowledged success modal */}
      <Modal open={phase === 'acknowledged'} onClose={() => {}}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          </div>
          <h3 className="text-xl font-extrabold text-emerald-400">ALERT ACKNOWLEDGED</h3>
          <p className="mt-2 text-sm text-slate-300">Maintenance response initiated.</p>
          <p className="text-sm text-slate-300">Further escalation stopped.</p>
          <div className="mt-4 rounded-xl bg-navy-900 p-3 text-left text-xs text-slate-400">
            <p>Acknowledged by: <span className="font-semibold text-slate-200">{steps.find((s) => s.status === 'Acknowledged')?.contact.name}</span></p>
            <p>Time: <span className="font-mono text-slate-200">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span></p>
          </div>
          <button className="btn-ghost mt-5 w-full" onClick={reset}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

function RiskBadgeLite({ level }: { level: 'Low' | 'Medium' | 'High' | 'Critical' }) {
  const colors = { Low: 'text-emerald-400', Medium: 'text-yellow-400', High: 'text-orange-400', Critical: 'text-red-400' };
  return <span className={`text-sm font-bold uppercase ${colors[level]}`}>{level}</span>;
}
