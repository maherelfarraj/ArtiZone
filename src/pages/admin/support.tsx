import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdminToken } from '@/lib/useAdminToken';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  MessageCircle, RefreshCw, Send, Loader2, User, Headphones,
  CheckCircle, Clock, AlertCircle, XCircle, Search,
  Phone, Mail,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'normal' | 'high';

interface Message {
  id: number;
  ticketId: number;
  sender: 'client' | 'admin';
  body: string;
  createdAt: string;
  adminName?: string | null;
}

interface Ticket {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  source: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  lastMessage?: Message | null;
  messageCount?: number;
}

const STATUS_META: Record<TicketStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  open:        { label: 'Open',        bg: 'rgba(239,68,68,0.12)',   text: '#dc2626', icon: AlertCircle },
  in_progress: { label: 'In Progress', bg: 'rgba(245,158,11,0.12)', text: '#d97706', icon: Clock },
  resolved:    { label: 'Resolved',    bg: 'rgba(34,197,94,0.12)',  text: '#16a34a', icon: CheckCircle },
  closed:      { label: 'Closed',      bg: 'rgba(107,114,128,0.12)', text: '#6b7280', icon: XCircle },
};

const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: '#6b7280' },
  normal: { label: 'Normal', color: '#6366f1' },
  high:   { label: 'High',   color: '#dc2626' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}


