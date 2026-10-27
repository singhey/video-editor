import React from 'react';
import { AbsoluteFill, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { Audio, Video } from '@remotion/media';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { mono } from '../lib/fonts';

/**
 * "me going to zomato after opening my weekly payout": Batman-trend reel.
 *
 * Same layout and timing as the reference: a 16:9 picture letterboxed in a
 * 9:16 frame with the meme caption above it, and the song's drop at 14.2s.
 * The AI clips are shot under a steady red light; the flicker, blackout, drop
 * flash, tags and grain all happen here, so the generations stay simple.
 */

const inter = loadInter('normal', { weights: ['500'], subsets: ['latin'] }).fontFamily;

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
export const DURATION = s(20.7);

const W = 1080;
const PICTURE_H = 608; // 16:9 at full width
const PICTURE_TOP = 600;

const CAPTION = 'me going to zomato after opening my weekly payout';

// Dishrupt receipt tokens: paper tags, red only because these are money taken.
const PAPER = '#F4F1EA';
const STAMP_RED = '#C62019';

const DIR = 'payout-batman';

type Light = 'phone' | 'red' | 'redFast' | 'strobe' | 'normal' | 'none';

type Shot = {
  id: string;
  label: string;
  from: number;
  to: number;
  file: string;
  light: Light;
  /** Flip to true once the clip is in public/payout-batman/generated. */
  ready: boolean;
  /** Seconds to skip at the head of the clip, to pick its best part. */
  skip?: number;
};

const SHOTS: Shot[] = [
  { id: 'S1', label: 'phone glow', from: 0, to: 1.5, file: 's1_phone.mp4', light: 'phone', ready: true, skip: 3 },
  { id: 'S2', label: 'apron tie', from: 1.5, to: 4.5, file: 's2_apron.mp4', light: 'red', ready: true, skip: 1 },
  { id: 'S3', label: 'sleeves + karchi', from: 4.5, to: 7.5, file: 's3_karchi.mp4', light: 'redFast', ready: true, skip: 2 },
  { id: 'S4', label: 'cape silhouette', from: 7.5, to: 10, file: 's4_cape.mp4', light: 'redFast', ready: true, skip: 2.5 },
  { id: 'S5', label: 'walk through smoke', from: 11.5, to: 14.2, file: 's5_walk.mp4', light: 'strobe', ready: true, skip: 1.5 },
  { id: 'S6', label: 'loop: back at counter', from: 19.5, to: 20.7, file: 's6_loop.mp4', light: 'normal', ready: true, skip: 0.5 },
];

const FIGHT = { from: 14.2, to: 19.5, src: `${DIR}/reference/fight_14.2-20.7.mp4` };

/**
 * Beats of the reference track (161.5 BPM), detected with librosa onset
 * tracking. Re-run the analysis on the Instagram song if it changes.
 */
const BEATS = [
  0.6, 0.98, 1.35, 1.72, 2.07, 2.44, 2.81, 3.18, 3.55, 3.92, 4.27, 4.64, 4.99, 5.36, 5.74, 6.11,
  6.48, 6.85, 7.2, 7.57, 7.94, 8.31, 8.66, 9.03, 9.43, 9.8, 10.17, 10.52, 10.87, 11.24, 11.59,
  11.96, 12.33, 12.7, 13.05, 13.42, 13.79, 14.16, 14.51, 14.88, 15.26, 15.63, 16.0, 16.37, 16.72,
  17.09, 17.44, 17.81, 18.18, 18.55, 18.92, 19.3, 19.64, 20.02, 20.39,
];
const BEAT = 60 / 161.5;

type Pulse = {
  from: number;
  to: number;
  /** 2 = every other beat, 1 = every beat, 0.5 = beats and half-beats. */
  every: 2 | 1 | 0.5;
  /** How long the light stays on after each hit, as a fraction of a beat. */
  hold: number;
  floor: number;
};

// The light hits on the beat and gets faster as he arms himself.
const RED: Pulse = { from: 1.5, to: 4.5, every: 2, hold: 1, floor: 0.07 };
const RED_FAST: Pulse = { from: 4.5, to: 10, every: 1, hold: 0.5, floor: 0.07 };
const STROBE: Pulse = { from: 11.5, to: 14.2, every: 0.5, hold: 0.25, floor: 0.05 };
const RELEASE_FRAMES = 3; // a bulb doesn't snap off, it decays

const triggers = (p: Pulse) => {
  const inWindow = BEATS.filter((b) => b >= p.from && b < p.to);
  if (p.every === 2) return inWindow.filter((_, i) => i % 2 === 0);
  if (p.every === 1) return inWindow;
  return inWindow.flatMap((b) => [b, b + BEAT / 2]).filter((b) => b < p.to);
};

// Deduction tags pinned to the goons in the fight clip (seconds are global,
// x/y are fractions of the picture). Names must match the real payout.
const TAGS = [
  { label: 'PLATFORM FEE', at: 15.7, until: 16.5, x: 0.27, y: 0.5, rot: -9 },
  { label: 'ADS', at: 16.7, until: 17.4, x: 0.46, y: 0.58, rot: 8 },
  { label: 'COMMISSION', at: 18.8, until: 19.5, x: 0.7, y: 0.5, rot: -12 },
];

/** Brightness of a light that hits on each trigger, holds, then decays. */
const flicker = (frame: number, pulse: Pulse) => {
  const t = frame / FPS;
  const hits = triggers(pulse);
  const last = hits.filter((h) => h <= t).pop();
  if (last === undefined) return pulse.floor;
  // Each hit lands at a slightly different strength, like a real bulb.
  const peak = 0.85 + 0.15 * random(`hit-${last}`);
  const sinceOff = Math.round((t - last - pulse.hold * BEAT) * FPS);
  if (sinceOff < 0) return peak;
  return interpolate(sinceOff, [0, RELEASE_FRAMES], [peak, pulse.floor], {
    extrapolateRight: 'clamp',
  });
};

const lightLevel = (light: Light, frame: number) => {
  if (light === 'red') return flicker(frame, RED);
  if (light === 'redFast') return flicker(frame, RED_FAST);
  if (light === 'strobe') return flicker(frame, STROBE);
  return 1;
};

/** Stand-in until the AI clip arrives, lit the way the real shot will be. */
const Placeholder: React.FC<{ shot: Shot }> = ({ shot }) => {
  const backgrounds: Record<Light, string> = {
    phone: 'radial-gradient(circle at 50% 55%, #3a4a66 0%, #0b0d12 45%, #000 70%)',
    red: 'radial-gradient(circle at 30% 50%, #a3150f 0%, #3d0705 45%, #050101 80%)',
    redFast: 'radial-gradient(circle at 30% 50%, #a3150f 0%, #3d0705 45%, #050101 80%)',
    strobe: 'radial-gradient(circle at 50% 60%, #8f120d 0%, #2b0503 50%, #030101 85%)',
    normal: 'radial-gradient(circle at 50% 50%, #8a6a45 0%, #3a2a1a 60%, #120c07 100%)',
    none: '#000',
  };
  return (
    <AbsoluteFill style={{ background: backgrounds[shot.light], justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontFamily: mono, fontSize: 30, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
        {shot.id} · {shot.label}
        <br />
        <span style={{ fontSize: 22 }}>generated/{shot.file}</span>
      </div>
    </AbsoluteFill>
  );
};

const ShotLayer: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const level = lightLevel(shot.light, frame + s(shot.from));
  return (
    <AbsoluteFill style={{ filter: `brightness(${level}) contrast(1.08) saturate(0.85)` }}>
      {shot.ready ? (
        <Video
          src={staticFile(`${DIR}/generated/${shot.file}`)}
          trimBefore={s(shot.skip ?? 0)}
          muted
          objectFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <Placeholder shot={shot} />
      )}
    </AbsoluteFill>
  );
};

/** Paper deduction tag that lands like a stamp: 130% → 100% in 4 frames + micro shake. */
const Tag: React.FC<{ label: string; x: number; y: number; rot: number }> = ({ label, x, y, rot }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 4], [1.3, 1], { extrapolateRight: 'clamp' });
  const shake = frame >= 4 && frame < 6 ? (frame === 4 ? 4 : -4) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * W,
        top: y * PICTURE_H,
        transform: `translate(-50%, -50%) translateX(${shake}px) rotate(${rot}deg) scale(${scale})`,
        background: PAPER,
        color: STAMP_RED,
        fontFamily: mono,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 1,
        padding: '8px 16px',
        border: `4px solid ${STAMP_RED}`,
        boxShadow: '0 6px 14px rgba(0,0,0,0.55)',
        whiteSpace: 'nowrap',
      }}
    >
      −{label}
    </div>
  );
};

