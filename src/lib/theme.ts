// Design tokens for the video
export const COLORS = {
  // Primary palette — navy text on white
  navy: '#1B2A4A',
  white: '#FFFFFF',
  offWhite: '#F0F0F0',

  // Accent colors for animations
  gold: '#FFD700',
  orange: '#FF6B35',
  blue: '#00B4D8',
  green: '#2ECC71',
  red: '#E74C3C',
  purple: '#9B59B6',

  // Backgrounds
  darkBg: '#0A0A0A',
  darkOverlay: 'rgba(0, 0, 0, 0.5)',

  // Cutscene solid backgrounds
  cutNavy: '#1B2A4A',
  cutDark: '#0F1A2E',
};

export const LAYOUT = {
  width: 1080,
  height: 1920,
  // 10% top buffer, 15% side buffer, bottom half for captions
  safeTop: 192,     // 10% of 1920
  safeSide: 162,    // 15% of 1080
  contentBottom: 860, // top half editing zone (leaving room before caption area)
  contentLeft: 162,
  contentRight: 918, // 1080 - 162
  contentWidth: 756, // 918 - 162
};

export const FONTS = {
  heading: 'Montserrat',
  body: 'Inter',
};