export default function AdminSupportPage() {
  const { token, ready } = useAdminToken();
  const adminHeader = { 'x-admin-secret': token };
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/support/tickets', { headers: adminHeader });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { tickets: Ticket[] };
      setTickets(data.tickets);
    } catch {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMessages = useCallback(async (ticket: Ticket) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, { headers: adminHeader });
      const data = await res.json() as { messages: Message[] };
      setMessages(data.messages ?? []);
    } catch {
      // silently fail
    } finally {
      setLoadingMsgs(false);
    }
  }, [token]);

  useEffect(() => { if (ready) void fetchTickets(); }, [fetchTickets, ready]);

  useEffect(() => {
    if (selected) {
      void fetchMessages(selected);
    }
  }, [selected, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectTicket = (t: Ticket) => {
    setSelected(t);
    setReply('');
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    const body = reply.trim();
    setReply('');
    // Optimistic
    setMessages((prev) => [...prev, {
      id: Date.now(), ticketId: selected.id, sender: 'admin',
      body, createdAt: new Date().toISOString(), adminName: 'ArtiZone Team',
    }]);
    try {
      await fetch(`/api/support/tickets/${selected.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeader },
        body: JSON.stringify({ body, adminName: 'ArtiZone Team' }),
      });
      void fetchMessages(selected);
      void fetchTickets();
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (ticketId: number, status: TicketStatus) => {
    try {
      await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminHeader },
        body: JSON.stringify({ status }),
      });
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t));
      if (selected?.id === ticketId) setSelected((s) => s ? { ...s, status } : s);
    } catch {
      setError('Failed to update status.');
    }
  };

  const updatePriority = async (ticketId: number, priority: TicketPriority) => {
    try {
      await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminHeader },
        body: JSON.stringify({ priority }),
      });
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, priority } : t));
      if (selected?.id === ticketId) setSelected((s) => s ? { ...s, priority } : s);
    } catch {
      setError('Failed to update priority.');
    }
  };

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;

  return (
    <>
      <Helmet>
        <title>Support Tickets — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/support" />
      </Helmet>
      <AdminLayout>
        <div className="flex h-[calc(100vh-0px)] overflow-hidden">

          {/* ── Left: Ticket list ─────────────────────────────────────────── */}
          <div className="w-full sm:w-80 lg:w-96 flex flex-col border-r shrink-0"
            style={{ borderColor: 'rgba(61,46,38,0.1)', background: '#fff' }}>

            {/* Header */}
            <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(61,46,38,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                    Support
                  </h1>
                  <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
                    {openCount > 0 ? `${openCount} open` : 'All clear'}{inProgressCount > 0 ? `, ${inProgressCount} in progress` : ''}
                  </p>
                </div>
                <button onClick={() => void fetchTickets()} disabled={loading}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70 disabled:opacity-40"
                  style={{ background: 'rgba(201,169,110,0.12)', color: GOLD }}
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(20 15% 55%)' }} />
                <input
                  className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:border-[#C4A882]"
                  style={{ borderColor: 'rgba(61,46,38,0.15)', color: TAUPE }}
                  placeholder="Search tickets…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all"
                    style={{ background: filter === f ? GOLD : 'rgba(61,46,38,0.07)', color: filter === f ? '#fff' : TAUPE }}
                  >
                    {f === 'in_progress' ? 'In Progress' : f === 'all' ? 'All' : STATUS_META[f as TicketStatus].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket list */}
            <div className="flex-1 overflow-y-auto">
              {error && <p className="p-4 text-xs" style={{ color: '#dc2626' }}>{error}</p>}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={22} className="animate-spin" style={{ color: GOLD }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <MessageCircle size={24} className="mx-auto mb-2 opacity-20" style={{ color: TAUPE }} />
                  <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>No tickets found.</p>
                </div>
              ) : (
                filtered.map((t) => {
                  const meta = STATUS_META[t.status];
                  const StatusIcon = meta.icon;
                  const isSelected = selected?.id === t.id;
                  return (
                    <button key={t.id} onClick={() => handleSelectTicket(t)}
                      className="w-full text-left px-4 py-3.5 border-b transition-all hover:bg-amber-50/40"
                      style={{
                        borderColor: 'rgba(61,46,38,0.06)',
                        background: isSelected ? 'rgba(201,169,110,0.08)' : undefined,
                        borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold truncate" style={{ color: TAUPE }}>{t.subject}</p>
                        <span className="text-[10px] shrink-0" style={{ color: 'hsl(20 15% 60%)' }}>{timeAgo(t.createdAt)}</span>
                      </div>
                      <p className="text-xs mb-1.5 truncate" style={{ color: 'hsl(20 15% 55%)' }}>{t.name} · {t.email}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: meta.bg, color: meta.text }}>
                          <StatusIcon size={9} />{meta.label}
                        </span>
                        {t.priority === 'high' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>High</span>
                        )}
                        {(t.messageCount ?? 0) > 0 && (
                          <span className="text-[10px]" style={{ color: 'hsl(20 15% 60%)' }}>
                            {t.messageCount} msg{(t.messageCount ?? 0) !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right: Conversation view ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: CREAM }}>
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.12)' }}>
                  <MessageCircle size={28} style={{ color: GOLD }} />
                </div>
                <p className="font-semibold" style={{ color: TAUPE }}>Select a ticket to view the conversation</p>
                <p className="text-sm text-center" style={{ color: 'hsl(20 15% 55%)' }}>
                  {tickets.length === 0 ? 'No support tickets yet.' : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} total`}
                </p>
              </div>
            ) : (
              <>
                {/* Ticket header */}
                <div className="px-6 py-4 border-b shrink-0 flex items-start justify-between gap-4"
                  style={{ borderColor: 'rgba(61,46,38,0.1)', background: '#fff' }}>
                  <div className="min-w-0">
                    <h2 className="font-bold text-base truncate" style={{ fontFamily: 'var(--font-heading)', color: TAUPE }}>
                      {selected.subject}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
                      <span className="flex items-center gap-1"><User size={11} />{selected.name}</span>
                      <span className="flex items-center gap-1"><Mail size={11} />{selected.email}</span>
                      {selected.phone && <span className="flex items-center gap-1"><Phone size={11} />{selected.phone}</span>}
                      <span>#{selected.id}</span>
                      <span>{timeAgo(selected.createdAt)}</span>
                    </div>
                  </div>

                  {/* Status + Priority controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={selected.status}
                      onChange={(e) => void updateStatus(selected.id, e.target.value as TicketStatus)}
                      className="text-xs px-3 py-1.5 rounded-full border outline-none cursor-pointer"
                      style={{ borderColor: 'rgba(61,46,38,0.15)', color: TAUPE, background: '#fff' }}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={selected.priority}
                      onChange={(e) => void updatePriority(selected.id, e.target.value as TicketPriority)}
                      className="text-xs px-3 py-1.5 rounded-full border outline-none cursor-pointer"
                      style={{ borderColor: 'rgba(61,46,38,0.15)', color: PRIORITY_META[selected.priority].color, background: '#fff' }}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={22} className="animate-spin" style={{ color: GOLD }} />
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id}
                        className={`flex flex-col gap-1 ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          {msg.sender === 'client' ? (
                            <>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(61,46,38,0.1)' }}>
                                <User size={12} style={{ color: TAUPE }} />
                              </div>
                              <span className="text-xs font-semibold" style={{ color: TAUPE }}>{selected.name}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs font-semibold" style={{ color: TAUPE }}>{msg.adminName ?? 'ArtiZone Team'}</span>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                                <Headphones size={12} color="#fff" />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className="max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                          style={msg.sender === 'admin'
                            ? { background: GOLD, color: '#fff', borderBottomRightRadius: 4 }
                            : { background: '#fff', color: TAUPE, borderBottomLeftRadius: 4, border: '1px solid rgba(61,46,38,0.1)' }
                          }
                        >
                          {msg.body}
                        </div>
                        <span className="text-[10px]" style={{ color: 'hsl(20 15% 60%)' }}>
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply bar */}
                <form onSubmit={(e) => void handleSendReply(e)}
                  className="flex items-end gap-3 p-4 border-t shrink-0"
                  style={{ borderColor: 'rgba(61,46,38,0.1)', background: '#fff' }}
                >
                  <textarea
                    className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors focus:border-[#C4A882]"
                    style={{ borderColor: 'rgba(61,46,38,0.15)', color: TAUPE, minHeight: 44, maxHeight: 120 }}
                    placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSendReply(e as unknown as React.FormEvent);
                      }
                    }}
                  />
                  <button type="submit" disabled={!reply.trim() || sending}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                    style={{ background: GOLD, color: '#fff' }}
                  >
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
