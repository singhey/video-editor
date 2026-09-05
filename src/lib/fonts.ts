import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// Loaded once, reused everywhere. @remotion/google-fonts blocks the frame until
// the font is ready, so text metrics are stable in the render.
export const montserrat = loadMontserrat('normal', { weights: ['700', '800', '900'] }).fontFamily;
export const inter = loadInter('normal', { weights: ['400', '600', '700'] }).fontFamily;
// The calculator UI is monospace/brutalist — numbers match it.
export const mono = loadMono('normal', { weights: ['700', '800'] }).fontFamily;
