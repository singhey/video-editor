import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, LAYOUT } from '../lib/theme';
import { montserrat, mono } from '../lib/fonts';
import { useRamp } from '../lib/motion-anim';

/**
 * Positions overlay content inside the clear band above the speaker's head,
 * respecting the 20% top / 15% side safety margins. Everything an overlay draws
 * lives here so the face and the (later-added) caption zone stay untouched.
 */
export const Band: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, justify = 'center', gap = 16, style }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.contentLeft,
        width: LAYOUT.contentWidth,
        top: LAYOUT.bandTop,
        height: LAYOUT.bandHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
        alignItems: 'center',
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** White plate that wraps only its text, navy ink. The house style. */
export const Plate: React.FC<{
  children: React.ReactNode;
  size?: number;
  pad?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 56, pad = '10px 24px', accent, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: COLORS.white,
      color: COLORS.navy,
      fontFamily: montserrat,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.06,
      letterSpacing: -1.6,
      padding: pad,
      borderRadius: 14,
      whiteSpace: 'nowrap',
      boxShadow: '0 18px 46px rgba(6,14,33,0.46)',
      borderBottom: accent ? `7px solid ${accent}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small uppercase kicker — navy on white, accent kept as a dot + underline. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = COLORS.red, size = 25, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: COLORS.white,
      color: COLORS.navy,
      fontFamily: mono,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 3,
      textTransform: 'uppercase',
      padding: '7px 16px',
      borderRadius: 8,
      borderBottom: `5px solid ${color}`,
      whiteSpace: 'nowrap',
      boxShadow: '0 10px 28px rgba(6,14,33,0.34)',
      ...style,
    }}
  >
    <span style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
    {children}
  </div>
);

/** Monospace number on a white plate. */
export const NumPlate: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 90, color = COLORS.navy, style }) => (
  <div
    style={{
      background: COLORS.white,
      color,
      fontFamily: mono,
      fontWeight: 800,
      fontSize: size,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: -2,
      padding: '6px 20px',
      borderRadius: 12,
      boxShadow: '0 18px 46px rgba(6,14,33,0.46)',
      whiteSpace: 'nowrap',
      lineHeight: 1.1,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Number that ramps from `from` to `to` on a motion easing curve. */
export const Counter: React.FC<{
  to: number;
  from?: number;
  start?: number;
  duration?: number;
  format?: (n: number) => string;
}> = ({ to, from = 0, start = 4, duration = 32, format = (n) => String(Math.round(n)) }) => (
  <>{format(useRamp(to, { start, duration, from }))}</>
);

/** Translucent navy card — used to group a graphic under a headline. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: 'rgba(10,20,40,0.52)',
      border: '1px solid rgba(255,255,255,0.16)',
      backdropFilter: 'blur(14px)',
      borderRadius: 20,
      padding: 18,
      boxShadow: '0 22px 54px rgba(6,14,33,0.4)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 22, color = 'rgba(255,255,255,0.82)', style }) => (
  <div
    style={{
      fontFamily: mono,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 2.4,
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
