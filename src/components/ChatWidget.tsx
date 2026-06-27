/**
 * ChatWidget — floating support chat button + slide-up panel.
 * Persists ticketId + sessionToken in localStorage so the user
 * can return to their conversation after navigating away.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle, Send, Loader2, ChevronDown,
  Headphones,
} from 'lucide-react';

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';
const DARK_BG = '#2a1f18';

const LS_KEY = 'artizone_support_ticket';

interface StoredTicket { ticketId: number; sessionToken: string; subject: string }

interface Message {
  id: number;
  sender: 'client' | 'admin';
  body: string;
  createdAt: string;
  adminName?: string | null;
}

type Step = 'idle' | 'form' | 'chat' | 'success';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#C4A882]';
const inputStyle = { borderColor: 'rgba(61,46,38,0.18)', background: '#fff', color: TAUPE };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [stored, setStored] = useState<StoredTicket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [unread, setUnread] = useState(0);

  // New ticket form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Chat reply
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load stored ticket from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredTicket;
        setStored(parsed);
        setStep('chat');
      } else {
        setStep('form');
      }
    } catch {
      setStep('form');
    }
  }, []);

  const fetchMessages = useCallback(async (ticket: StoredTicket, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.ticketId}`, {
        headers: { 'x-session-token': ticket.sessionToken },
      });
      if (!res.ok) {
        // Ticket not found — clear stored state
        if (res.status === 403 || res.status === 404) {
          localStorage.removeItem(LS_KEY);
          setStored(null);
          setStep('form');
        }
        return;
      }
      const data = await res.json() as { messages: Message[] };
      setMessages((prev) => {
        const newMsgs = data.messages;
        if (!open) {
          const adminMsgs = newMsgs.filter((m) => m.sender === 'admin');
          const prevAdminCount = prev.filter((m) => m.sender === 'admin').length;
          const newAdminCount = adminMsgs.length - prevAdminCount;
          if (newAdminCount > 0) setUnread((u) => u + newAdminCount);
        }
        return newMsgs;
      });
    } catch {
      // silently fail
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, [open]);

  // Poll for new messages every 15s when a ticket exists
  useEffect(() => {
    if (stored) {
      void fetchMessages(stored);
      pollRef.current = setInterval(() => void fetchMessages(stored, true), 15000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [stored, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Clear unread when panel opens
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message, source: 'chat_widget' }),
      });
      const data = await res.json() as { success?: boolean; ticketId?: number; sessionToken?: string; error?: string };
      if (res.ok && data.success && data.ticketId && data.sessionToken) {
        const ticket: StoredTicket = { ticketId: data.ticketId, sessionToken: data.sessionToken, subject };
        localStorage.setItem(LS_KEY, JSON.stringify(ticket));
        setStored(ticket);
        setStep('chat');
        // Seed the opening message locally
        setMessages([{ id: 0, sender: 'client', body: message, createdAt: new Date().toISOString() }]);
        void fetchMessages(ticket);
      } else {
        setFormError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !stored) return;
    setSending(true);
    const body = reply.trim();
    setReply('');
    // Optimistic
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'client', body, createdAt: new Date().toISOString() }]);
    try {
      await fetch(`/api/support/tickets/${stored.ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': stored.sessionToken },
        body: JSON.stringify({ body }),
      });
      void fetchMessages(stored, true);
    } catch {
      // silently fail — message is shown optimistically
    } finally {
      setSending(false);
    }
  };

  const handleNewTicket = () => {
    localStorage.removeItem(LS_KEY);
    setStored(null);
    setMessages([]);
    setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    setFormError('');
    setStep('form');
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={() => setOpen(true)}
              className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: GOLD }}
              aria-label="Open support chat"
            >
              <MessageCircle size={24} color="#fff" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#ef4444' }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              style={{ background: 'rgba(30,21,16,0.5)' }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed bottom-0 left-0 sm:bottom-6 sm:left-6 z-50 w-full sm:w-[380px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
              style={{ maxHeight: '85vh', height: '560px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ background: DARK_BG }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                    <Headphones size={16} color="#fff" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">ArtiZone Support</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {step === 'chat' ? `Ticket #${stored?.ticketId}` : 'We usually reply within a few hours'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  aria-label="Close chat"
                >
                  <ChevronDown size={16} color="#fff" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto" style={{ background: CREAM }}>

                {/* ── New ticket form ── */}
                {step === 'form' && (
                  <form onSubmit={(e) => void handleSubmit(e)} className="p-5 flex flex-col gap-3">
                    <p className="text-sm font-semibold mb-1" style={{ color: TAUPE }}>
                      How can we help you today?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input className={inputCls} style={inputStyle} type="text" placeholder="Your name *"
                        value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
                      <input className={inputCls} style={inputStyle} type="email" placeholder="Email *"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <input className={inputCls} style={inputStyle} type="tel" placeholder="Phone (optional)"
                      value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input className={inputCls} style={inputStyle} type="text" placeholder="Subject *"
                      value={subject} onChange={(e) => setSubject(e.target.value)} required minLength={3} />
                    <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }}
                      placeholder="How can we help? *" rows={4}
                      value={message} onChange={(e) => setMessage(e.target.value)} required minLength={5} />
                    {formError && <p className="text-xs" style={{ color: '#dc2626' }}>{formError}</p>}
                    <button type="submit" disabled={submitting}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: GOLD, color: '#fff' }}
                    >
                      {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {submitting ? 'Sending…' : 'Start Conversation'}
                    </button>
                    <p className="text-center text-xs" style={{ color: 'hsl(20 15% 60%)' }}>
                      Or call us: <a href="tel:+962790412758" style={{ color: GOLD }}>+962 79 041 2758</a> / <a href="tel:+962792828024" style={{ color: GOLD }}>+962 79 282 8024</a>
                    </p>
                  </form>
                )}

                {/* ── Chat thread ── */}
                {step === 'chat' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                      {loadingMsgs && messages.length === 0 ? (
                        <div className="flex items-center justify-center py-10">
                          <Loader2 size={22} className="animate-spin" style={{ color: GOLD }} />
                        </div>
                      ) : (
                        <>
                          {messages.map((msg) => (
                            <div key={msg.id}
                              className={`flex flex-col gap-1 ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                            >
                              {msg.sender === 'admin' && (
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                                    <Headphones size={10} color="#fff" />
                                  </div>
                                  <span className="text-xs font-semibold" style={{ color: TAUPE }}>
                                    {msg.adminName ?? 'ArtiZone Team'}
                                  </span>
                                </div>
                              )}
                              <div
                                className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                style={msg.sender === 'client'
                                  ? { background: GOLD, color: '#fff', borderBottomRightRadius: 4 }
                                  : { background: '#fff', color: TAUPE, borderBottomLeftRadius: 4, border: '1px solid rgba(61,46,38,0.1)' }
                                }
                              >
                                {msg.body}
                              </div>
                              <span className="text-[10px]" style={{ color: 'hsl(20 15% 65%)' }}>
                                {timeAgo(msg.createdAt)}
                              </span>
                            </div>
                          ))}
                          {/* Auto-reply hint after first message */}
                          {messages.length === 1 && (
                            <div className="flex items-start gap-2 mt-1">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: GOLD }}>
                                <Headphones size={10} color="#fff" />
                              </div>
                              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                style={{ background: '#fff', color: TAUPE, borderBottomLeftRadius: 4, border: '1px solid rgba(61,46,38,0.1)' }}>
                                Thanks for reaching out! We'll get back to you as soon as possible — usually within a few hours. 🌸
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Reply bar */}
                    <form onSubmit={(e) => void handleSendReply(e)}
                      className="flex items-end gap-2 p-3 border-t shrink-0"
                      style={{ borderColor: 'rgba(61,46,38,0.1)', background: '#fff' }}
                    >
                      <textarea
                        className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none resize-none transition-colors focus:border-[#C4A882]"
                        style={{ borderColor: 'rgba(61,46,38,0.15)', color: TAUPE, minHeight: 40, maxHeight: 100 }}
                        placeholder="Type a message…"
                        rows={1}
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
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-40 shrink-0"
                        style={{ background: GOLD }}
                        aria-label="Send"
                      >
                        {sending ? <Loader2 size={14} color="#fff" className="animate-spin" /> : <Send size={14} color="#fff" />}
                      </button>
                    </form>

                    {/* Start new ticket link */}
                    <div className="text-center py-2 shrink-0" style={{ background: '#fff', borderTop: '1px solid rgba(61,46,38,0.06)' }}>
                      <button onClick={handleNewTicket}
                        className="text-xs transition-all hover:opacity-70"
                        style={{ color: 'hsl(20 15% 55%)' }}
                      >
                        Start a new conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