/** Animated film grain so AI clips and film footage read as one piece. */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 24} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

const DropFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6], [0.85, 0], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#fff', opacity }} />;
};

export const PayoutBatman: React.FC<{ beatGuide: boolean }> = ({ beatGuide }) => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 1920 - PICTURE_TOP + 28,
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.3,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {CAPTION}
      </div>

      <div style={{ position: 'absolute', top: PICTURE_TOP, left: 0, width: W, height: PICTURE_H, overflow: 'hidden' }}>
        {SHOTS.map((shot) => (
          <Sequence key={shot.id} from={s(shot.from)} durationInFrames={s(shot.to) - s(shot.from)}>
            <ShotLayer shot={shot} />
          </Sequence>
        ))}

        <Sequence from={s(FIGHT.from)} durationInFrames={s(FIGHT.to) - s(FIGHT.from)}>
          <Video src={staticFile(FIGHT.src)} muted objectFit="cover" style={{ width: '100%', height: '100%' }} />
        </Sequence>

        {TAGS.map((tag) => (
          <Sequence key={tag.label} from={s(tag.at)} durationInFrames={s(tag.until) - s(tag.at)}>
            <Tag label={tag.label} x={tag.x} y={tag.y} rot={tag.rot} />
          </Sequence>
        ))}

        <Sequence from={s(FIGHT.from)} durationInFrames={6}>
          <DropFlash />
        </Sequence>

        <Grain />
      </div>

      {/* Reference track for timing only; render with beatGuide=false and add the song in Instagram. */}
      {beatGuide ? <Audio src={staticFile(`${DIR}/reference/beat_guide_audio.m4a`)} /> : null}
    </AbsoluteFill>
  );
};
