/**
 * NewBookingModal — Admin manual booking entry
 * Staff can create a booking directly from the admin panel.
 * Services & packages are auto-populated from clinic-services.ts
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Save, ChevronDown, Package, Scissors, User, Phone, Calendar, Clock, FileText } from 'lucide-react';
import { SERVICE_CATEGORIES, CLINIC_PACKAGES, TIME_SLOTS } from '@/lib/clinic-services';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';
const SAGE  = '#6B7260';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface NewBookingForm {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed';
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

type Tab = 'service' | 'package';

const EMPTY: NewBookingForm = {
  name: '', phone: '', service: '', date: '', time: '', notes: '', status: 'confirmed',
};

/* ── Field wrapper ───────────────────────────────────────────────────────── */
function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>
        <span style={{ color: GOLD }}>{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}

/* ══ Component ═══════════════════════════════════════════════════════════════ */
export default function NewBookingModal({ onClose, onCreated }: Props) {
  const [form,     setForm]     = useState<NewBookingForm>(EMPTY);
  const [tab,      setTab]      = useState<Tab>('service');
  const [catId,    setCatId]    = useState(SERVICE_CATEGORIES[0].id);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const set = (k: keyof NewBookingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const selectedCat = SERVICE_CATEGORIES.find(c => c.id === catId) ?? SERVICE_CATEGORIES[0];
  const today = new Date().toISOString().slice(0, 10);

  const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all bg-white";
  const inputStyle = {
    borderColor: 'rgba(196,168,130,0.4)',
    color: NAVY,
    '--tw-ring-color': `${GOLD}55`,
  } as React.CSSProperties;

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim())    return setError('Client name is required.');
    if (!form.phone.trim())   return setError('Phone number is required.');
    if (!form.service.trim()) return setError('Please select a service or package.');
    if (!form.date)           return setError('Please select a date.');
    if (!form.time)           return setError('Please select a time.');

    setSaving(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          phone:   form.phone.trim(),
          service: form.service.trim(),
          date:    form.date,
          time:    form.time,
          notes:   form.notes.trim() || undefined,
          status:  form.status,
          source:  'admin',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking.');
      setSuccess(true);
      setTimeout(() => { onCreated(); onClose(); }, 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create booking.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        {/* Panel */}
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{ background: '#fff' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 z-10"
            style={{ borderColor: 'rgba(196,168,130,0.2)', background: NAVY }}>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
                New Booking
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(196,168,130,0.7)' }}>
                Manual entry by staff
              </p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-70"
              style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
              <X size={16} />
            </button>
          </div>

          {/* Success state */}
          {success && (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(60,180,100,0.12)' }}>
                <Save size={28} style={{ color: '#1e7a44' }} />
              </div>
              <p className="text-base font-semibold" style={{ color: NAVY }}>Booking Created!</p>
              <p className="text-sm mt-1" style={{ color: '#9a8a7a' }}>Refreshing the list…</p>
            </div>
          )}

          {!success && (
            <div className="px-6 py-5 space-y-5">

              {/* ── Client Info ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                  Client Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full Name *" icon={<User size={12} />}>
                    <input type="text" placeholder="e.g. Sara Al-Ahmad"
                      value={form.name} onChange={set('name')}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Phone Number *" icon={<Phone size={12} />}>
                    <input type="tel" placeholder="e.g. 0791234567"
                      value={form.phone} onChange={set('phone')}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>
              </div>

              {/* ── Service / Package ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                  Service / Package *
                </p>

                {/* Tab toggle */}
                <div className="flex rounded-lg border overflow-hidden mb-3" style={{ borderColor: 'rgba(196,168,130,0.4)' }}>
                  {(['service', 'package'] as Tab[]).map(t => (
                    <button key={t} onClick={() => { setTab(t); setForm(f => ({ ...f, service: '' })); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-all"
                      style={{ background: tab === t ? NAVY : '#fff', color: tab === t ? '#fff' : NAVY }}>
                      {t === 'service' ? <Scissors size={12} /> : <Package size={12} />}
                      {t === 'service' ? 'Individual Service' : 'Package Deal'}
                    </button>
                  ))}
                </div>

                {/* Individual service */}
                {tab === 'service' && (
                  <div className="space-y-3">
                    {/* Category picker */}
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: '#9a8a7a' }}>Category</label>
                      <div className="relative">
                        <select value={catId} onChange={e => { setCatId(e.target.value); setForm(f => ({ ...f, service: '' })); }}
                          className={inputCls + ' appearance-none pr-8'} style={inputStyle}>
                          {SERVICE_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                      </div>
                    </div>
                    {/* Treatment picker */}
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: '#9a8a7a' }}>Treatment</label>
                      <div className="relative">
                        <select value={form.service} onChange={set('service')}
                          className={inputCls + ' appearance-none pr-8'} style={inputStyle}>
                          <option value="">— Select treatment —</option>
                          {selectedCat.treatments.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Package deal */}
                {tab === 'package' && (
                  <div className="space-y-2">
                    {/* Group by category */}
                    {Array.from(new Set(CLINIC_PACKAGES.map(p => p.category))).map(cat => (
                      <div key={cat}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider px-1 mb-1" style={{ color: SAGE }}>{cat}</p>
                        {CLINIC_PACKAGES.filter(p => p.category === cat).map(pkg => (
                          <button key={pkg.name}
                            onClick={() => setForm(f => ({ ...f, service: `${pkg.name} (${pkg.bundlePrice})` }))}
                            className="w-full text-left px-3 py-2.5 rounded-lg border mb-1.5 transition-all"
                            style={{
                              borderColor: form.service === `${pkg.name} (${pkg.bundlePrice})` ? NAVY : 'rgba(196,168,130,0.3)',
                              background:  form.service === `${pkg.name} (${pkg.bundlePrice})` ? NAVY : '#fff',
                              color:       form.service === `${pkg.name} (${pkg.bundlePrice})` ? '#fff' : NAVY,
                            }}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{pkg.name}</span>
                              <span className="text-xs font-bold" style={{ color: form.service === `${pkg.name} (${pkg.bundlePrice})` ? GOLD : GOLD }}>{pkg.bundlePrice}</span>
                            </div>
                            <div className="text-[11px] mt-0.5 opacity-70 truncate">
                              {pkg.treatments.slice(0, 3).join(' · ')}{pkg.treatments.length > 3 ? ` +${pkg.treatments.length - 3} more` : ''}
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected service preview */}
                {form.service && (
                  <div className="mt-2 px-3 py-2 rounded-lg flex items-center gap-2"
                    style={{ background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                    <span className="text-xs font-medium truncate" style={{ color: NAVY }}>{form.service}</span>
                    <button onClick={() => setForm(f => ({ ...f, service: '' }))} className="ml-auto shrink-0 hover:opacity-60">
                      <X size={12} style={{ color: '#9a8a7a' }} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Date & Time ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                  Appointment Date & Time *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Date" icon={<Calendar size={12} />}>
                    <input type="date" min={today} value={form.date} onChange={set('date')}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Time" icon={<Clock size={12} />}>
                    <div className="relative">
                      <select value={form.time} onChange={set('time')}
                        className={inputCls + ' appearance-none pr-8'} style={inputStyle}>
                        <option value="">— Select time —</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Status & Notes ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                  Status & Notes
                </p>
                <div className="space-y-3">
                  <Field label="Booking Status" icon={<Clock size={12} />}>
                    <div className="flex gap-2">
                      {(['confirmed', 'pending'] as const).map(s => (
                        <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                          className="flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all capitalize"
                          style={{
                            background:  form.status === s ? (s === 'confirmed' ? 'rgba(60,180,100,0.15)' : 'rgba(180,175,83,0.14)') : '#fff',
                            color:       form.status === s ? (s === 'confirmed' ? '#1e7a44' : '#7a7618') : '#9a8a7a',
                            borderColor: form.status === s ? (s === 'confirmed' ? 'rgba(60,180,100,0.4)' : 'rgba(180,175,83,0.4)') : 'rgba(196,168,130,0.3)',
                          }}>
                          {s === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Notes (optional)" icon={<FileText size={12} />}>
                    <textarea value={form.notes} onChange={set('notes')} rows={2}
                      placeholder="Any special requests, allergies, or notes…"
                      className={inputCls + ' resize-none'} style={inputStyle} />
                  </Field>
                </div>
              </div>

              {/* ── Error ── */}
              {error && (
                <div className="px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}>
                  {error}
                </div>
              )}

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-1 pb-2">
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: NAVY, color: '#fff' }}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Creating…' : 'Create Booking'}
                </button>
                <button onClick={onClose}
                  className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY, background: PARCH }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
