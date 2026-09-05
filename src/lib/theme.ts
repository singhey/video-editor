// Design tokens for the video.

export const COLORS = {
  // Brand rule: navy text on a white plate that wraps only the text.
  navy: '#14264A',
  navySoft: '#2A3F6B',
  white: '#FFFFFF',
  offWhite: '#F2F5FA',

  red: '#E23744', // Zomato red
  amber: '#FFB020',
  gold: '#F5C518',
  green: '#00B37E',
  blue: '#2D7FF9',
  purple: '#8B5CF6',

  // Cut-scene backdrop
  cutDeep: '#08101F',
  cutNavy: '#122246',
  cutGlow: '#1E3A7A',
};

/**
 * 1080x1920 vertical short.
 *
 * The clip is 9:16, so it fills the frame edge to edge at full width — no
 * scaling, no blurred surround. The speaker's hairline sits at ~13% of the
 * source height, which at top:0 puts his head at y=250, inside the 20% safety
 * buffer with no room to edit. So the whole clip is pushed down by VIDEO_TOP
 * and the strip it vacates is painted with the wall's own colour, sampled from
 * the footage (#E4CBAD on the left falling to #D8B698 on the right). The wall
 * is flat and evenly lit, so the extension reads as more wall and the seam
 * disappears.
 *
 * Across the clip his hair never rises above y=749, and the chin sits at ~1599:
 * a 326px editing band
 * under the safety buffer, and the shirt below the chin free for captions.
 */
export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const FPS = 30;
export const DURATION = 2092; // 69.72s source

export const VIDEO_TOP = 485;

/** Wall colour sampled from the footage, used to extend the frame upward. */
export const WALL = {
  left: '#E4CBAD',
  mid: '#DFC3A6',
  right: '#D8B698',
};

export const LAYOUT = {
  width: VIDEO_W,
  height: VIDEO_H,
  fps: FPS,

  safeTop: 384, // 20% of 1920
  safeSide: 162, // 15% of 1080

  // Clear editing band: below the top safety buffer, above the hairline.
  bandTop: 398,
  bandBottom: 724,
  get bandHeight() {
    return this.bandBottom - this.bandTop;
  },

  contentLeft: 162,
  contentWidth: 756,
};
