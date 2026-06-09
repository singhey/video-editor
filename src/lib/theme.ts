// Design tokens for the video
export const COLORS = {
  // Primary palette
  gold: '#FFD700',
  navy: '#1B2A4A',
  orange: '#FF6B35',
  blue: '#00B4D8',
  green: '#2ECC71',
  red: '#E74C3C',
  dangerRed: '#FF0000',
  purple: '#9B59B6',
  white: '#FFFFFF',
  offWhite: '#F8F8F8',
  
  // Backgrounds
  darkBg: '#0A0A0A',
  darkOverlay: 'rgba(0, 0, 0, 0.6)',
  darkOverlayHeavy: 'rgba(0, 0, 0, 0.85)',
  
  // Cutscene backgrounds
  cutOrange: '#1A0F00',
  cutBlue: '#001520',
  cutRed: '#1A0000',
  cutPurple: '#0D001A',
  cutGold: '#1A1500',
};

export const LAYOUT = {
  width: 1080,
  height: 1920,
  // Safe area (10% buffer)
  safeTop: 108,     // 10% of height
  safeSide: 108,    // 10% of width
  safeBottom: 1920 / 2, // Bottom half reserved for captions
  // Content area (top half with safe margins)
  contentTop: 160,  // safeTop + some padding
  contentBottom: 860, // Halfway minus caption buffer
  contentLeft: 108,
  contentRight: 972, // 1080 - 108
  contentWidth: 864, // 972 - 108
};

export const FONTS = {
  heading: 'Montserrat',
  body: 'Inter',
};
