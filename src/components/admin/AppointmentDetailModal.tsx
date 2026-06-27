/**
 * AppointmentDetailModal
 * Opens when admin clicks a request row. Shows customer info, lets them
 * assign service / practitioner / date / time / room, runs the 4-gate
 * availability check, then confirms the booking.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle, AlertCircle, Loader2, Phone, MessageCircle,
  Calendar, Clock, Sparkles, ChevronDown,
} from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  serviceId?: number | null;
  serviceName?: string | null;
  staffId?: number | null;
  staffName?: string | null;
  resourceId?: number | null;
  roomName?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  status: string;
  source?: string;
  notes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
}

interface Service { id: number; name: string; category: string; durationMin: number; bufferMin: number; price: number; }
interface StaffMember { id: number; name: string; role?: string | null; skills: string[]; }
interface Room { id: number; name: string; type: string; capabilities: string[]; }

interface AvailabilityResult {
  availableStaff: StaffMember[];
  availableRooms: Room[];
  available: boolean | null;
  endTime: string;
}

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onUpdated: (updated: Appointment) => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  requested:  { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Requested' },
  confirmed:  { bg: 'rgba(60,180,100,0.14)',  color: '#1e7a44', label: 'Confirmed' },
  completed:  { bg: 'rgba(14,42,58,0.12)',    color: NAVY,      label: 'Completed' },
  declined:   { bg: 'rgba(200,100,20,0.12)',  color: '#8a4010', label: 'Declined'  },
  no_show:    { bg: 'rgba(120,80,200,0.12)',  color: '#5a2d9a', label: 'No-show'   },
  cancelled:  { bg: 'rgba(220,60,60,0.12)',   color: '#b02828', label: 'Cancelled' },
  // legacy
  pending:    { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Pending'   },
};

export default function AppointmentDetailModal({ appointment, onClose, onUpdated }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  const [serviceId, setServiceId] = useState<number | ''>(appointment.serviceId ?? '');
  const [staffId, setStaffId] = useState<number | ''>(appointment.staffId ?? '');
  const [resourceId, setResourceId] = useState<number | ''>(appointment.resourceId ?? '');
  const [date, setDate] = useState(appointment.date);
  const [startTime, setStartTime] = useState(appointment.startTime);
  const [adminNotes, setAdminNotes] = useState(appointment.adminNotes ?? '');

  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load reference data
  useEffect(() => {
    Promise.all([
      fetch('/api/scheduling/services').then(r => r.json()),
      fetch('/api/scheduling/staff').then(r => r.json()),
      fetch('/api/scheduling/rooms').then(r => r.json()),
    ]).then(([svcs, stf, rms]) => {
      setServices(svcs);
      setAllStaff(stf);
      setAllRooms(rms);
    });
  }, []);

  // Check availability whenever service/date/time changes
  const checkAvailability = useCallback(async () => {
    if (!serviceId || !date || !startTime) { setAvailability(null); return; }
    setCheckingAvail(true);
    try {
      const params = new URLSearchParams({
        service_id: String(serviceId),
        date,
        start_time: startTime,
        appointment_id: String(appointment.id),
      });
      if (staffId) params.set('staff_id', String(staffId));
      if (resourceId) params.set('resource_id', String(resourceId));
      const res = await fetch(`/api/scheduling/availability?${params}`);
      const data = await res.json();
      setAvailability(data);
    } catch {
      setAvailability(null);
    } finally {
      setCheckingAvail(false);
    }
  }, [serviceId, date, startTime, staffId, resourceId, appointment.id]);

  useEffect(() => { checkAvailability(); }, [checkAvailability]);

  const handleAction = async (newStatus: string) => {
    setSaving(true);
    setError('');
    try {
      const body: Record<string, unknown> = { status: newStatus, adminNotes };
      if (serviceId) body.serviceId = serviceId;
      if (staffId) body.staffId = staffId;
      if (resourceId) body.resourceId = resourceId;
      body.date = date;
      body.startTime = startTime;

      const res = await fetch(`/api/scheduling/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  void services.find(s => s.id === serviceId);
  const isConfirmable = appointment.status === 'requested' || appointment.status === 'pending';
  const comboOk = availability?.available === true;
  const comboChecked = staffId && resourceId && availability !== null;

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const h = Math.floor(i / 2) + 10;
    const m = i % 2 === 0 ? '00' : '30';
    return `${String(h).padStart(2, '0')}:${m}`;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(14,42,58,0.6)', backdropFilter: 'blur(4px)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ background: '#fff', boxShadow: '0 24px 80px rgba(14,42,58,0.25)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: `1px solid rgba(196,168,130,0.2)` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: `${GOLD}22`, color: NAVY }}>
                {appointment.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: NAVY }}>{appointment.customerName}</h2>
                <p className="text-xs" style={{ color: 'hsl(20 15% 50%)' }}>{appointment.customerPhone}</p>
              </div>
              <span className="ml-2 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: STATUS_COLORS[appointment.status]?.bg, color: STATUS_COLORS[appointment.status]?.color }}>
                {STATUS_COLORS[appointment.status]?.label ?? appointment.status}
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
              <X size={18} style={{ color: NAVY }} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Customer request summary */}
            <div className="p-4 rounded" style={{ background: PARCH }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Customer Requested</p>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: NAVY }}>
                <span className="flex items-center gap-1.5"><Sparkles size={13} style={{ color: GOLD }} />
                  {appointment.serviceName ?? 'No service specified'}
                </span>
                <span className="flex items-center gap-1.5"><Calendar size={13} style={{ color: GOLD }} />
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1.5"><Clock size={13} style={{ color: GOLD }} />
                  {appointment.startTime}
                </span>
              </div>
              {appointment.notes && (
                <p className="text-xs mt-2 italic" style={{ color: 'hsl(20 15% 48%)' }}>"{appointment.notes}"</p>
              )}
            </div>

            {/* Assignment form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Service</label>
                <div className="relative">
                  <select
                    value={serviceId}
                    onChange={e => { setServiceId(e.target.value ? Number(e.target.value) : ''); setStaffId(''); setResourceId(''); }}
                    className="w-full appearance-none text-sm outline-none px-3 py-2.5 pr-8"
                    style={{ background: PARCH, border: `1.5px solid rgba(196,168,130,0.3)`, color: NAVY }}
                  >
                    <option value="">— Select service —</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.durationMin} min)</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-sm outline-none px-3 py-2.5"
                  style={{ background: PARCH, border: `1.5px solid rgba(196,168,130,0.3)`, color: NAVY }}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Time</label>
                <div className="relative">
                  <select
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full appearance-none text-sm outline-none px-3 py-2.5 pr-8"
                    style={{ background: PARCH, border: `1.5px solid rgba(196,168,130,0.3)`, color: NAVY }}
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                </div>
              </div>

              {/* Practitioner */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                  Practitioner
                  {checkingAvail && <Loader2 size={10} className="inline ml-1 animate-spin" />}
                </label>
                {(() => {
                  const selectedSvc = services.find(s => s.id === serviceId);
                  const svcCategory = selectedSvc?.category ?? null;
                  const staffPool = availability?.availableStaff ?? allStaff;
                  const qualified   = svcCategory ? staffPool.filter(s => s.skills.includes(svcCategory)) : staffPool;
                  const unqualified = svcCategory ? staffPool.filter(s => !s.skills.includes(svcCategory)) : [];
                  const selectedStaff = allStaff.find(s => s.id === staffId);
                  const skillMismatch = staffId && svcCategory && selectedStaff && !selectedStaff.skills.includes(svcCategory);
                  return (
                    <>
                      <div className="relative">
                        <select
                          value={staffId}
                          onChange={e => setStaffId(e.target.value ? Number(e.target.value) : '')}
                          className="w-full appearance-none text-sm outline-none px-3 py-2.5 pr-8"
                          style={{ background: PARCH, border: `1.5px solid ${skillMismatch ? '#e07020' : 'rgba(196,168,130,0.3)'}`, color: NAVY }}
                        >
                          <option value="">— Select practitioner —</option>
                          {qualified.length > 0 && (
                            <optgroup label={svcCategory ? `✓ Qualified for ${selectedSvc?.name ?? svcCategory}` : 'Staff'}>
                              {qualified.map(s => (
                                <option key={s.id} value={s.id}>{s.name}{s.role ? ` · ${s.role}` : ''}</option>
                              ))}
                            </optgroup>
                          )}
                          {unqualified.length > 0 && (
                            <optgroup label="⚠ Not trained for this service">
                              {unqualified.map(s => (
                                <option key={s.id} value={s.id}>{s.name}{s.role ? ` · ${s.role}` : ''}</option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                      </div>
                      {skillMismatch && (
                        <p className="flex items-center gap-1.5 mt-1.5 text-[11px] px-2 py-1.5 rounded"
                          style={{ background: 'rgba(224,112,32,0.08)', color: '#8a4010', border: '1px solid rgba(224,112,32,0.2)' }}>
                          <AlertCircle size={11} />
                          {selectedStaff.name} is not trained for {selectedSvc?.name ?? 'this service'} — consider reassigning
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Room */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Room / Suite</label>
                <div className="relative">
                  <select
                    value={resourceId}
                    onChange={e => setResourceId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full appearance-none text-sm outline-none px-3 py-2.5 pr-8"
                    style={{ background: PARCH, border: `1.5px solid rgba(196,168,130,0.3)`, color: NAVY }}
                  >
                    <option value="">— Select room —</option>
                    {(availability?.availableRooms ?? allRooms).map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
                </div>
              </div>
            </div>

            {/* Availability indicator */}
            {comboChecked && (
              <div className="flex items-center gap-2 px-4 py-3 rounded"
                style={{
                  background: comboOk ? 'rgba(30,122,68,0.08)' : 'rgba(220,60,60,0.08)',
                  border: `1px solid ${comboOk ? 'rgba(30,122,68,0.25)' : 'rgba(220,60,60,0.25)'}`,
                }}>
                {comboOk
                  ? <CheckCircle size={15} style={{ color: '#1e7a44' }} />
                  : <AlertCircle size={15} style={{ color: '#b02828' }} />
                }
                <span className="text-sm font-medium" style={{ color: comboOk ? '#1e7a44' : '#b02828' }}>
                  {comboOk
                    ? `${allStaff.find(s => s.id === staffId)?.name} and ${allRooms.find(r => r.id === resourceId)?.name} are both free at ${startTime}`
                    : 'This combination is not available — please choose a different time or practitioner'
                  }
                </span>
              </div>
            )}

            {/* Admin notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>Admin Notes</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Internal notes visible only to staff..."
                className="w-full text-sm outline-none resize-none px-3 py-2.5"
                style={{ background: PARCH, border: `1.5px solid rgba(196,168,130,0.3)`, color: NAVY }}
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded" style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}>
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              {isConfirmable && (
                <button
                  onClick={() => handleAction('confirmed')}
                  disabled={saving || !!(comboChecked && !comboOk)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: NAVY, color: '#fff' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Confirm & Notify on WhatsApp
                </button>
              )}

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://wa.me/${appointment.customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(appointment.customerName)}%2C%20this%20is%20ArtiZone%20regarding%20your%20appointment.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
                <a
                  href={`tel:${appointment.customerPhone}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}
                >
                  <Phone size={12} /> Call
                </a>
                {isConfirmable && (
                  <button
                    onClick={() => handleAction('declined')}
                    disabled={saving}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}
                  >
                    Decline
                  </button>
                )}
                {appointment.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleAction('completed')}
                      disabled={saving}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: 'rgba(30,122,68,0.1)', color: '#1e7a44', border: '1px solid rgba(30,122,68,0.2)' }}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => handleAction('no_show')}
                      disabled={saving}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: 'rgba(120,80,200,0.08)', color: '#5a2d9a', border: '1px solid rgba(120,80,200,0.2)' }}
                    >
                      No-show
                    </button>
                  </>
                )}
              </div>

              {/* Save notes without status change */}
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await fetch(`/api/scheduling/appointments/${appointment.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ adminNotes, staffId: staffId || null, resourceId: resourceId || null, serviceId: serviceId || null, date, startTime }),
                    });
                    if (!res.ok) throw new Error('Failed');
                    const updated = await res.json();
                    onUpdated(updated);
                  } catch (e) {
                    setError('Failed to save');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
