/**
 * ServicesMenu — admin reference & management panel for all services and packages.
 * Shows every service grouped by category with price, duration, and inline editing.
 * Packages section below with full CRUD.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Check, X, Loader2, ChevronDown,
  Clock, Tag, Layers, Package, Printer, Search, ToggleLeft, ToggleRight,
} from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';
const IVORY = '#FDFAF6';

interface Service {
  id: number;
  name: string;
  category: string;
  durationMin: number;
  bufferMin: number;
  price: number;
  active: boolean;
  requiredCapability?: string | null;
  defaultStaffId?: number | null;
  defaultStaffName?: string | null;
}

interface StaffMember { id: number; name: string; role?: string | null; skills: string[]; }

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

const CATEGORIES: { key: string; label: string; emoji: string; bg: string; color: string; border: string }[] = [
  { key: 'face-skin-care',   label: 'Face & Skin Care',   emoji: '✨', bg: '#fce8f3', color: '#8b1a5a', border: '#e8a0c8' },
  { key: 'body-treatments',  label: 'Body Treatments',    emoji: '💆', bg: '#e6f1fb', color: '#0c447c', border: '#90bce8' },
  { key: 'laser-advanced',   label: 'Laser & Advanced',   emoji: '⚡', bg: '#faeeda', color: '#7a5a10', border: '#e8c878' },
  { key: 'nails-extensions', label: 'Nails & Extensions', emoji: '💅', bg: '#eaf3de', color: '#1a6e2e', border: '#90c878' },
  { key: 'mens-treatments',  label: "Men's Treatments",   emoji: '🧔', bg: '#f1efe8', color: '#3d3d3a', border: '#c8c0a8' },
];

const BLANK_SVC: Omit<Service, 'id'> = {
  name: '', category: 'face-skin-care', durationMin: 45, bufferMin: 10, price: 0, active: true,
  defaultStaffId: null, defaultStaffName: null,
};

const BLANK_PKG: Omit<Pkg, 'id'> = {
  name: '', description: '', category: 'face-skin-care', totalSessions: 5,
  priceJod: 0, serviceId: null, validityDays: 180, active: true,
};

const fmt = (fils: number) => `${(fils / 100).toFixed(0)} JOD`;

export default function ServicesMenu() {
  const [view, setView] = useState<'services' | 'packages'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Service form state
  const [editSvc, setEditSvc] = useState<Service | null>(null);
  const [newSvc, setNewSvc] = useState<Omit<Service, 'id'> | null>(null);
  const [_savingSvc, setSavingSvc] = useState(false);

  // Package form state
  const [editPkg, setEditPkg] = useState<Pkg | null>(null);
  const [newPkg, setNewPkg] = useState<Omit<Pkg, 'id'> | null>(null);
  const [savingPkg, setSavingPkg] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [svcs, pkgs, stf] = await Promise.all([
        fetch('/api/scheduling/services').then(r => r.json()),
        fetch('/api/scheduling/packages').then(r => r.json()),
        fetch('/api/scheduling/staff').then(r => r.json()),
      ]);
      setServices(Array.isArray(svcs) ? svcs : []);
      setPackages(Array.isArray(pkgs?.packages) ? pkgs.packages : []);
      setAllStaff(Array.isArray(stf) ? stf : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Service CRUD ────────────────────────────────────────────────────────────
  const saveService = async () => {
    const data = editSvc ?? newSvc;
    if (!data) return;
    if (!data.name.trim()) return;
    setSavingSvc(true);
    try {
      if (editSvc) {
        await fetch(`/api/scheduling/services/${editSvc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setEditSvc(null);
      } else {
        await fetch('/api/scheduling/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setNewSvc(null);
      }
      await load();
    } finally {
      setSavingSvc(false);
    }
  };

  const toggleSvcActive = async (svc: Service) => {
    await fetch(`/api/scheduling/services/${svc.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !svc.active }),
    });
    await load();
  };

  const deleteService = async (id: number) => {
    if (!confirm('Remove this service? It will be deactivated.')) return;
    await fetch(`/api/scheduling/services/${id}`, { method: 'DELETE' });
    await load();
  };

  // ── Package CRUD ────────────────────────────────────────────────────────────
  const savePackage = async () => {
    const data = editPkg ?? newPkg;
    if (!data) return;
    if (!data.name.trim()) return;
    setSavingPkg(true);
    try {
      if (editPkg) {
        await fetch(`/api/scheduling/packages/${editPkg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setEditPkg(null);
      } else {
        await fetch('/api/scheduling/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        setNewPkg(null);
      }
      await load();
    } finally {
      setSavingPkg(false);
    }
  };

  const deletePkg = async (id: number) => {
    if (!confirm('Remove this package?')) return;
    await fetch(`/api/scheduling/packages/${id}`, { method: 'DELETE' });
    await load();
  };

  // ── Filtered lists ──────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredSvcs = services.filter(s =>
    (showInactive || s.active) &&
    (!q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
  );
  const filteredPkgs = packages.filter(p =>
    (showInactive || p.active) &&
    (!q || p.name.toLowerCase().includes(q))
  );

  // ── Inline form row — defined as module-level component below ───────────────

  return (
    <div className="space-y-6">

      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Services & Packages Menu</h2>
          <p className="text-xs mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
            {services.filter(s => s.active).length} active services · {packages.filter(p => p.active).length} packages
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…" className="pl-8 pr-3 py-2 text-xs rounded outline-none w-44"
              style={{ background: PARCH, border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }} />
          </div>
          {/* Show inactive toggle */}
          <button onClick={() => setShowInactive(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: showInactive ? NAVY : PARCH, color: showInactive ? '#fff' : NAVY }}>
            {showInactive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
            {showInactive ? 'Showing all' : 'Active only'}
          </button>
          {/* Print */}
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold"
            style={{ background: PARCH, color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
            <Printer size={13} /> Print menu
          </button>
        </div>
      </div>

      {/* ── View toggle ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded w-fit" style={{ background: PARCH }}>
        {([
          { key: 'services', icon: <Tag size={13} />,     label: 'Services' },
          { key: 'packages', icon: <Package size={13} />, label: 'Packages' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setView(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all"
            style={{ background: view === t.key ? NAVY : 'transparent', color: view === t.key ? '#fff' : NAVY }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center" style={{ color: GOLD }}>
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {!loading && view === 'services' && (
        <div className="space-y-6">
          {CATEGORIES.map(cat => {
            const catSvcs = filteredSvcs.filter(s => s.category === cat.key);
            if (catSvcs.length === 0 && !newSvc) return null;
            const isAddingHere = newSvc?.category === cat.key;

            return (
              <div key={cat.key} className="rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${cat.border}55`, boxShadow: '0 2px 12px rgba(14,42,58,0.04)' }}>

                {/* Category header */}
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ background: cat.bg, borderBottom: `1px solid ${cat.border}44` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-sm font-bold uppercase tracking-wider" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: cat.color + '22', color: cat.color }}>
                      {catSvcs.length} service{catSvcs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => setNewSvc({ ...BLANK_SVC, category: cat.key })}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all"
                    style={{ background: cat.color + '22', color: cat.color }}>
                    <Plus size={11} /> Add service
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto" style={{ background: IVORY }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `1px solid rgba(196,168,130,0.15)`, background: PARCH }}>
                        <th className="text-left px-5 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Service</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Category</th>
                        <th className="text-center px-3 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Duration</th>
                        <th className="text-center px-3 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Price</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Default Therapist</th>
                        <th className="text-right px-5 py-2.5 font-semibold text-xs uppercase tracking-wider" style={{ color: NAVY }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Add new row */}
                      {isAddingHere && newSvc && (
                        <SvcFormRow
                          data={newSvc}
                          allStaff={allStaff}
                          onChange={(k, v) => setNewSvc(prev => prev ? { ...prev, [k]: v } : prev)}
                          onSave={saveService}
                          onCancel={() => setNewSvc(null)}
                        />
                      )}

                      {catSvcs.length === 0 && !isAddingHere && (
                        <tr>
                          <td colSpan={5} className="px-5 py-4 text-xs text-center" style={{ color: 'hsl(20 15% 60%)' }}>
                            No services in this category yet.
                          </td>
                        </tr>
                      )}

                      {catSvcs.map((svc, i) => {
                        const isEditing = editSvc?.id === svc.id;
                        return isEditing ? (
                          <SvcFormRow
                            key={svc.id}
                            data={editSvc!}
                            allStaff={allStaff}
                            onChange={(k, v) => setEditSvc(prev => prev ? { ...prev, [k]: v } : prev)}
                            onSave={saveService}
                            onCancel={() => setEditSvc(null)}
                          />
                        ) : (
                          <tr key={svc.id}
                            style={{
                              background: i % 2 === 0 ? IVORY : PARCH,
                              borderBottom: `1px solid rgba(196,168,130,0.08)`,
                              opacity: svc.active ? 1 : 0.5,
                            }}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold" style={{ color: NAVY }}>{svc.name}</span>
                                {!svc.active && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                                    style={{ background: 'rgba(0,0,0,0.06)', color: 'hsl(20 15% 55%)' }}>
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{ background: cat.bg, color: cat.color }}>
                                {cat.label}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-1" style={{ color: NAVY }}>
                                <Clock size={12} style={{ color: GOLD }} />
                                <span className="font-semibold">{svc.durationMin}</span>
                                <span className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>min</span>
                                {svc.bufferMin > 0 && (
                                  <span className="text-[10px] ml-1" style={{ color: 'hsl(20 15% 60%)' }}>
                                    +{svc.bufferMin} buffer
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="font-bold text-sm" style={{ color: NAVY }}>{fmt(svc.price)}</span>
                            </td>
                            <td className="px-3 py-3">
                              {svc.defaultStaffName ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                    style={{ background: `${GOLD}33`, color: NAVY }}>
                                    {svc.defaultStaffName.slice(0, 2).toUpperCase()}
                                  </div>
                                  <span className="text-xs font-semibold" style={{ color: NAVY }}>{svc.defaultStaffName}</span>
                                </div>
                              ) : (
                                <span className="text-xs" style={{ color: 'hsl(20 15% 65%)' }}>— unassigned —</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => setEditSvc({ ...svc })}
                                  className="p-1.5 rounded transition-all hover:opacity-80"
                                  style={{ background: `${GOLD}22`, color: NAVY }} title="Edit">
                                  <Pencil size={12} />
                                </button>
                                <button onClick={() => toggleSvcActive(svc)}
                                  className="p-1.5 rounded transition-all hover:opacity-80"
                                  style={{ background: svc.active ? 'rgba(0,0,0,0.06)' : `${GOLD}22`, color: NAVY }}
                                  title={svc.active ? 'Deactivate' : 'Activate'}>
                                  {svc.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                </button>
                                <button onClick={() => deleteService(svc.id)}
                                  className="p-1.5 rounded transition-all hover:opacity-80"
                                  style={{ background: 'rgba(220,50,50,0.08)', color: '#c03030' }} title="Delete">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Category total */}
                {catSvcs.length > 0 && (
                  <div className="flex items-center justify-between px-5 py-2"
                    style={{ background: cat.bg, borderTop: `1px solid ${cat.border}44` }}>
                    <span className="text-xs" style={{ color: cat.color }}>
                      {catSvcs.filter(s => s.active).length} active · avg {Math.round(catSvcs.filter(s=>s.active).reduce((a,s)=>a+s.durationMin,0) / Math.max(catSvcs.filter(s=>s.active).length,1))} min
                    </span>
                    <span className="text-xs font-bold" style={{ color: cat.color }}>
                      Range: {fmt(Math.min(...catSvcs.filter(s=>s.active).map(s=>s.price)))} – {fmt(Math.max(...catSvcs.filter(s=>s.active).map(s=>s.price)))}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary card */}
          <div className="rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ background: NAVY }}>
            {[
              { label: 'Total Services',  value: services.filter(s=>s.active).length },
              { label: 'Categories',      value: CATEGORIES.length },
              { label: 'Avg Price',       value: fmt(Math.round(services.filter(s=>s.active).reduce((a,s)=>a+s.price,0)/Math.max(services.filter(s=>s.active).length,1))) },
              { label: 'Avg Duration',    value: `${Math.round(services.filter(s=>s.active).reduce((a,s)=>a+s.durationMin,0)/Math.max(services.filter(s=>s.active).length,1))} min` },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold" style={{ color: GOLD }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(196,168,130,0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PACKAGES VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {!loading && view === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>
              Session bundles sold to clients at a discounted rate.
            </p>
            <button onClick={() => setNewPkg({ ...BLANK_PKG })}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold"
              style={{ background: NAVY, color: '#fff' }}>
              <Plus size={12} /> New package
            </button>
          </div>

          {/* New package form */}
          {newPkg && (
            <PkgForm
              data={newPkg}
              services={services}
              saving={savingPkg}
              onChange={(k, v) => setNewPkg(prev => prev ? { ...prev, [k]: v } : prev)}
              onSave={savePackage}
              onCancel={() => setNewPkg(null)}
              title="New Package"
            />
          )}

          {filteredPkgs.length === 0 && !newPkg && (
            <div className="text-center py-12 rounded-xl" style={{ background: PARCH }}>
              <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: NAVY }} />
              <p className="text-sm font-semibold" style={{ color: NAVY }}>No packages yet</p>
              <p className="text-xs mt-1" style={{ color: 'hsl(20 15% 55%)' }}>
                Create bundles like "5 Hydrafacial sessions for 200 JOD"
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPkgs.map(pkg => {
              const cat = CATEGORIES.find(c => c.key === pkg.category) ?? CATEGORIES[0];
              const isEditing = editPkg?.id === pkg.id;
              if (isEditing) return (
                <div key={pkg.id} className="sm:col-span-2 lg:col-span-3">
                  <PkgForm
                    data={editPkg!}
                    services={services}
                    saving={savingPkg}
                    onChange={(k, v) => setEditPkg(prev => prev ? { ...prev, [k]: v } : prev)}
                    onSave={savePackage}
                    onCancel={() => setEditPkg(null)}
                    title={`Edit: ${pkg.name}`}
                  />
                </div>
              );
              return (
                <div key={pkg.id} className="rounded-xl overflow-hidden"
                  style={{
                    border: `1.5px solid ${cat.border}55`,
                    opacity: pkg.active ? 1 : 0.55,
                    boxShadow: '0 2px 12px rgba(14,42,58,0.05)',
                  }}>
                  {/* Card header */}
                  <div className="px-4 py-3 flex items-start justify-between gap-2"
                    style={{ background: cat.bg, borderBottom: `1px solid ${cat.border}44` }}>
                    <div>
                      <div className="font-bold text-sm" style={{ color: cat.color }}>{pkg.name}</div>
                      {pkg.description && (
                        <div className="text-xs mt-0.5" style={{ color: cat.color + 'bb' }}>{pkg.description}</div>
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                      style={{ background: cat.color + '22', color: cat.color }}>
                      {cat.label}
                    </span>
                  </div>
                  {/* Card body */}
                  <div className="px-4 py-3 space-y-2" style={{ background: IVORY }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Layers size={13} style={{ color: GOLD }} />
                        <span className="text-xs" style={{ color: NAVY }}>
                          <strong>{pkg.totalSessions}</strong> sessions
                        </span>
                      </div>
                      <div className="text-lg font-bold" style={{ color: NAVY }}>{pkg.priceJod} JOD</div>
                    </div>
                    {pkg.serviceName && (
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} style={{ color: GOLD }} />
                        <span className="text-xs" style={{ color: 'hsl(20 15% 50%)' }}>{pkg.serviceName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} style={{ color: GOLD }} />
                      <span className="text-xs" style={{ color: 'hsl(20 15% 50%)' }}>
                        Valid {pkg.validityDays} days · {(pkg.priceJod / pkg.totalSessions).toFixed(1)} JOD/session
                      </span>
                    </div>
                    {!pkg.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                        style={{ background: 'rgba(0,0,0,0.06)', color: 'hsl(20 15% 55%)' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  {/* Card actions */}
                  <div className="flex items-center gap-2 px-4 py-2.5"
                    style={{ background: PARCH, borderTop: `1px solid rgba(196,168,130,0.15)` }}>
                    <button onClick={() => setEditPkg({ ...pkg })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold"
                      style={{ background: `${GOLD}22`, color: NAVY }}>
                      <Pencil size={11} /> Edit
                    </button>
                    <button onClick={() => deletePkg(pkg.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold"
                      style={{ background: 'rgba(220,50,50,0.08)', color: '#c03030' }}>
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Package form sub-component ─────────────────────────────────────────────────
function PkgForm({ data, services, saving, onChange, onSave, onCancel, title }: {
  data: Partial<Pkg>;
  services: Service[];
  saving: boolean;
  onChange: (k: string, v: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}) {
  const NAVY  = '#0E2A3A';
  const GOLD  = '#C4A882';
  const PARCH = '#F7F3EE';

  return (
    <div className="rounded-xl p-5 space-y-4"
      style={{ background: PARCH, border: `2px solid ${GOLD}55` }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: NAVY }}>{title}</span>
        <button onClick={onCancel} className="p-1 rounded" style={{ color: NAVY }}>
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Package name', key: 'name', type: 'text', placeholder: 'e.g. Hydrafacial Bundle' },
          { label: 'Description', key: 'description', type: 'text', placeholder: 'Optional short description' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>{f.label}</label>
            <input type={f.type} value={(data as Record<string,unknown>)[f.key] as string ?? ''}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full text-sm px-3 py-2 rounded outline-none"
              style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Category</label>
          <div className="relative">
            <select value={data.category ?? 'skin'} onChange={e => onChange('category', e.target.value)}
              className="w-full text-sm px-3 py-2 rounded appearance-none outline-none pr-7"
              style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Linked service (optional)</label>
          <div className="relative">
            <select value={data.serviceId ?? ''} onChange={e => onChange('serviceId', e.target.value ? Number(e.target.value) : null)}
              className="w-full text-sm px-3 py-2 rounded appearance-none outline-none pr-7"
              style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }}>
              <option value="">— Any service —</option>
              {services.filter(s => s.active).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Sessions</label>
          <input type="number" min={1} max={50} value={data.totalSessions ?? 5}
            onChange={e => onChange('totalSessions', Number(e.target.value))}
            className="w-full text-sm px-3 py-2 rounded outline-none"
            style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Price (JOD)</label>
          <input type="number" min={0} step={1} value={data.priceJod ?? 0}
            onChange={e => onChange('priceJod', Number(e.target.value))}
            className="w-full text-sm px-3 py-2 rounded outline-none"
            style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>Validity (days)</label>
          <input type="number" min={30} step={30} value={data.validityDays ?? 180}
            onChange={e => onChange('validityDays', Number(e.target.value))}
            className="w-full text-sm px-3 py-2 rounded outline-none"
            style={{ background: '#fff', border: `1.5px solid rgba(196,168,130,0.4)`, color: NAVY }} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 rounded text-sm font-semibold"
          style={{ background: NAVY, color: '#fff' }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Save package
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded text-sm font-semibold"
          style={{ background: '#fff', color: NAVY, border: `1px solid rgba(196,168,130,0.3)` }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// Re-export SvcFormRow as a local component used inside ServicesMenu
function SvcFormRow({ data, allStaff, onChange, onSave, onCancel }: {
  data: Partial<Service>;
  allStaff: StaffMember[];
  onChange: (k: string, v: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const NAVY  = '#0E2A3A';
  const GOLD  = '#C4A882';
  const PARCH = '#F7F3EE';
  const [saving] = useState(false);

  // Filter staff qualified for this service's category
  const cat = data.category ?? 'skin';
  const qualifiedStaff = allStaff.filter(s => s.skills.includes(cat));
  const otherStaff     = allStaff.filter(s => !s.skills.includes(cat));

  return (
    <tr style={{ background: `${GOLD}18`, borderBottom: `2px solid ${GOLD}55` }}>
      <td className="px-3 py-2">
        <input autoFocus value={data.name ?? ''} onChange={e => onChange('name', e.target.value)}
          placeholder="Service name" className="w-full text-sm px-2 py-1.5 rounded outline-none"
          style={{ background: '#fff', border: `1.5px solid ${GOLD}88`, color: NAVY }} />
      </td>
      <td className="px-3 py-2">
        <div className="relative">
          <select value={data.category ?? 'skin'} onChange={e => onChange('category', e.target.value)}
            className="w-full text-sm px-2 py-1.5 rounded appearance-none outline-none pr-6"
            style={{ background: '#fff', border: `1.5px solid ${GOLD}88`, color: NAVY }}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <input type="number" min={5} max={240} value={data.durationMin ?? 45}
            onChange={e => onChange('durationMin', Number(e.target.value))}
            className="w-16 text-sm px-2 py-1.5 rounded outline-none text-center"
            style={{ background: '#fff', border: `1.5px solid ${GOLD}88`, color: NAVY }} />
          <span className="text-xs" style={{ color: NAVY }}>min</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <input type="number" min={0} step={100} value={data.price ?? 0}
            onChange={e => onChange('price', Number(e.target.value))}
            className="w-20 text-sm px-2 py-1.5 rounded outline-none text-center"
            style={{ background: '#fff', border: `1.5px solid ${GOLD}88`, color: NAVY }} />
          <span className="text-xs" style={{ color: NAVY }}>fils</span>
        </div>
      </td>
      {/* Default therapist picker */}
      <td className="px-3 py-2">
        <div className="relative">
          <select
            value={data.defaultStaffId ?? ''}
            onChange={e => onChange('defaultStaffId', e.target.value ? Number(e.target.value) : null)}
            className="w-full text-sm px-2 py-1.5 rounded appearance-none outline-none pr-6"
            style={{ background: '#fff', border: `1.5px solid ${GOLD}88`, color: NAVY }}>
            <option value="">— None —</option>
            {qualifiedStaff.length > 0 && (
              <optgroup label={`✓ Qualified (${cat})`}>
                {qualifiedStaff.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </optgroup>
            )}
            {otherStaff.length > 0 && (
              <optgroup label="Other staff">
                {otherStaff.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: GOLD }} />
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1.5">
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold"
            style={{ background: NAVY, color: '#fff' }}>
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            Save
          </button>
          <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold"
            style={{ background: PARCH, color: NAVY }}>
            <X size={11} /> Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}
