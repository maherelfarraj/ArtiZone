/**
 * /admin/users — Manage admin panel users
 * Superadmin can add, deactivate, and reactivate staff accounts.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Users, Plus, Loader2, CheckCircle, X, Mail, User, Shield, ShieldOff, KeyRound } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

interface AdminUser {
  id:          number;
  name:        string;
  email:       string;
  role:        'superadmin' | 'staff';
  isActive:    boolean;
  lastLoginAt: string | null;
  createdAt:   string;
}

interface Me {
  id:   number;
  role: 'superadmin' | 'staff';
  name: string;
}

/* ── Helpers ── */
function fmtDate(d: string | null) {
  if (!d) return 'Never';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RoleBadge({ role }: { role: 'superadmin' | 'staff' }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{
        background: role === 'superadmin' ? 'rgba(196,168,130,0.18)' : 'rgba(107,114,96,0.12)',
        color:      role === 'superadmin' ? GOLD : '#6B7260',
      }}>
      {role === 'superadmin' ? <Shield size={9} /> : <User size={9} />}
      {role === 'superadmin' ? 'Superadmin' : 'Staff'}
    </span>
  );
}

/* ══ Component ═══════════════════════════════════════════════════════════════ */
export default function AdminUsersPage() {
  const [users,      setUsers]      = useState<AdminUser[]>([]);
  const [me,         setMe]         = useState<Me | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [showAdd,    setShowAdd]    = useState(false);

  /* Add user form */
  const [addName,  setAddName]  = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole,  setAddRole]  = useState<'staff' | 'superadmin'>('staff');
  const [adding,   setAdding]   = useState(false);
  const [addError, setAddError] = useState('');
  const [addOk,    setAddOk]    = useState(false);

  /* Deactivate confirm */
  const [confirmDeactivate, setConfirmDeactivate] = useState<number | null>(null);
  const [deactivating,      setDeactivating]      = useState<number | null>(null);

  /* Reset password */
  const [resetTarget,   setResetTarget]   = useState<AdminUser | null>(null);
  const [resetPwd,      setResetPwd]      = useState('');
  const [resetting,     setResetting]     = useState(false);
  const [resetError,    setResetError]    = useState('');
  const [resetOk,       setResetOk]       = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const d = await res.json() as { user: Me };
        setMe(d.user);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json() as { users: AdminUser[] };
      setUsers(d.users);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
    void fetchUsers();
  }, [fetchMe, fetchUsers]);

  /* ── Add user ── */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(''); setAdding(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName.trim(), email: addEmail.trim(), role: addRole }),
      });
      const d = await res.json();
      if (!res.ok) { setAddError(d.error ?? 'Failed to add user.'); return; }
      setAddOk(true);
      setAddName(''); setAddEmail(''); setAddRole('staff');
      void fetchUsers();
      setTimeout(() => { setShowAdd(false); setAddOk(false); }, 1800);
    } catch {
      setAddError('Network error.');
    } finally {
      setAdding(false);
    }
  };

  /* ── Deactivate ── */
  const handleDeactivate = async (id: number) => {
    setDeactivating(id);
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      void fetchUsers();
    } catch { /* ignore */ } finally {
      setDeactivating(null);
      setConfirmDeactivate(null);
    }
  };

  /* ── Reactivate ── */
  const handleReactivate = async (id: number) => {
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
      });
      void fetchUsers();
    } catch { /* ignore */ }
  };

  /* ── Reset password ── */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setResetError(''); setResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${resetTarget.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: resetPwd }),
      });
      const d = await res.json();
      if (!res.ok) { setResetError(d.error ?? 'Failed to reset password.'); return; }
      setResetOk(true);
      setTimeout(() => { setResetTarget(null); setResetPwd(''); setResetOk(false); }, 1600);
    } catch {
      setResetError('Network error.');
    } finally {
      setResetting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all bg-white";
  const inputStyle = { borderColor: 'rgba(196,168,130,0.4)', color: NAVY, '--tw-ring-color': `${GOLD}55` } as React.CSSProperties;

  return (
    <AdminLayout>
      <Helmet>
        <title>Users — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/users" />
      </Helmet>

      <div className="p-5 sm:p-7 max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Admin Users
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#9a8a7a' }}>
              Manage who can access the admin panel
            </p>
          </div>
          <div className="flex gap-2">
            {me?.role === 'superadmin' && (
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ background: NAVY, color: '#fff' }}>
                <Plus size={13} /> Add User
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}>
            {error}
          </div>
        )}

        {/* Users list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                style={{
                  background: u.isActive ? '#fff' : 'rgba(0,0,0,0.02)',
                  borderColor: u.isActive ? 'rgba(196,168,130,0.2)' : 'rgba(0,0,0,0.08)',
                  opacity: u.isActive ? 1 : 0.6,
                }}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: u.isActive ? 'rgba(196,168,130,0.15)' : '#eee', color: u.isActive ? GOLD : '#aaa' }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold truncate" style={{ color: NAVY }}>{u.name}</span>
                    <RoleBadge role={u.role} />
                    {!u.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: 'rgba(220,60,60,0.1)', color: '#b02828' }}>
                        Inactive
                      </span>
                    )}
                    {me?.id === u.id && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: 'rgba(60,180,100,0.1)', color: '#1e7a44' }}>
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#9a8a7a' }}>{u.email}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#bbb' }}>
                    Last login: {fmtDate(u.lastLoginAt)} · Added {fmtDate(u.createdAt)}
                  </p>
                </div>

                {/* Actions — superadmin only */}
                {me?.role === 'superadmin' && (
                  <div className="shrink-0 flex items-center gap-2">
                    {/* Reset password — available for all users including self */}
                    <button onClick={() => { setResetTarget(u); setResetPwd(''); setResetError(''); setResetOk(false); }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.35)', color: '#7a6a4a', background: 'rgba(196,168,130,0.07)' }}
                      title="Reset password">
                      <KeyRound size={12} /> Reset
                    </button>

                    {/* Deactivate / reactivate — not for self */}
                    {me.id !== u.id && (
                      u.isActive ? (
                        confirmDeactivate === u.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#b02828' }}>Deactivate?</span>
                            <button onClick={() => handleDeactivate(u.id)} disabled={deactivating === u.id}
                              className="text-xs px-2 py-1 rounded font-semibold"
                              style={{ background: 'rgba(220,60,60,0.1)', color: '#b02828' }}>
                              {deactivating === u.id ? <Loader2 size={12} className="animate-spin" /> : 'Yes'}
                            </button>
                            <button onClick={() => setConfirmDeactivate(null)}
                              className="text-xs px-2 py-1 rounded" style={{ color: '#9a8a7a' }}>
                              No
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeactivate(u.id)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                            style={{ borderColor: 'rgba(220,60,60,0.3)', color: '#b02828', background: 'rgba(220,60,60,0.05)' }}>
                            <ShieldOff size={12} /> Deactivate
                          </button>
                        )
                      ) : (
                        <button onClick={() => handleReactivate(u.id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                          style={{ borderColor: 'rgba(60,180,100,0.3)', color: '#1e7a44', background: 'rgba(60,180,100,0.05)' }}>
                          <CheckCircle size={12} /> Reactivate
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {users.length === 0 && !loading && (
              <div className="text-center py-12" style={{ color: '#bbb' }}>
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No users found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add User Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div key="add-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: '#fff' }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5"
                style={{ background: NAVY }}>
                <div>
                  <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
                    Add Admin User
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(196,168,130,0.6)' }}>
                    A temporary password will be emailed to them
                  </p>
                </div>
                <button onClick={() => setShowAdd(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
                  <X size={15} />
                </button>
              </div>

              {addOk ? (
                <div className="flex flex-col items-center py-12 px-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'rgba(60,180,100,0.1)' }}>
                    <CheckCircle size={28} style={{ color: '#1e7a44' }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: NAVY }}>User created!</p>
                  <p className="text-xs mt-1" style={{ color: '#9a8a7a' }}>Login credentials sent by email.</p>
                </div>
              ) : (
                <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>Full Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                      <input type="text" placeholder="e.g. Sara Al-Ahmad" required
                        value={addName} onChange={e => setAddName(e.target.value)}
                        className={inputCls + ' pl-9'} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>Email Address *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#aaa' }} />
                      <input type="email" placeholder="staff@example.com" required
                        value={addEmail} onChange={e => setAddEmail(e.target.value)}
                        className={inputCls + ' pl-9'} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>Role</label>
                    <div className="flex gap-2">
                      {(['staff', 'superadmin'] as const).map(r => (
                        <button key={r} type="button" onClick={() => setAddRole(r)}
                          className="flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all capitalize"
                          style={{
                            background:  addRole === r ? (r === 'superadmin' ? 'rgba(196,168,130,0.15)' : 'rgba(14,42,58,0.08)') : '#fff',
                            color:       addRole === r ? (r === 'superadmin' ? GOLD : NAVY) : '#9a8a7a',
                            borderColor: addRole === r ? (r === 'superadmin' ? 'rgba(196,168,130,0.5)' : 'rgba(14,42,58,0.3)') : 'rgba(196,168,130,0.3)',
                          }}>
                          {r === 'superadmin' ? '⭐ Superadmin' : '👤 Staff'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {addError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{addError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={adding}
                      className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: NAVY, color: '#fff' }}>
                      {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                      {adding ? 'Creating…' : 'Create User'}
                    </button>
                    <button type="button" onClick={() => setShowAdd(false)}
                      className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY, background: PARCH }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reset Password Modal ── */}
      <AnimatePresence>
        {resetTarget && (
          <motion.div key="reset-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(14,42,58,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={() => setResetTarget(null)}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: '#fff' }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5" style={{ background: NAVY }}>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>
                    <KeyRound size={15} /> Reset Password
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(196,168,130,0.6)' }}>
                    {resetTarget.name} · {resetTarget.email}
                  </p>
                </div>
                <button onClick={() => setResetTarget(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: 'rgba(196,168,130,0.15)', color: GOLD }}>
                  <X size={15} />
                </button>
              </div>

              {resetOk ? (
                <div className="flex flex-col items-center py-12 px-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'rgba(60,180,100,0.1)' }}>
                    <CheckCircle size={28} style={{ color: '#1e7a44' }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: NAVY }}>Password updated!</p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#7a6a5a' }}>New Password *</label>
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      value={resetPwd}
                      onChange={e => setResetPwd(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all bg-white"
                      style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY }}
                    />
                  </div>

                  {resetError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{resetError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={resetting}
                      className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: NAVY, color: '#fff' }}>
                      {resetting ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                      {resetting ? 'Saving…' : 'Set Password'}
                    </button>
                    <button type="button" onClick={() => setResetTarget(null)}
                      className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor: 'rgba(196,168,130,0.4)', color: NAVY, background: PARCH }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
}
