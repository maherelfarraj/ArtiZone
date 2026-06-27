import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { TrendingUp, TrendingDown, Minus, RefreshCw, ExternalLink } from 'lucide-react';

const G     = '#C4A882';
const BLACK = '#0E2A3A';
const S1    = '#3A2214';
const S2    = '#1A0E06';
const FG    = 'rgba(253,250,246,0.88)';
const FGDIM = 'rgba(253,250,246,0.48)';

interface VariantStats {
  impressions: number;
  click_cta: number;
  whatsapp: number;
  booking: number;
  ctr: string;
  conversionRate: string;
}

interface TestResult {
  testKey: string;
  a: VariantStats;
  b: VariantStats;
  winner: 'a' | 'b' | 'tie' | 'insufficient data';
  totalEvents: number;
}

interface ApiResponse {
  results: TestResult[];
  totalEvents: number;
}

const TEST_META: Record<string, { name: string; urlA: string; urlB: string; angleA: string; angleB: string }> = {
  'laser-lp': {
    name: 'Laser Hair Removal',
    urlA: '/laser-hair-removal-amman',
    urlB: '/laser-hair-removal-amman-b',
    angleA: 'Control — Professional laser positioning',
    angleB: 'Challenger — "Stop Wasting Money on Waxing" + price transparency',
  },
  'facial-lp': {
    name: 'Best Facial Amman',
    urlA: '/best-facial-amman',
    urlB: '/best-facial-amman-b',
    angleA: 'Control — Professional facial positioning',
    angleB: 'Challenger — "See the Difference After One Session" + results timeline',
  },
  'slimming-lp': {
    name: 'Body Slimming',
    urlA: '/body-slimming-amman',
    urlB: '/body-slimming-amman-b',
    angleA: 'Control — Non-surgical body slimming',
    angleB: 'Challenger — "Lose 2–5 cm Per Area" + measurable results',
  },
};

function StatCell({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div style={{ fontFamily: 'var(--font-heading)', color: highlight ? G : FG, fontSize: '1.4rem', fontWeight: 500, lineHeight: 1 }}>{value}</div>
      <div className="text-[10px] mt-1 uppercase tracking-[0.14em]" style={{ color: FGDIM, fontFamily: 'var(--font-sans)' }}>{label}</div>
    </div>
  );
}

function WinnerBadge({ winner }: { winner: TestResult['winner'] }) {
  if (winner === 'insufficient data') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ background: 'rgba(196,168,130,0.10)', color: FGDIM, fontFamily: 'var(--font-sans)' }}>
        <Minus size={10} /> Collecting data
      </span>
    );
  }
  if (winner === 'tie') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ background: 'rgba(196,168,130,0.15)', color: G, fontFamily: 'var(--font-sans)' }}>
        <Minus size={10} /> Statistical tie
      </span>
    );
  }
  const isB = winner === 'b';
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
      style={{ background: isB ? 'rgba(40,180,100,0.15)' : 'rgba(196,168,130,0.15)', color: isB ? '#4ade80' : G, fontFamily: 'var(--font-sans)' }}>
      {isB ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      Variant {winner.toUpperCase()} winning
    </span>
  );
}

