import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../lib/theme';
import { mono, montserrat } from '../lib/fonts';
import { EASE, tween, springAt } from '../lib/motion-anim';

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Subtle abstract motion behind cut-scene text: drifting blobs + slow grid. */
const AbstractBg: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blobs = [
    { c: COLORS.cutGlow, x: 26, y: 30, r: 460, sx: 7, sy: 5, p: 0 },
    { c: COLORS.red, x: 76, y: 62, r: 400, sx: -6, sy: 6, p: 1.7 },
    { c: COLORS.blue, x: 44, y: 82, r: 380, sx: 5, sy: -7, p: 3.2 },
  ];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{ background: `linear-gradient(165deg, ${COLORS.cutNavy} 0%, ${COLORS.cutDeep} 68%)` }}
      />
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${b.x + Math.sin(t * 0.55 + b.p) * b.sx}%`,
            top: `${b.y + Math.cos(t * 0.42 + b.p) * b.sy}%`,
            width: b.r,
            height: b.r,
            marginLeft: -b.r / 2,
            marginTop: -b.r / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c}, transparent 68%)`,
            opacity: 0.58,
            filter: 'blur(58px)',
          }}
        />
      ))}
      {/* Slow drifting grid keeps the frame alive without pulling focus. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.075) 1px, transparent 1px)',
          backgroundSize: '108px 108px',
          transform: `translate(${(t * 9) % 108}px, ${(-t * 6) % 108}px) rotate(-4deg) scale(1.25)`,
        }}
      />
      {/* Orbiting ring — one clean geometric anchor behind the number. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 760,
          height: 760,
          marginLeft: -380,
          marginTop: -380,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.14)',
          transform: `rotate(${t * 12}deg) scale(${1 + Math.sin(t * 0.8) * 0.03})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -9,
            width: 18,
            height: 18,
            marginLeft: -9,
            borderRadius: '50%',
            background: COLORS.amber,
            boxShadow: `0 0 26px ${COLORS.amber}`,
          }}
        />
      </div>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(80% 58% at 50% 48%, rgba(0,0,0,0) 34%, rgba(4,9,18,0.7) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Full-frame beat between sections. Wipes in over the talking head, holds a
 * centered step number + label, wipes out. Keeps the pace up and gives each
 * point a hard boundary.
 */
export const CutScene: React.FC<{
  step: string;
  title: string;
  sub?: string;
  accent?: string;
  extra?: React.ReactNode;
  durationInFrames: number;
}> = ({ step, title, sub, accent = COLORS.red, extra, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const IN = 9;
  const OUT = 9;

  // Diagonal wipe in, straight wipe out.
  const inT = EASE.expo(clamp01(frame / IN));
  const outT = EASE.expo(clamp01((frame - (durationInFrames - OUT)) / OUT));
  const clip =
    outT > 0
      ? `inset(0 0 ${outT * 100}% 0)`
      : `polygon(0 0, 100% 0, 100% ${inT * 118 - 18}%, 0 ${inT * 118}%)`;

  const pop = springAt(frame - IN, fps, { stiffness: 190, damping: 17 });
  const slide = tween(frame, [IN, IN + 20], [70, 0], EASE.expo);
  const lineW = tween(frame, [IN + 4, IN + 26], [0, 300], EASE.expo);

  return (
    <AbsoluteFill style={{ clipPath: clip }}>
      <AbstractBg />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <div
          style={{
            fontFamily: mono,
            fontWeight: 800,
            fontSize: 196,
            lineHeight: 0.86,
            color: 'transparent',
            WebkitTextStroke: `5px ${accent}`,
            opacity: 0.9 * clamp01(pop),
            transform: `translateY(${-slide * 1.4}px) scale(${0.88 + 0.12 * clamp01(pop)})`,
          }}
        >
          {step}
        </div>
        <div
          style={{
            background: COLORS.white,
            color: COLORS.navy,
            fontFamily: montserrat,
            fontWeight: 900,
            fontSize: 84,
            letterSpacing: -3,
            lineHeight: 1.02,
            padding: '14px 34px',
            borderRadius: 18,
            textAlign: 'center',
            maxWidth: 820,
            opacity: clamp01(pop),
            transform: `translateY(${slide}px) scale(${0.94 + 0.06 * clamp01(pop)})`,
            boxShadow: '0 26px 70px rgba(0,0,0,0.55)',
          }}
        >
          {title}
        </div>
        <div style={{ width: lineW, height: 5, background: accent, borderRadius: 3 }} />
        {sub ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.78)',
              opacity: clamp01(springAt(frame - IN - 8, fps, { stiffness: 190, damping: 18 })),
            }}
          >
            {sub}
          </div>
        ) : null}
        {extra}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The step-05 payoff: a comment card that drops in and gets pinned. Gives the
 * longest cut scene something that keeps moving.
 */
export const PinnedComment: React.FC<{ delay?: number }> = ({ delay = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = clamp01(springAt(frame - delay, fps, { stiffness: 170, damping: 16 }));
  const pin = clamp01(springAt(frame - delay - 16, fps, { stiffness: 300, damping: 12 }));
  const bob = Math.sin((frame - delay) / 22) * 4 * drop;

  return (
    <div
      style={{
        marginTop: 30,
        width: 620,
        padding: '20px 24px',
        borderRadius: 20,
        background: COLORS.white,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        position: 'relative',
        opacity: drop,
        transform: `translateY(${(1 - drop) * -70 + bob}px) rotate(${(1 - drop) * -4}deg)`,
        boxShadow: '0 26px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ width: 66, height: 66, borderRadius: '50%', background: '#D6DEEC', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 15, width: '52%', borderRadius: 8, background: '#C9D3E4' }} />
        <div style={{ height: 15, width: '86%', borderRadius: 8, background: '#E1E7F1' }} />
        <div style={{ height: 15, width: '68%', borderRadius: 8, background: '#E1E7F1' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: -18,
          right: -12,
          background: COLORS.red,
          color: COLORS.white,
          fontFamily: mono,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: 2,
          padding: '7px 15px',
          borderRadius: 10,
          transform: `scale(${0.3 + 0.7 * pin}) rotate(${8 - pin * 8}deg)`,
          opacity: pin,
          boxShadow: '0 12px 30px rgba(226,55,68,0.5)',
        }}
      >
        PINNED
      </div>
    </div>
  );
};
