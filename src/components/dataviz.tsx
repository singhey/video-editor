import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { COLORS } from '../lib/theme';
import { montserrat } from '../lib/fonts';

/**
 * Before/After horizontal bar comparison — the "value changed" graph.
 * Used for the finale: 15s response time -> 200ms. Bars grow left-to-right and
 * their value labels count toward the target.
 */
export const BarCompare: React.FC<{
  before: { label: string; value: number; display: string; color?: string };
  after: { label: string; value: number; display: string; color?: string };
  maxWidth?: number;
  delay?: number;
  barHeight?: number;
}> = ({ before, after, maxWidth = 620, delay = 4, barHeight = 54 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grow = (i: number) =>
    spring({ frame: frame - delay - i * 10, fps, config: { damping: 18, stiffness: 90 } });

  const max = Math.max(before.value, after.value);
  const rows = [before, after];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: maxWidth }}>
      {rows.map((r, i) => {
        const p = grow(i);
        const w = (r.value / max) * maxWidth * p;
        return (
          <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <div
              style={{
                fontFamily: montserrat,
                fontWeight: 800,
                fontSize: 26,
                color: COLORS.white,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                letterSpacing: 1,
              }}
            >
              {r.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
              <div
                style={{
                  height: barHeight,
                  width: Math.max(w, 6),
                  background: r.color ?? COLORS.blue,
                  borderRadius: 12,
                  boxShadow: `0 8px 24px ${r.color ?? COLORS.blue}66`,
                }}
              />
              <div
                style={{
                  fontFamily: montserrat,
                  fontWeight: 900,
                  fontSize: 40,
                  color: COLORS.white,
                  opacity: p,
                  whiteSpace: 'nowrap',
                }}
              >
                {r.display}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Vertical rising bar — dramatizes an increasing quantity (WAL buildup).
 * The bar climbs and a warning glow intensifies as it fills.
 */
export const RisingBar: React.FC<{ height?: number; delay?: number }> = ({
  height = 200,
  delay = 4,
}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [delay, delay + 45], [0.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        width: 120,
        height,
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.25)',
      }}
    >
      <div
        style={{
          height: `${fill * 100}%`,
          background: `linear-gradient(180deg, ${COLORS.red}, ${COLORS.orange})`,
          boxShadow: `0 0 ${20 + fill * 40}px ${COLORS.red}`,
        }}
      />
    </div>
  );
};

/** Circular progress ring, e.g. "95% done". */
export const ProgressRing: React.FC<{
  percent: number;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ percent, size = 210, delay = 4, color = COLORS.green }) => {
  const frame = useCurrentFrame();
  const stroke = 20;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = interpolate(frame, [delay, delay + 40], [0, percent / 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const shown = Math.round(p * 100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize: 62,
          color: COLORS.white,
        }}
      >
        {shown}%
      </div>
    </div>
  );
};

/**
 * Batch-processing visual: a grid of chunks fills in sequentially, evoking the
 * "fetch 20,000 records at a time" loop.
 */
export const BatchFill: React.FC<{ cols?: number; rows?: number; delay?: number }> = ({
  cols = 6,
  rows = 4,
  delay = 2,
}) => {
  const frame = useCurrentFrame();
  const total = cols * rows;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10,
        width: 460,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = interpolate(frame, [delay + i * 2.2, delay + i * 2.2 + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              height: 46,
              borderRadius: 8,
              background: `rgba(255,255,255,${0.1 + on * 0.0})`,
              border: '1.5px solid rgba(255,255,255,0.22)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.blue})`,
                opacity: on,
                transform: `scale(${0.6 + on * 0.4})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
