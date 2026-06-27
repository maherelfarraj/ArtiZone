/**
 * TeamRoomsSettings — manage staff (with skill chips), rooms/machines, and skills matrix
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Loader2, Check, X, Users, Building2, LayoutGrid } from 'lucide-react';

const NAVY  = '#0E2A3A';
const GOLD  = '#C4A882';
const PARCH = '#F7F3EE';

const ALL_SKILLS = ['skin', 'body', 'laser', 'nails', 'other'] as const;
type Skill = typeof ALL_SKILLS[number];

const SKILL_META: Record<Skill, { label: string; color: string; bg: string }> = {
  skin:  { label: 'Skin',  color: '#7a5a10', bg: '#faeeda' },
  body:  { label: 'Body',  color: '#1a6e2e', bg: '#eaf3de' },
  laser: { label: 'Laser', color: '#0c447c', bg: '#e6f1fb' },
  nails: { label: 'Nails', color: '#8b1a5a', bg: '#fce8f3' },
  other: { label: 'Other', color: '#3d3d3a', bg: '#f1efe8' },
};

interface StaffMember { id: number; name: string; role?: string | null; active: boolean; skills: Skill[]; }
interface Room { id: number; name: string; type: string; active: boolean; capabilities: string[]; }
interface Service { id: number; name: string; category: string; durationMin: number; price: number; }
interface Package { id: number; name: string; category: string; totalSessions: number; priceJod: number; serviceId?: number | null; }

type Tab = 'staff' | 'rooms' | 'matrix';

export default function TeamRoomsSettings() {
  const [tab, setTab] = useState<Tab>('staff');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  // New staff form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState<Skill[]>([]);
  const [addingStaff, setAddingStaff] = useState(false);

  // New room form
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'room' | 'machine'>('room');
  const [newRoomCaps, setNewRoomCaps] = useState<string[]>([]);
  const [addingRoom, setAddingRoom] = useState(false);

  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [stf, rms, svcs, pkgs] = await Promise.all([
        fetch('/api/scheduling/staff').then(r => r.json()),
        fetch('/api/scheduling/rooms').then(r => r.json()),
        fetch('/api/scheduling/services').then(r => r.json()),
        fetch('/api/scheduling/packages').then(r => r.json()),
      ]);
      setStaff(Array.isArray(stf) ? stf : []);
      setRooms(Array.isArray(rms) ? rms : []);
      setServices(Array.isArray(svcs) ? svcs : []);
      setPackages(Array.isArray(pkgs?.packages) ? pkgs.packages : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleSkill = (s: Skill) => {
    setNewSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleAddStaff = async () => {
    if (!newName.trim()) return;
    setAddingStaff(true);
    setError('');
    try {
      const res = await fetch('/api/scheduling/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), role: newRole.trim() || undefined, skills: newSkills }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setNewName(''); setNewRole(''); setNewSkills([]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setAddingStaff(false);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Deactivate this staff member? Past appointments will be preserved.')) return;
    await fetch(`/api/scheduling/staff/${id}`, { method: 'DELETE' });
    await load();
  };

  const handleUpdateSkills = async (id: number, skills: Skill[]) => {
    await fetch(`/api/scheduling/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    await load();
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;
    setAddingRoom(true);
    setError('');
    try {
      const res = await fetch('/api/scheduling/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoomName.trim(), type: newRoomType, capabilities: newRoomCaps }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setNewRoomName(''); setNewRoomType('room'); setNewRoomCaps([]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setAddingRoom(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Deactivate this room? Past appointments will be preserved.')) return;
    await fetch(`/api/scheduling/rooms/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded flex-wrap" style={{ background: PARCH, width: 'fit-content' }}>
        {([
          { key: 'staff',  icon: <Users size={13} />,       label: 'Therapists & Skills' },
          { key: 'rooms',  icon: <Building2 size={13} />,   label: 'Rooms & Machines' },
          { key: 'matrix', icon: <LayoutGrid size={13} />,  label: 'Skills Matrix' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all"
            style={{
              background: tab === t.key ? NAVY : 'transparent',
              color: tab === t.key ? '#fff' : NAVY,
            }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs px-3 py-2 rounded mb-4" style={{ background: 'rgba(220,60,60,0.08)', color: '#b02828', border: '1px solid rgba(220,60,60,0.2)' }}>
          {error}
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'hsl(20 15% 55%)' }}>
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      )}

      {/* ── Staff tab ─────────────────────────────────────────────────────── */}
      {tab === 'staff' && (
        <div className="space-y-3">
          {staff.map(s => (
            <motion.div key={s.id} layout
              className="flex items-start gap-4 p-4 rounded"
              style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${GOLD}22`, color: NAVY }}>
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{s.name}</span>
                  {s.role && <span className="text-xs" style={{ color: 'hsl(20 15% 55%)' }}>{s.role}</span>}
                </div>
                {/* Skill chips — clickable to toggle */}
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SKILLS.map(skill => {
                    const active = s.skills.includes(skill);
                    const meta = SKILL_META[skill];
                    return (
                      <button
                        key={skill}
                        onClick={() => {
                          const next = active ? s.skills.filter(x => x !== skill) : [...s.skills, skill];
                          handleUpdateSkills(s.id, next as Skill[]);
                        }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-all hover:opacity-80"
                        style={{
                          background: active ? meta.bg : 'rgba(0,0,0,0.04)',
                          color: active ? meta.color : 'hsl(20 15% 60%)',
                          border: `1px solid ${active ? meta.color + '44' : 'rgba(0,0,0,0.08)'}`,
                        }}
                      >
                        {active && <Check size={8} className="inline mr-0.5" />}
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => handleDeleteStaff(s.id)}
                className="p-1.5 rounded hover:bg-red-50 transition-colors shrink-0">
                <Trash2 size={14} style={{ color: '#b02828' }} />
              </button>
            </motion.div>
          ))}

          {/* Add new staff */}
          <div className="p-4 rounded" style={{ background: PARCH, border: `1.5px dashed rgba(196,168,130,0.4)` }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Add Therapist</p>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Full name"
                className="flex-1 text-sm outline-none px-3 py-2"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}
              />
              <input
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="Role (e.g. Esthetician)"
                className="flex-1 text-sm outline-none px-3 py-2"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ALL_SKILLS.map(skill => {
                const active = newSkills.includes(skill);
                const meta = SKILL_META[skill];
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-all"
                    style={{
                      background: active ? meta.bg : '#fff',
                      color: active ? meta.color : 'hsl(20 15% 55%)',
                      border: `1px solid ${active ? meta.color + '44' : 'rgba(0,0,0,0.1)'}`,
                    }}>
                    {active && <Check size={8} className="inline mr-0.5" />}
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleAddStaff}
              disabled={addingStaff || !newName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: NAVY, color: '#fff' }}>
              {addingStaff ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add
            </button>
          </div>
        </div>
      )}

      {/* ── Rooms tab ─────────────────────────────────────────────────────── */}
      {tab === 'rooms' && (
        <div className="space-y-3">
          {rooms.map(r => (
            <motion.div key={r.id} layout
              className="flex items-center gap-4 p-4 rounded"
              style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.2)`, boxShadow: '0 2px 8px rgba(14,42,58,0.04)' }}>
              <div className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                style={{ background: `${GOLD}22` }}>
                <Building2 size={16} style={{ color: NAVY }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{r.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    style={{ background: r.type === 'machine' ? '#e6f1fb' : '#f1efe8', color: r.type === 'machine' ? '#0c447c' : '#3d3d3a' }}>
                    {r.type}
                  </span>
                  {r.capabilities.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                      style={{ background: '#e6f1fb', color: '#0c447c' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDeleteRoom(r.id)}
                className="p-1.5 rounded hover:bg-red-50 transition-colors shrink-0">
                <Trash2 size={14} style={{ color: '#b02828' }} />
              </button>
            </motion.div>
          ))}

          {/* Add new room */}
          <div className="p-4 rounded" style={{ background: PARCH, border: `1.5px dashed rgba(196,168,130,0.4)` }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Add Room or Machine</p>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                value={newRoomName}
                onChange={e => setNewRoomName(e.target.value)}
                placeholder="Room name (e.g. Treatment Room 4)"
                className="flex-1 text-sm outline-none px-3 py-2"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}
              />
              <select
                value={newRoomType}
                onChange={e => setNewRoomType(e.target.value as 'room' | 'machine')}
                className="text-sm outline-none px-3 py-2 appearance-none"
                style={{ background: '#fff', border: `1px solid rgba(196,168,130,0.3)`, color: NAVY }}>
                <option value="room">Room</option>
                <option value="machine">Machine</option>
              </select>
            </div>
            {/* Capabilities */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['laser'].map(cap => {
                const active = newRoomCaps.includes(cap);
                return (
                  <button key={cap} onClick={() => setNewRoomCaps(prev => active ? prev.filter(c => c !== cap) : [...prev, cap])}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-all"
                    style={{
                      background: active ? '#e6f1fb' : '#fff',
                      color: active ? '#0c447c' : 'hsl(20 15% 55%)',
                      border: `1px solid ${active ? '#0c447c44' : 'rgba(0,0,0,0.1)'}`,
                    }}>
                    {active && <Check size={8} className="inline mr-0.5" />}
                    Laser capability
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleAddRoom}
              disabled={addingRoom || !newRoomName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: NAVY, color: '#fff' }}>
              {addingRoom ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add
            </button>
          </div>
        </div>
      )}

      {/* ── Skills Matrix tab ──────────────────────────────────────────────── */}
      {tab === 'matrix' && (
        <div className="space-y-8">

          {/* ── Therapist × Service matrix ─────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
              Who can perform which service
            </h3>
            {ALL_SKILLS.map(cat => {
              const catServices = services.filter(s => s.category === cat);
              if (catServices.length === 0) return null;
              const meta = SKILL_META[cat];
              const qualifiedStaff = staff.filter(s => s.skills.includes(cat));
              return (
                <div key={cat} className="mb-6 rounded overflow-hidden" style={{ border: `1px solid rgba(196,168,130,0.2)` }}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-4 py-2.5"
                    style={{ background: meta.bg, borderBottom: `1px solid ${meta.color}22` }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                      {meta.label} Services
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: meta.color + '22', color: meta.color }}>
                      {catServices.length} services · {qualifiedStaff.length} therapist{qualifiedStaff.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs" style={{ background: '#fff' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid rgba(196,168,130,0.15)` }}>
                          <th className="text-left px-4 py-2 font-semibold sticky left-0 bg-white" style={{ color: NAVY, minWidth: 120 }}>
                            Therapist
                          </th>
                          {catServices.map(svc => (
                            <th key={svc.id} className="px-3 py-2 font-semibold text-center" style={{ color: NAVY, minWidth: 110 }}>
                              <div>{svc.name}</div>
                              <div className="font-normal mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                                {svc.durationMin}min · {(svc.price / 100).toFixed(0)} JOD
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((s, i) => {
                          const canDo = s.skills.includes(cat);
                          return (
                            <tr key={s.id}
                              style={{
                                background: i % 2 === 0 ? '#fff' : 'rgba(247,243,238,0.5)',
                                borderBottom: `1px solid rgba(196,168,130,0.08)`,
                                opacity: canDo ? 1 : 0.45,
                              }}>
                              <td className="px-4 py-2.5 sticky left-0 font-semibold" style={{ color: NAVY, background: 'inherit' }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                    style={{ background: canDo ? `${GOLD}33` : 'rgba(0,0,0,0.06)', color: canDo ? NAVY : 'hsl(20 15% 55%)' }}>
                                    {s.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ color: canDo ? NAVY : 'hsl(20 15% 55%)' }}>{s.name}</div>
                                    {s.role && <div className="text-[10px] font-normal" style={{ color: 'hsl(20 15% 60%)' }}>{s.role}</div>}
                                  </div>
                                </div>
                              </td>
                              {catServices.map(svc => (
                                <td key={svc.id} className="px-3 py-2.5 text-center">
                                  {canDo
                                    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: meta.bg }}>
                                        <Check size={10} style={{ color: meta.color }} />
                                      </span>
                                    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: 'rgba(0,0,0,0.04)' }}>
                                        <X size={10} style={{ color: 'hsl(20 15% 70%)' }} />
                                      </span>
                                  }
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Packages per therapist ─────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: NAVY }}>
              Which therapists can redeem each package
            </h3>
            {packages.length === 0 ? (
              <p className="text-xs py-6 text-center rounded" style={{ color: 'hsl(20 15% 55%)', background: PARCH }}>
                No packages created yet. Add packages in the Packages tab.
              </p>
            ) : (
              <div className="rounded overflow-hidden" style={{ border: `1px solid rgba(196,168,130,0.2)` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ background: '#fff' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid rgba(196,168,130,0.15)`, background: PARCH }}>
                        <th className="text-left px-4 py-2.5 font-semibold sticky left-0" style={{ color: NAVY, background: PARCH, minWidth: 120 }}>
                          Therapist
                        </th>
                        {packages.map(pkg => (
                          <th key={pkg.id} className="px-3 py-2.5 font-semibold text-center" style={{ color: NAVY, minWidth: 120 }}>
                            <div>{pkg.name}</div>
                            <div className="font-normal mt-0.5" style={{ color: 'hsl(20 15% 55%)' }}>
                              {pkg.totalSessions} sessions · {pkg.priceJod} JOD
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((s, i) => (
                        <tr key={s.id}
                          style={{
                            background: i % 2 === 0 ? '#fff' : 'rgba(247,243,238,0.5)',
                            borderBottom: `1px solid rgba(196,168,130,0.08)`,
                          }}>
                          <td className="px-4 py-2.5 sticky left-0 font-semibold" style={{ color: NAVY, background: 'inherit' }}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                style={{ background: `${GOLD}33`, color: NAVY }}>
                                {s.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div>{s.name}</div>
                                {s.role && <div className="text-[10px] font-normal" style={{ color: 'hsl(20 15% 60%)' }}>{s.role}</div>}
                              </div>
                            </div>
                          </td>
                          {packages.map(pkg => {
                            // Package is linked to a service category via serviceId or category field
                            const pkgCat = pkg.category as Skill;
                            const canDo = s.skills.includes(pkgCat);
                            const meta = SKILL_META[pkgCat] ?? SKILL_META['other'];
                            return (
                              <td key={pkg.id} className="px-3 py-2.5 text-center">
                                {canDo
                                  ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: meta.bg }}>
                                      <Check size={10} style={{ color: meta.color }} />
                                    </span>
                                  : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: 'rgba(0,0,0,0.04)' }}>
                                      <X size={10} style={{ color: 'hsl(20 15% 70%)' }} />
                                    </span>
                                }
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
