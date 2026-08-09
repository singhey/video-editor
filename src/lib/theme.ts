// Design tokens for the video
export const COLORS = {
  // Primary palette — navy text on white (per brand guidelines)
  navy: '#14264A',
  navySoft: '#28407A',
  white: '#FFFFFF',
  offWhite: '#F4F6FB',

  // Accent colors for animations / icons / highlights
  gold: '#FFC23C',
  orange: '#FF6B35',
  blue: '#2DA8E8',
  cyan: '#22D3EE',
  green: '#22C55E',
  red: '#EF4444',
  purple: '#8B5CF6',

  // Cutscene solid backgrounds
  cutNavy: '#0E1B33',
  cutDeep: '#0A1428',
  cutGlow: '#1B2E57',
};

// The video is 1080x1920 (vertical short). The person's head sits roughly from
// the vertical middle downward, so the clean editing band is ABOVE the head:
// 20% top safety buffer + 15% side safety buffer, bottom half reserved for
// user-added captions. Cut scenes are the exception — they cover full screen.
export const LAYOUT = {
  width: 1080,
  height: 1920,
  fps: 30,

  safeTopPct: 0.2, // 20% top buffer
  safeSidePct: 0.15, // 15% side buffer

  safeTop: 384, // 20% of 1920
  safeSide: 162, // 15% of 1080

  // Overlay band — the clear area above the talking head.
  bandTop: 402,
  bandBottom: 660,
  get bandHeight() {
    return this.bandBottom - this.bandTop;
  },

  contentLeft: 162,
  contentRight: 918,
  contentWidth: 756, // 918 - 162
};

export const FONTS = {
  heading: 'Montserrat',
  body: 'Inter',
};
