import { interpolate, Easing } from "remotion";

/** Clamp-friendly fade in */
export const fadeIn = (
  frame: number,
  startFrame: number,
  durationFrames: number,
) =>
  interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

/** Clamp-friendly fade out */
export const fadeOut = (
  frame: number,
  startFrame: number,
  durationFrames: number,
) =>
  interpolate(frame, [startFrame, startFrame + durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 1),
  });

/** Slide up with opacity */
export const slideUp = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  distance = 60,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  return {
    opacity: progress,
    translateY: (1 - progress) * distance,
  };
};

/** Slide in from left */
export const slideFromLeft = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  distance = 200,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  return {
    opacity: progress,
    translateX: (1 - progress) * -distance,
  };
};

/** Scale pop-in */
export const scaleIn = (
  frame: number,
  startFrame: number,
  durationFrames: number,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    },
  );
  return {
    opacity: progress,
    scale: progress,
  };
};

/** Stagger delay helper */
export const stagger = (index: number, delayFrames: number) =>
  index * delayFrames;
