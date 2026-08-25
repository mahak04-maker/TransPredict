import { useState } from 'react';
import { useApp } from '@/store';
import { Modal } from '@/components/Modal';
import type { Contact } from '@/types';
import { User, Phone, Plus, Clock, ShieldCheck } from 'lucide-react';

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Unavailable: 'bg-red-500/10 text-red-400 border-red-500/30',
  'On Leave': 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

export function ContactsPage() {
  const { contacts, addContact } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', phone: '', priority: 6, status: 'Available' as Contact['status'], availability: 'On-duty', timeoutSeconds: 30 });

  const submit = () => {
    if (!form.name || !form.role) return;
    addContact({ ...form, phone: form.phone || '+91 98XXXXXX06' });
    setModalOpen(false);
    setForm({ name: '', role: '', phone: '', priority: 6, status: 'Available', availability: 'On-duty', timeoutSeconds: 30 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Emergency Escalation Contacts</h2>
          <p className="text-sm text-slate-400">Call chain for critical transformer alerts</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Contact
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((c) => (
          <div key={c.id} className="card card-hover p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/15">
                  <User className="h-6 w-6 text-accent-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-100">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.role}</p>
                </div>
              </div>
              <span className="rounded-full bg-navy-900 px-2.5 py-1 text-xs font-bold text-accent-400">
                Priority {c.priority}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label">Phone</p>
                <p className="flex items-center gap-1.5 font-mono text-slate-200"><Phone className="h-3.5 w-3.5 text-slate-500" /> {c.phone}</p>
              </div>
              <div>
                <p className="label">Availability</p>
                <p className="text-slate-200">{c.availability}</p>
              </div>
              <div>
                <p className="label">Status</p>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${AVAILABILITY_STYLES[c.status]}`}>
                  {c.status}
                </span>
              </div>
              <div>
                <p className="label">Ack Timeout</p>
                <p className="flex items-center gap-1.5 text-slate-200"><Clock className="h-3.5 w-3.5 text-slate-500" /> {c.timeoutSeconds}s</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300">
        <ShieldCheck className="h-4 w-4" /> All phone numbers are masked demo values. No real contact details are stored.
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Escalation Contact">
        <div className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Senior Technician" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Phone (masked)</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98XXXXXX06" />
            </div>
            <div>
              <label className="label">Priority</label>
              <input type="number" min={1} max={10} className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Contact['status'] })}>
                <option>Available</option>
                <option>Unavailable</option>
                <option>On Leave</option>
              </select>
            </div>
            <div>
              <label className="label">Ack Timeout (s)</label>
              <input type="number" className="input" value={form.timeoutSeconds} onChange={(e) => setForm({ ...form, timeoutSeconds: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit}>Add Contact</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
