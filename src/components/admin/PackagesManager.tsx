/**
 * PackagesManager — admin UI for the packages catalogue + selling bundles to clients.
 * Used in /admin/scheduling under the "Packages" tab.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Package, Plus, Pencil, Trash2, Check, X, Loader2,
  ShoppingBag, Search,
} from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

interface Pkg {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  totalSessions: number;
  priceJod: number;
  serviceId?: number | null;
  serviceName?: string | null;
  validityDays: number;
  active: boolean;
}

interface Service { id: number; name: string; category: string; }
interface Customer { id: number; name: string; phone: string; }

const CATEGORIES = ['skin', 'body', 'laser', 'nails', 'other'];

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  skin:  { bg: '#fce8f3', color: '#8b1a5a' },
  body:  { bg: '#e6f1fb', color: '#0c447c' },
  laser: { bg: '#faeeda', color: '#7a5a10' },
  nails: { bg: '#eaf3de', color: '#1a6e2e' },
  other: { bg: '#f1efe8', color: '#3d3d3a' },
};

const fmt = (fils: number) => `${(fils / 100).toFixed(2)} JOD`;

export default function PackagesManager() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState<Pkg | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  // Sell-to-client panel
  const [sellPkg, setSellPkg] = useState<Pkg | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customPrice, setCustomPrice] = useState('');
  const [soldBy, setSoldBy] = useState('');
  const [selling, setSelling] = useState(false);
  const [sellMsg, setSellMsg] = useState('');

  // Form state
  const emptyForm = { name: '', description: '', category: 'skin', totalSessions: 6, priceJod: 0, serviceId: '', validityDays: 365, active: true };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pkgRes, svcRes] = await Promise.all([
        fetch('/api/scheduling/packages?all=1'),
        fetch('/api/scheduling/services'),
      ]);
      const pkgData = await pkgRes.json();
      const svcData = await svcRes.json();
      setPackages(pkgData.packages ?? []);
      setServices(svcData.services ?? svcData ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const searchCustomers = useCallback(async (q: string) => {
    if (!q.trim()) { setCustomers([]); return; }
    const res = await fetch(`/api/scheduling/customers?q=${encodeURIComponent(q)}&limit=10`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void searchCustomers(customerSearch); }, 300);
    return () => clearTimeout(t);
  }, [customerSearch, searchCustomers]);

  const openCreate = () => {
    setEditPkg(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Pkg) => {
    setEditPkg(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      category: p.category,
      totalSessions: p.totalSessions,
      priceJod: p.priceJod,
      serviceId: p.serviceId ? String(p.serviceId) : '',
      validityDays: p.validityDays,
      active: p.active,
    });
    setShowForm(true);
  };

  const saveForm = async () => {
    if (!form.name || !form.totalSessions) return;
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description || null,
        category: form.category,
        totalSessions: Number(form.totalSessions),
        priceJod: Number(form.priceJod),
        serviceId: form.serviceId ? Number(form.serviceId) : null,
        validityDays: Number(form.validityDays),
        active: form.active,
      };
      if (editPkg) {
        await fetch(`/api/scheduling/packages/${editPkg.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/scheduling/packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const deletePkg = async (p: Pkg) => {
    if (!confirm(`Delete "${p.name}"? If clients have purchased it, it will be deactivated instead.`)) return;
    await fetch(`/api/scheduling/packages/${p.id}`, { method: 'DELETE' });
    await load();
  };

  const sellToClient = async () => {
    if (!sellPkg || !selectedCustomer) return;
    setSelling(true);
    setSellMsg('');
    try {
      const res = await fetch(`/api/scheduling/customers/${selectedCustomer.id}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: sellPkg.id,
          pricePaidJod: customPrice ? Number(customPrice) : sellPkg.priceJod,
          soldBy: soldBy || 'Admin',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSellMsg(`✓ Sold! ${data.sessionsRemaining} sessions added to ${selectedCustomer.name}`);
        setTimeout(() => { setSellPkg(null); setSellMsg(''); setSelectedCustomer(null); setCustomerSearch(''); setCustomPrice(''); setSoldBy(''); }, 2500);
      } else {
        setSellMsg(`Error: ${data.error}`);
      }
    } finally {
      setSelling(false);
    }
  };

  const filtered = packages.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: NAVY }}>
            <Package size={16} style={{ color: GOLD }} /> Packages Catalogue
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
            Create session bundles, set prices, sell to clients
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
          style={{ background: NAVY, color: '#fff' }}>
          <Plus size={12} /> New Package
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search packages..."
            className="w-full text-sm outline-none pl-8 pr-3 py-2"
            style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="text-sm outline-none px-3 py-2 appearance-none"
          style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Package list */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin" style={{ color: GOLD }} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: NAVY }} />
          <p className="text-sm" style={{ color: 'hsl(20 15% 55%)' }}>No packages yet. Create your first bundle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const cat = CAT_COLORS[p.category] ?? CAT_COLORS.other;
            return (
              <div key={p.id} className="rounded p-4 flex flex-col gap-3"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)', opacity: p.active ? 1 : 0.55 }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: cat.bg, color: cat.color }}>
                        {p.category}
                      </span>
                      {!p.active && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: '#f1efe8', color: '#888' }}>inactive</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold leading-tight" style={{ color: NAVY }}>{p.name}</h3>
                    {p.description && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: 'hsl(20 15% 55%)' }}>{p.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs" style={{ color: 'hsl(20 15% 50%)' }}>
                  <span><strong style={{ color: NAVY }}>{p.totalSessions}</strong> sessions</span>
                  <span><strong style={{ color: NAVY }}>{fmt(p.priceJod)}</strong></span>
                  {p.validityDays > 0 && <span>{p.validityDays}d validity</span>}
                </div>

                {p.serviceName && (
                  <p className="text-[11px]" style={{ color: 'hsl(20 15% 55%)' }}>Service: {p.serviceName}</p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2 border-t" style={{ borderColor: 'rgba(196,168,130,0.15)' }}>
                  <button onClick={() => { setSellPkg(p); setCustomPrice(String(p.priceJod)); }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
                    style={{ background: NAVY, color: '#fff' }}>
                    <ShoppingBag size={11} /> Sell
                  </button>
                  <button onClick={() => openEdit(p)}
                    className="p-2 rounded transition-all hover:opacity-80"
                    style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => deletePkg(p)}
                    className="p-2 rounded transition-all hover:opacity-80"
                    style={{ background: '#fce8f3', color: '#b02828', border: `1px solid rgba(176,40,40,0.15)` }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit form modal ─────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.55)' }}>
          <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl"
            style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ background: NAVY }}>
              <h3 className="text-sm font-bold text-white">
                {editPkg ? 'Edit Package' : 'New Package'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-white opacity-70 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Package Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Laser Hair Removal — 6 Sessions"
                  className="w-full text-sm outline-none px-3 py-2"
                  style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Optional description..."
                  className="w-full text-sm outline-none px-3 py-2 resize-none"
                  style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full text-sm outline-none px-3 py-2 appearance-none"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Sessions *</label>
                  <input type="number" min={1} value={form.totalSessions}
                    onChange={e => setForm(f => ({ ...f, totalSessions: Number(e.target.value) }))}
                    className="w-full text-sm outline-none px-3 py-2"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Price (fils / JOD×100) *</label>
                  <input type="number" min={0} value={form.priceJod}
                    onChange={e => setForm(f => ({ ...f, priceJod: Number(e.target.value) }))}
                    className="w-full text-sm outline-none px-3 py-2"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                  <p className="text-[10px] mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>= {fmt(Number(form.priceJod))}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Validity (days, 0=none)</label>
                  <input type="number" min={0} value={form.validityDays}
                    onChange={e => setForm(f => ({ ...f, validityDays: Number(e.target.value) }))}
                    className="w-full text-sm outline-none px-3 py-2"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Linked Service (optional)</label>
                <select value={form.serviceId} onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}
                  className="w-full text-sm outline-none px-3 py-2 appearance-none"
                  style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}>
                  <option value="">— Any service —</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="text-xs font-semibold" style={{ color: NAVY }}>Active (visible for sale)</span>
              </label>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t" style={{ borderColor: 'rgba(196,168,130,0.2)' }}>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider"
                style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                Cancel
              </button>
              <button onClick={saveForm} disabled={saving || !form.name}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: NAVY, color: '#fff' }}>
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {editPkg ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sell to client modal ─────────────────────────────────────────── */}
      {sellPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,42,58,0.55)' }}>
          <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl"
            style={{ background: '#fff' }}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ background: NAVY }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag size={14} /> Sell Package
              </h3>
              <button onClick={() => { setSellPkg(null); setSelectedCustomer(null); setCustomerSearch(''); setSellMsg(''); }}
                className="text-white opacity-70 hover:opacity-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded" style={{ background: PARCH }}>
                <p className="text-xs font-bold" style={{ color: NAVY }}>{sellPkg.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                  {sellPkg.totalSessions} sessions · {fmt(sellPkg.priceJod)}
                </p>
              </div>

              {/* Customer search */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Find Customer *</label>
                <input value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); }}
                  placeholder="Search by name or phone..."
                  className="w-full text-sm outline-none px-3 py-2"
                  style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                {customers.length > 0 && !selectedCustomer && (
                  <div className="mt-1 rounded border overflow-hidden" style={{ borderColor: 'rgba(196,168,130,0.3)' }}>
                    {customers.map(c => (
                      <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setCustomers([]); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between"
                        style={{ color: NAVY, borderBottom: '1px solid rgba(196,168,130,0.15)' }}>
                        <span className="font-semibold">{c.name}</span>
                        <span style={{ color: 'hsl(20 15% 55%)' }}>{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedCustomer && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: '#1e7a44' }}>
                    ✓ {selectedCustomer.name} ({selectedCustomer.phone})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Price Paid (fils)</label>
                  <input type="number" value={customPrice} onChange={e => setCustomPrice(e.target.value)}
                    className="w-full text-sm outline-none px-3 py-2"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                  <p className="text-[10px] mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>= {fmt(Number(customPrice) || 0)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Sold By</label>
                  <input value={soldBy} onChange={e => setSoldBy(e.target.value)}
                    placeholder="Admin name"
                    className="w-full text-sm outline-none px-3 py-2"
                    style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
                </div>
              </div>

              {sellMsg && (
                <p className="text-xs font-semibold text-center py-2 rounded"
                  style={{ background: sellMsg.startsWith('✓') ? '#eaf3de' : '#fce8f3', color: sellMsg.startsWith('✓') ? '#1a6e2e' : '#b02828' }}>
                  {sellMsg}
                </p>
              )}
            </div>
            <div className="flex gap-2 px-5 py-4 border-t" style={{ borderColor: 'rgba(196,168,130,0.2)' }}>
              <button onClick={() => { setSellPkg(null); setSelectedCustomer(null); setCustomerSearch(''); setSellMsg(''); }}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider"
                style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
                Cancel
              </button>
              <button onClick={sellToClient} disabled={selling || !selectedCustomer}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: NAVY, color: '#fff' }}>
                {selling ? <Loader2 size={12} className="animate-spin" /> : <ShoppingBag size={12} />}
                Sell Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
