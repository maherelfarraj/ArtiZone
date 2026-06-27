/**
 * /admin/loyalty — Loyalty client list with search, filter, and add-client modal
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Search, Plus, Users, Crown, Star, Award,
  Phone, Mail, ChevronRight, Loader2, X, CheckCircle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const SAGE  = '#6B7260';
const CREAM = '#F7F3EE';

interface LoyaltyClient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  tier: string;
  status: string;
  pointsBalance: number;
  pointsEarnedTotal: number;
  visits: number;
  area?: string;
  createdAt: string;
}

const TIER_COLORS: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  glow:     { bg: '#FFF8F0', text: '#C4A882', icon: Star },
  silver:   { bg: '#F0F4F8', text: '#607D8B', icon: Award },
  gold:     { bg: '#FFF3CD', text: '#B8860B', icon: Award },
  platinum: { bg: '#F0F0F0', text: '#555',    icon: Crown },
};

function TierBadge({ tier }: { tier: string }) {
  const cfg = TIER_COLORS[tier] ?? TIER_COLORS.glow;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ background: cfg.bg, color: cfg.text }}>
      <Icon size={10} />
      {tier}
    </span>
  );
}

interface AddClientForm {
  name: string; phone: string; email: string;
  dateOfBirth: string; address: string; area: string;
}

const EMPTY_FORM: AddClientForm = {
  name: '', phone: '', email: '', dateOfBirth: '', address: '', area: '',
};

export default function AdminLoyaltyPage() {
  const [clients, setClients]     = useState<LoyaltyClient[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [tierFilter, setTier]     = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState<AddClientForm>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [saveErr, setSaveErr]     = useState('');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)       params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);
    if (tierFilter)   params.set('tier', tierFilter);
    try {
      const r = await fetch(`/api/admin/loyalty/clients?${params}`);
      const d = await r.json();
      setClients(d.clients ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [search, statusFilter, tierFilter]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErr(''); setSaving(true);
    try {
      const r = await fetch('/api/admin/loyalty/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { setSaveErr(d.error ?? 'Failed'); setSaving(false); return; }
      setShowAdd(false);
      setForm(EMPTY_FORM);
      fetchClients();
    } catch { setSaveErr('Network error.'); }
    setSaving(false);
  };

  const stats = {
    total:    clients.length,
    active:   clients.filter(c => c.status === 'active').length,
    gold:     clients.filter(c => c.tier === 'gold').length,
    platinum: clients.filter(c => c.tier === 'platinum').length,
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Loyalty Clients — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: NAVY }}>
              Loyalty Clients
            </h1>
            <p className="text-sm mt-1" style={{ color: SAGE }}>Manage ArtiZone Rewards members</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: NAVY, color: '#fff' }}
          >
            <Plus size={15} /> Add Client
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Members', value: stats.total,    icon: Users,  color: NAVY },
            { label: 'Active',        value: stats.active,   icon: CheckCircle, color: '#16a34a' },
            { label: 'Radiant Tier',  value: stats.gold,     icon: Award,  color: '#B8860B' },
            { label: 'Platinum',      value: stats.platinum, icon: Crown,  color: '#777' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 border"
              style={{ background: '#fff', borderColor: 'rgba(14,42,58,0.08)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color }} />
                <span className="text-xs font-medium" style={{ color: SAGE }}>{label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: NAVY, fontFamily: 'var(--font-heading)' }}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SAGE }} />
            <input
              type="text" placeholder="Search name, phone, email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-2"
              style={{ borderColor: 'rgba(14,42,58,0.15)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border outline-none"
            style={{ borderColor: 'rgba(14,42,58,0.15)', color: NAVY }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={tierFilter} onChange={e => setTier(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border outline-none"
            style={{ borderColor: 'rgba(14,42,58,0.15)', color: NAVY }}>
            <option value="">All Tiers</option>
            <option value="glow">Glow</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin" style={{ color: GOLD }} />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed"
            style={{ borderColor: 'rgba(14,42,58,0.15)', color: SAGE }}>
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No clients found</p>
            <p className="text-sm mt-1 opacity-70">Add your first loyalty member to get started.</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(14,42,58,0.1)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: CREAM }}>
                    {['Client', 'Contact', 'Tier', 'Points', 'Visits', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: SAGE }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c, i) => (
                    <tr key={c.id}
                      className="border-t transition-colors hover:bg-amber-50/30"
                      style={{ borderColor: 'rgba(14,42,58,0.06)', background: i % 2 === 0 ? '#fff' : '#fdfaf6' }}>
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: NAVY }}>{c.name}</p>
                        {c.area && <p className="text-xs mt-0.5" style={{ color: SAGE }}>{c.area}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: NAVY }}>
                            <Phone size={10} style={{ color: SAGE }} />{c.phone}
                          </span>
                          {c.email && (
                            <span className="flex items-center gap-1.5 text-xs" style={{ color: SAGE }}>
                              <Mail size={10} />{c.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3"><TierBadge tier={c.tier} /></td>
                      <td className="px-4 py-3">
                        <span className="font-bold" style={{ color: NAVY }}>{c.pointsBalance.toLocaleString()}</span>
                        <span className="text-xs ml-1" style={{ color: SAGE }}>pts</span>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{c.visits}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/loyalty/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity"
                          style={{ color: NAVY }}>
                          View <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(14,42,58,0.1)', background: NAVY }}>
              <h2 className="font-bold text-base" style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>
                Add New Client
              </h2>
              <button onClick={() => setShowAdd(false)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={18} style={{ color: GOLD }} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  ['name', 'Full Name *', 'text'],
                  ['phone', 'Mobile Number *', 'tel'],
                  ['email', 'Email Address', 'email'],
                  ['dateOfBirth', 'Date of Birth', 'date'],
                  ['area', 'Area / District', 'text'],
                ] as [keyof AddClientForm, string, string][]).map(([key, label, type]) => (
                  <div key={key} className={key === 'name' || key === 'phone' ? '' : ''}>
                    <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required={key === 'name' || key === 'phone'}
                      className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                      style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: SAGE }}>Full Address</label>
                <input
                  type="text" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', '--tw-ring-color': `${GOLD}55` } as React.CSSProperties}
                />
              </div>
              {saveErr && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{saveErr}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
                  style={{ borderColor: 'rgba(14,42,58,0.2)', color: NAVY }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: NAVY, color: '#fff' }}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {saving ? 'Saving…' : 'Add Client'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
