/**
 * OfferCountdown — live countdown timer for a special offer end date.
 * Shows days / hours / minutes / seconds remaining.
 */
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const OLIVE  = '#6B7260'; /* Sage Stone        */
const YELLOW = '#C4A882'; /* Warm Sand         */
const TAUPE  = '#0E2A3A'; /* Ink Navy          */

interface Props {
  /** ISO date string for when the offer expires, e.g. "2026-06-30T23:59:59" */
  endsAt: string;
  label?: string;
  /** Dark background variant — lightens text colors */
  dark?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(endsAt: string): TimeLeft {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, expired: false };
}

function Pad({ n }: { n: number }) {
  return <>{String(n).padStart(2, '0')}</>;
}

export default function OfferCountdown({ endsAt, label = 'Offer ends in', dark = false }: Props) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(endsAt));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(endsAt)), 1_000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (time.expired) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ background: dark ? 'rgba(255,255,255,0.08)' : `${TAUPE}18`, color: dark ? 'rgba(255,255,255,0.45)' : TAUPE }}
      >
        Offer ended
      </div>
    );
  }

  const units = [
    { value: time.days,    label: 'days' },
    { value: time.hours,   label: 'hrs' },
    { value: time.minutes, label: 'min' },
    { value: time.seconds, label: 'sec' },
  ];

  const labelColor  = dark ? 'rgba(180,175,83,0.85)' : OLIVE;
  const numColor    = dark ? 'rgba(249,245,240,0.92)' : TAUPE;
  const unitColor   = dark ? 'rgba(249,245,240,0.45)' : 'hsl(20 15% 55%)';
  const colonColor  = dark ? 'rgba(180,175,83,0.6)'   : YELLOW;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Clock size={12} style={{ color: labelColor }} />
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: labelColor }}>
          {label}:
        </span>
      </div>
      <div className="flex items-center gap-1">
        {units.map(({ value, label: unitLabel }, i) => (
          <span key={unitLabel} className="flex items-baseline gap-0.5">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: numColor, fontFamily: 'var(--font-heading)' }}
            >
              <Pad n={value} />
            </span>
            <span className="text-[10px]" style={{ color: unitColor }}>
              {unitLabel}
            </span>
            {i < units.length - 1 && (
              <span className="text-xs font-bold mx-0.5" style={{ color: colonColor }}>:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
