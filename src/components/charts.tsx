import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../lib/theme';
import { mono, montserrat } from '../lib/fonts';
import { EASE, tween, useSpring, springAt } from '../lib/motion-anim';

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/* ------------------------------------------------------------------ gauge */

/** Semicircular score gauge. Sweeps to `value`, flips green past `threshold`. */
export const Gauge: React.FC<{
  value: number;
  threshold?: number;
  size?: number;
  delay?: number;
  duration?: number;
}> = ({ value, threshold = 80, size = 320, delay = 4, duration = 34 }) => {
  const frame = useCurrentFrame();
  const v = tween(frame, [delay, delay + duration], [0, value], EASE.out);
  const stroke = 26;
  const r = size / 2 - stroke / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const h = cy + 34; // baseline plus room for the readout under the arc
  const pt = (pct: number, rad = r) => [
    cx + rad * Math.cos(Math.PI * (1 + pct / 100)),
    cy + rad * Math.sin(Math.PI * (1 + pct / 100)),
  ];
  // A half circle never sweeps past 180deg, so large-arc is always 0.
  const arc = (to: number) => `M ${pt(0)[0]} ${pt(0)[1]} A ${r} ${r} 0 0 1 ${pt(to)[0]} ${pt(to)[1]}`;
  const passed = v >= threshold;
  const [tx0, ty0] = pt(threshold, r - stroke / 2 - 6);
  const [tx1, ty1] = pt(threshold, r + stroke / 2 + 6);

  return (
    <div style={{ position: 'relative', width: size, height: h }}>
      <svg width={size} height={h} style={{ position: 'absolute', inset: 0 }}>
        <path d={arc(100)} stroke="rgba(255,255,255,0.24)" strokeWidth={stroke} fill="none" strokeLinecap="round" />
        <path
          d={arc(Math.max(0.5, v))}
          stroke={passed ? COLORS.green : COLORS.amber}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 18px ${passed ? 'rgba(0,179,126,0.75)' : 'rgba(255,176,32,0.6)'})`,
          }}
        />
        <line x1={tx0} y1={ty0} x2={tx1} y2={ty1} stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" />
      </svg>
      {/* Readout sits inside the dial, bottom-aligned to the arc baseline. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy - 76,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: COLORS.white,
            color: passed ? COLORS.green : COLORS.navy,
            fontFamily: mono,
            fontWeight: 800,
            fontSize: 60,
            fontVariantNumeric: 'tabular-nums',
            padding: '2px 16px',
            borderRadius: 12,
            boxShadow: '0 16px 40px rgba(6,14,33,0.5)',
          }}
        >
          {Math.round(v)}%
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- line */

/**
 * Progressively drawn line + area. `points` are 0..1 in both axes; the path is
 * revealed with a dash offset so it looks hand-drawn rather than faded in.
 */
export const TrendLine: React.FC<{
  points: number[];
  w?: number;
  h?: number;
  color?: string;
  delay?: number;
  duration?: number;
  dashed?: boolean;
  showDot?: boolean;
}> = ({ points, w = 470, h = 172, color = COLORS.green, delay = 6, duration = 40, dashed, showDot = true }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - delay) / duration);
  const eased = EASE.smooth(p);
  const pad = 14;
  const xy = points.map((v, i) => [
    pad + (i / (points.length - 1)) * (w - pad * 2),
    h - pad - v * (h - pad * 2),
  ]);
  const d = xy.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const len = xy.reduce((a, c, i) => (i === 0 ? 0 : a + Math.hypot(c[0] - xy[i - 1][0], c[1] - xy[i - 1][1])), 0);
  // Position of the leading dot along the polyline.
  const target = len * eased;
  let acc = 0;
  let dot = xy[0];
  for (let i = 1; i < xy.length; i++) {
    const seg = Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
    if (acc + seg >= target) {
      const t = seg === 0 ? 0 : (target - acc) / seg;
      dot = [xy[i - 1][0] + (xy[i][0] - xy[i - 1][0]) * t, xy[i - 1][1] + (xy[i][1] - xy[i - 1][1]) * t];
      break;
    }
    acc += seg;
    dot = xy[i];
  }

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.44} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} y1={pad + g * (h - pad * 2)} x2={w - pad} y2={pad + g * (h - pad * 2)} stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />
      ))}
      <path
        d={`${d} L ${xy[xy.length - 1][0]} ${h - pad} L ${xy[0][0]} ${h - pad} Z`}
        fill={`url(#fill-${color.replace('#', '')})`}
        style={{ clipPath: `inset(0 ${(1 - eased) * 100}% 0 0)` }}
      />
      <path
        d={d}
        stroke={color}
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '16 14' : `${len} ${len}`}
        strokeDashoffset={dashed ? 0 : len * (1 - eased)}
        style={{ filter: `drop-shadow(0 0 14px ${color}88)`, opacity: dashed ? 0.55 : 1 }}
      />
      {showDot && !dashed ? (
        <circle cx={dot[0]} cy={dot[1]} r={11} fill={COLORS.white} stroke={color} strokeWidth={5} />
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------- bars */

export type Bar = { label: string; value: number; color: string; caption: string };

/** Two-or-more vertical bars that grow, each with the number counting up. */
export const Bars: React.FC<{
  bars: Bar[];
  max: number;
  h?: number;
  barW?: number;
  gap?: number;
  delay?: number;
  format?: (n: number) => string;
}> = ({ bars, max, h = 186, barW = 118, gap = 44, delay = 4, format = (n) => String(Math.round(n)) }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: h + 84 }}>
      {bars.map((b, i) => {
        const g = clamp01((frame - delay - i * 9) / 30);
        const grow = EASE.expo(g);
        const val = b.value * grow;
        return (
          <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                background: COLORS.white,
                color: COLORS.navy,
                fontFamily: mono,
                fontWeight: 800,
                fontSize: 32,
                padding: '3px 12px',
                borderRadius: 9,
                opacity: grow > 0.05 ? 1 : 0,
                transform: `translateY(${(1 - grow) * 12}px)`,
                boxShadow: '0 10px 26px rgba(6,14,33,0.45)',
              }}
            >
              {format(val)}
            </div>
            <div
              style={{
                width: barW,
                height: Math.max(6, (val / max) * h),
                background: b.color,
                borderRadius: '12px 12px 4px 4px',
                boxShadow: `0 0 30px ${b.color}66`,
              }}
            />
            <div
              style={{
                fontFamily: mono,
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: 1.6,
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
              }}
            >
              {b.caption}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ stars */

const Star: React.FC<{ fill: number; size: number }> = ({ fill, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`s${Math.round(fill * 1000)}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset={`${fill * 100}%`} stopColor={COLORS.gold} />
        <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.22)" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5 6.2 20.5l1.1-6.5-4.7-4.6 6.5-.95z"
      fill={`url(#s${Math.round(fill * 1000)})`}
      stroke="rgba(255,255,255,0.35)"
      strokeWidth={0.7}
    />
  </svg>
);

/** Five stars filling up to `rating`, each popping in on a spring. */
export const Stars: React.FC<{ rating: number; size?: number; delay?: number }> = ({
  rating,
  size = 74,
  delay = 4,
}) => {
  const frame = useCurrentFrame();
  const r = tween(frame, [delay, delay + 36], [0, rating], EASE.out);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const pop = springAt(frame - delay - i * 5, 30, { stiffness: 260, damping: 15 });
        return (
          <div key={i} style={{ transform: `scale(${0.4 + 0.6 * clamp01(pop)})`, opacity: clamp01(pop * 2) }}>
            <Star fill={clamp01(r - i)} size={size} />
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- rank list */

export type RankItem = { name: string; you?: boolean };

/**
 * Leaderboard where the highlighted row slides from `fromRank` to `toRank` and
 * the rows it passes shuffle down — the visual hook for "we climbed to top 5".
 */
export const RankList: React.FC<{
  rows: RankItem[];
  fromRank: number;
  toRank: number;
  delay?: number;
  duration?: number;
  rowH?: number;
  w?: number;
}> = ({ rows, fromRank, toRank, delay = 8, duration = 40, rowH = 58, w = 470 }) => {
  const frame = useCurrentFrame();
  const t = EASE.expo(clamp01((frame - delay) / duration));
  const cur = fromRank + (toRank - fromRank) * t;

  return (
    <div style={{ width: w, position: 'relative', height: (rows.length + 2) * rowH }}>
      {rows.map((row, i) => {
        if (row.you) return null;
        // Rows below the climbing row's live position shift down by one slot.
        const slot = i + (i >= Math.round(cur) - 1 ? 1 : 0);
        return (
          <Row key={row.name} y={slot * rowH} rank={slot + 1} name={row.name} rowH={rowH} />
        );
      })}
      <Row
        you
        y={(cur - 1) * rowH}
        rank={Math.round(cur)}
        name="YOUR RESTAURANT"
        rowH={rowH}
        scale={1 + Math.sin(clamp01((frame - delay) / duration) * Math.PI) * 0.045}
      />
    </div>
  );
};

const Row: React.FC<{
  y: number;
  rank: number;
  name: string;
  rowH: number;
  you?: boolean;
  scale?: number;
}> = ({ y, rank, name, rowH, you, scale = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: 0,
      right: 0,
      height: rowH - 8,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 16px',
      borderRadius: 12,
      background: you ? COLORS.white : 'rgba(255,255,255,0.12)',
      color: you ? COLORS.navy : 'rgba(255,255,255,0.86)',
      fontFamily: montserrat,
      fontWeight: you ? 900 : 700,
      fontSize: you ? 30 : 25,
      letterSpacing: -0.4,
      transform: `scale(${scale})`,
      boxShadow: you ? '0 16px 40px rgba(6,14,33,0.5)' : 'none',
      zIndex: you ? 2 : 1,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontWeight: 800,
        fontSize: 27,
        color: you ? COLORS.red : 'rgba(255,255,255,0.55)',
        width: 44,
      }}
    >
      #{rank}
    </span>
    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{name}</span>
  </div>
);

export { useSpring };
