import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, LAYOUT } from '../lib/theme';
import { montserrat, inter } from '../lib/fonts';
import { useCountUp, formatInt } from '../lib/anim';

/**
 * Positions overlay content inside the clean band ABOVE the talking head,
 * respecting the 20% top / 15% side safety margins. Everything here lives in
 * the top area so the person (bottom half) and the caption zone stay clear.
 */
export const SafeBand: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
}> = ({ children, justify = 'center', align = 'center' }) => (
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
        alignItems: align,
        gap: 18,
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** White rounded box that wraps its content tightly, with navy text. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ children, style, accent }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      background: COLORS.white,
      color: COLORS.navy,
      borderRadius: 22,
      padding: '20px 30px',
      boxShadow: '0 18px 50px rgba(6, 14, 33, 0.35)',
      borderBottom: accent ? `6px solid ${accent}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small eyebrow / kicker chip. */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = COLORS.orange,
}) => (
  <div
    style={{
      display: 'inline-block',
      background: color,
      color: COLORS.white,
      fontFamily: montserrat,
      fontWeight: 800,
      fontSize: 30,
      letterSpacing: 2,
      textTransform: 'uppercase',
      padding: '8px 20px',
      borderRadius: 12,
      boxShadow: '0 10px 26px rgba(6,14,33,0.28)',
    }}
  >
    {children}
  </div>
);

/** Large navy heading inside a white card. */
export const Heading: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 66, style }) => (
  <div
    style={{
      fontFamily: montserrat,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.02,
      color: COLORS.navy,
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Monospace-ish code chip: white card wrapping code text with a token colored. */
export const CodeChip: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: COLORS.white,
      color: COLORS.navy,
      fontFamily: `'SF Mono', ui-monospace, Menlo, Consolas, monospace`,
      fontWeight: 700,
      fontSize: 34,
      padding: '16px 24px',
      borderRadius: 16,
      boxShadow: '0 16px 44px rgba(6,14,33,0.32)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Animated number that counts up from 0 (or `from`) to `value`. */
export const AnimatedNumber: React.FC<{
  value: number;
  start?: number;
  duration?: number;
  from?: number;
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({ value, start = 6, duration = 34, from = 0, format = formatInt, style }) => {
  const n = useCountUp(value, { start, duration, from });
  return (
    <span
      style={{
        fontFamily: montserrat,
        fontWeight: 900,
        fontVariantNumeric: 'tabular-nums',
        color: COLORS.navy,
        ...style,
      }}
    >
      {format(n)}
    </span>
  );
};

/** Colored emoji/icon disc. */
export const IconDisc: React.FC<{ children: React.ReactNode; bg?: string; size?: number }> = ({
  children,
  bg = COLORS.navy,
  size = 64,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.52,
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

export const bodyFont = inter;
export const headFont = montserrat;
