import {
  spring as motionSpring,
  cubicBezier,
  easeOut,
  easeInOut,
  backOut,
  anticipate,
  mix,
} from 'motion';
import { useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Frame-driven wrappers around the `motion` library.
 *
 * Motion's runtime animations are wall-clock driven and would not render
 * deterministically, so instead we sample motion's *pure* easing curves and its
 * spring generator at the current frame. Same curves, deterministic output.
 */

export const EASE = {
  out: easeOut,
  inOut: easeInOut,
  back: backOut,
  anticipate,
  // Signature "expo out" — the snappy short-form feel.
  expo: cubicBezier(0.16, 1, 0.3, 1),
  smooth: cubicBezier(0.4, 0, 0.2, 1),
} as const;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Interpolate between two numbers over a frame range using a motion easing. */
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease: (t: number) => number = EASE.expo,
) => mix(v0, v1)(ease(clamp01(f1 === f0 ? 1 : (frame - f0) / (f1 - f0))));

/** Motion's spring, sampled at `frame`. Returns 0 -> 1 (overshooting past 1). */
export const springAt = (
  frame: number,
  fps: number,
  opts: { stiffness?: number; damping?: number; mass?: number } = {},
) => {
  const gen = motionSpring({
    keyframes: [0, 1],
    stiffness: opts.stiffness ?? 170,
    damping: opts.damping ?? 20,
    mass: opts.mass ?? 1,
    velocity: 0,
  });
  return gen.next(Math.max(0, frame / fps) * 1000).value as number;
};

export const useSpring = (
  delay = 0,
  opts?: { stiffness?: number; damping?: number; mass?: number },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return springAt(frame - delay, fps, opts);
};

/**
 * Standard overlay life-cycle: springs in, holds, eases out before the scene
 * ends. `delay` staggers elements within a scene.
 */
export const useBeat = (
  durationInFrames: number,
  delay = 0,
  opts?: { stiffness?: number; damping?: number; exit?: number },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitFrames = opts?.exit ?? 12;
  const enter = springAt(frame - delay, fps, {
    stiffness: opts?.stiffness ?? 150,
    damping: opts?.damping ?? 18,
  });
  const exit = tween(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 0],
    EASE.smooth,
  );
  return {
    enter,
    exit,
    opacity: Math.min(clamp01(enter), exit),
    y: (1 - enter) * 34,
    scale: mix(0.9, 1)(clamp01(enter)),
  };
};

/** Eased number ramp — used for counters. */
export const useRamp = (to: number, { start = 4, duration = 40, from = 0 } = {}) => {
  const frame = useCurrentFrame();
  return tween(frame, [start, start + duration], [from, to], EASE.out);
};

export const formatInt = (n: number) => Math.round(n).toLocaleString('en-IN');

/** Gentle idle drift so held elements never look frozen. */
export const useFloat = (amplitude = 6, period = 90, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(((frame + phase) / period) * Math.PI * 2) * amplitude;
};

export { mix };
