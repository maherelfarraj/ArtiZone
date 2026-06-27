/**
 * WaitlistManager — admin UI for the waitlist queue.
 * Shows waiting clients, lets admin send offers or mark as booked/cancelled.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Clock, MessageCircle, Phone, CheckCircle, XCircle,
  Loader2, RefreshCw, Send, Users,
} from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

interface WaitlistEntry {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceId?: number | null;
  serviceName?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  staffId?: number | null;
  staffName?: string | null;
  status: 'waiting' | 'offered' | 'booked' | 'expired' | 'cancelled';
  offeredAt?: string | null;
  notes?: string | null;
  source: string;
  createdAt: string;
}

const STATUS_META: Record<string, { bg: string; color: string; label: string }> = {
  waiting:   { bg: 'rgba(180,175,83,0.14)',  color: '#7a7618', label: 'Waiting' },
  offered:   { bg: 'rgba(14,42,58,0.1)',     color: NAVY,      label: 'Offered' },
  booked:    { bg: 'rgba(60,180,100,0.14)',  color: '#1e7a44', label: 'Booked' },
  expired:   { bg: 'rgba(120,80,200,0.12)',  color: '#5a2d9a', label: 'Expired' },
  cancelled: { bg: 'rgba(220,60,60,0.12)',   color: '#b02828', label: 'Cancelled' },
};

export default function WaitlistManager() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('waiting');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all'
        ? '/api/scheduling/waitlist'
        : `/api/scheduling/waitlist?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setEntries(data.waitlist ?? []);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: number, status: WaitlistEntry['status']) => {
    setUpdating(id);
    try {
      await fetch(`/api/scheduling/waitlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setUpdating(null);
    }
  };

  const waCount = entries.filter(e => e.status === 'waiting').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: NAVY }}>
            <Users size={16} style={{ color: GOLD }} /> Waitlist
            {waCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: GOLD, color: NAVY }}>{waCount}</span>
            )}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
            Clients waiting for an available slot
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded transition-all hover:opacity-80"
          style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded overflow-x-auto" style={{ background: PARCH, width: 'fit-content' }}>
        {(['waiting', 'offered', 'booked', 'all'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded whitespace-nowrap transition-all"
            style={{
              background: statusFilter === s ? NAVY : 'transparent',
              color: statusFilter === s ? '#fff' : NAVY,
            }}>
            {s === 'all' ? 'All' : STATUS_META[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin" style={{ color: GOLD }} /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={32} className="mx-auto mb-3 opacity-30" style={{ color: NAVY }} />
          <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>
            {statusFilter === 'waiting' ? 'No one waiting right now.' : 'No entries found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(e => {
            const meta = STATUS_META[e.status] ?? STATUS_META.waiting;
            const isUpdating = updating === e.id;
            return (
              <div key={e.id} className="p-4 rounded"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)' }}>
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${GOLD}22`, color: NAVY }}>
                    {e.customerName.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: NAVY }}>{e.customerName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 50%)' }}>
                      {e.customerPhone}
                      {e.customerEmail && ` · ${e.customerEmail}`}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
                      {e.serviceName && <span>Service: <strong style={{ color: NAVY }}>{e.serviceName}</strong></span>}
                      {e.preferredDate && <span>Preferred: <strong style={{ color: NAVY }}>{e.preferredDate}{e.preferredTime ? ` @ ${e.preferredTime}` : ''}</strong></span>}
                      {e.staffName && <span>Staff: <strong style={{ color: NAVY }}>{e.staffName}</strong></span>}
                    </div>
                    {e.notes && (
                      <p className="text-xs mt-1 italic" style={{ color: 'hsl(20 15% 55%)' }}>"{e.notes}"</p>
                    )}
                    <p className="text-[10px] mt-1.5" style={{ color: 'hsl(20 15% 65%)' }}>
                      Added {new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {e.offeredAt && ` · Offered ${new Date(e.offeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t flex-wrap" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
                  {e.status === 'waiting' && (
                    <button onClick={() => updateStatus(e.id, 'offered')} disabled={isUpdating}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: NAVY, color: '#fff' }}>
                      {isUpdating ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                      Send Offer
                    </button>
                  )}
                  {(e.status === 'waiting' || e.status === 'offered') && (
                    <button onClick={() => updateStatus(e.id, 'booked')} disabled={isUpdating}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#eaf3de', color: '#1a6e2e', border: '1px solid rgba(26,110,46,0.2)' }}>
                      {isUpdating ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                      Mark Booked
                    </button>
                  )}
                  {e.status !== 'cancelled' && e.status !== 'booked' && (
                    <button onClick={() => updateStatus(e.id, 'cancelled')} disabled={isUpdating}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#fce8f3', color: '#b02828', border: '1px solid rgba(176,40,40,0.15)' }}>
                      {isUpdating ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                      Cancel
                    </button>
                  )}
                  {/* Contact shortcuts */}
                  <div className="ml-auto flex items-center gap-2">
                    <a href={`https://wa.me/${e.customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(e.customerName)}%2C%20a%20slot%20is%20now%20available%20at%20ArtiZone!`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded transition-all hover:opacity-80"
                      style={{ background: '#25D366', color: '#fff' }}>
                      <MessageCircle size={13} />
                    </a>
                    <a href={`tel:${e.customerPhone}`}
                      className="p-2 rounded transition-all hover:opacity-80"
                      style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                      <Phone size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
