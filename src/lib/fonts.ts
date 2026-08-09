import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

// Loaded once, reused everywhere. @remotion/google-fonts waits for the font
// before rendering a frame, so text metrics are stable in the render.
export const montserrat = loadMontserrat('normal', {
  weights: ['700', '800', '900'],
}).fontFamily;

export const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700'],
}).fontFamily;
