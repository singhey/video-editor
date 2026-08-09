import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

/**
 * Enter (spring pop) + exit (fade/slide) driver for an overlay scene.
 * `useCurrentFrame` is local to the enclosing <Sequence>, so `frame` is 0 at the
 * scene's start. All animation is frame-driven so it renders deterministically —
 * CSS/JS runtime animations (incl. motion's time-based ones) do not.
 */
export const useEnterExit = (
  durationInFrames: number,
  opts?: { enterStiffness?: number; exitFrames?: number; enterDelay?: number },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitFrames = opts?.exitFrames ?? 10;
  const enterDelay = opts?.enterDelay ?? 0;

  const enter = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 15, stiffness: opts?.enterStiffness ?? 110, mass: 0.7 },
  });

  const exit = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) },
  );

  return {
    enter,
    exit,
    // Composite values ready to drop into a style
    opacity: Math.min(enter, exit),
    translateY: (1 - enter) * 40,
    scale: interpolate(enter, [0, 1], [0.86, 1]),
  };
};

/** Frame-driven eased number ramp, e.g. counting up to a stat. */
export const useCountUp = (
  to: number,
  { start = 6, duration = 34, from = 0 }: { start?: number; duration?: number; from?: number } = {},
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
};

/** Format a big integer with thousands separators. */
export const formatInt = (n: number) => Math.round(n).toLocaleString('en-US');

/** Compact format: 300000000 -> "300M", 220000000 -> "220M". */
export const formatCompact = (n: number, digits = 0) => {
  const v = Math.round(n);
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(digits) + 'B';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(digits) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(digits) + 'K';
  return String(v);
};

/** Subtle idle float, useful for keeping cut-scene elements alive. */
export const useFloat = (amplitude = 8, period = 90, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(((frame + phase) / period) * Math.PI * 2) * amplitude;
};