export default function AbResultsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ab-events');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as ApiResponse;
      setData(json);
      setLastRefresh(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Show all known tests even if no data yet
  const allTestKeys = Object.keys(TEST_META);
  const resultsByKey: Record<string, TestResult | null> = {};
  allTestKeys.forEach(key => {
    resultsByKey[key] = data?.results.find(r => r.testKey === key) ?? null;
  });

  return (
    <>
      <Helmet>
        <title>A/B Test Results — ArtiZone Admin</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artizonespa.com/admin/ab-results" />
      </Helmet>

      <div style={{ background: BLACK, minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <Link to="/admin" className="text-[10px] uppercase tracking-[0.18em] hover:opacity-70 transition-opacity" style={{ color: FGDIM }}>
                ← Admin
              </Link>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, marginTop: '0.5rem' }}>
                A/B Test Results
              </h1>
              <p className="text-xs mt-1" style={{ color: FGDIM }}>
                Last refreshed: {lastRefresh.toLocaleTimeString()} · Total events: {data?.totalEvents ?? '—'}
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: `${G}22`, color: G, border: `1px solid ${G}44` }}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 text-sm" style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: '#f87171' }}>
              Error loading data: {error}
            </div>
          )}

          {/* Test cards */}
          <div className="space-y-8">
            {allTestKeys.map(testKey => {
              const meta = TEST_META[testKey];
              const result = resultsByKey[testKey];
              const a = result?.a;
              const b = result?.b;

              return (
                <div key={testKey} style={{ background: S1, border: '1px solid rgba(196,168,130,0.12)' }}>
                  {/* Card header */}
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ borderBottom: '1px solid rgba(196,168,130,0.10)' }}>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: G }}>{testKey}</p>
                      <h2 style={{ fontFamily: 'var(--font-heading)', color: FG, fontSize: '1.2rem', fontWeight: 400 }}>{meta.name}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {result && <WinnerBadge winner={result.winner} />}
                      <span className="text-[10px]" style={{ color: FGDIM }}>
                        {result?.totalEvents ?? 0} events
                      </span>
                    </div>
                  </div>

                  {/* Variant comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'rgba(196,168,130,0.10)' }}>
                    {/* Variant A */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 mr-2"
                            style={{ background: 'rgba(196,168,130,0.15)', color: G }}>A</span>
                          <span className="text-xs" style={{ color: FGDIM }}>{meta.angleA}</span>
                        </div>
                        <a href={meta.urlA} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: FGDIM }}>
                          View <ExternalLink size={9} />
                        </a>
                      </div>
                      {a ? (
                        <div className="grid grid-cols-3 gap-4">
                          <StatCell label="Impressions" value={a.impressions} />
                          <StatCell label="CTR" value={a.ctr} highlight />
                          <StatCell label="Bookings" value={a.booking} />
                          <StatCell label="CTA Clicks" value={a.click_cta} />
                          <StatCell label="WhatsApp" value={a.whatsapp} />
                          <StatCell label="Conv. Rate" value={a.conversionRate} highlight />
                        </div>
                      ) : (
                        <p className="text-xs" style={{ color: FGDIM }}>No data yet — send traffic to <code style={{ color: G }}>{meta.urlA}</code></p>
                      )}
                    </div>

                    {/* Variant B */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 mr-2"
                            style={{ background: 'rgba(40,180,100,0.12)', color: '#4ade80' }}>B</span>
                          <span className="text-xs" style={{ color: FGDIM }}>{meta.angleB}</span>
                        </div>
                        <a href={meta.urlB} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: FGDIM }}>
                          View <ExternalLink size={9} />
                        </a>
                      </div>
                      {b ? (
                        <div className="grid grid-cols-3 gap-4">
                          <StatCell label="Impressions" value={b.impressions} />
                          <StatCell label="CTR" value={b.ctr} highlight />
                          <StatCell label="Bookings" value={b.booking} />
                          <StatCell label="CTA Clicks" value={b.click_cta} />
                          <StatCell label="WhatsApp" value={b.whatsapp} />
                          <StatCell label="Conv. Rate" value={b.conversionRate} highlight />
                        </div>
                      ) : (
                        <p className="text-xs" style={{ color: FGDIM }}>No data yet — send traffic to <code style={{ color: '#4ade80' }}>{meta.urlB}</code></p>
                      )}
                    </div>
                  </div>

                  {/* How to run this test */}
                  <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(196,168,130,0.08)', background: 'rgba(0,0,0,0.15)' }}>
                    <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: FGDIM }}>How to run this test</p>
                    <p className="text-xs leading-relaxed" style={{ color: FGDIM }}>
                      Point your paid ads to both URLs and split traffic 50/50 in your ad platform (Google Ads, Meta Ads).
                      Use UTM parameters: <code style={{ color: G }}>?utm_content=variant-a</code> and <code style={{ color: G }}>?utm_content=variant-b</code>.
                      A winner is declared when each variant has ≥30 impressions and one variant's CTR is &gt;0.5% higher.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-10 p-5" style={{ background: S2, border: '1px solid rgba(196,168,130,0.08)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: G }}>Metrics Guide</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs" style={{ color: FGDIM }}>
              <div><span style={{ color: FG }}>Impressions</span> — Page views tracked on load</div>
              <div><span style={{ color: FG }}>CTR</span> — (CTA clicks + WhatsApp + Bookings) / Impressions</div>
              <div><span style={{ color: FG }}>Conv. Rate</span> — Booking clicks / Impressions</div>
              <div><span style={{ color: FG }}>CTA Clicks</span> — "Book" button clicks</div>
              <div><span style={{ color: FG }}>WhatsApp</span> — WhatsApp button clicks</div>
              <div><span style={{ color: FG }}>Bookings</span> — Booking page CTA clicks</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
