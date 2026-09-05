import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { Video } from '@remotion/media';
import { VIDEO_TOP, VIDEO_W, VIDEO_H, WALL } from '../lib/theme';

const SRC = staticFile('steps_to_improve.mp4');

/**
 * Full-bleed clip pushed down, over a panel painted in the wall's own colour.
 * The video keeps its native width so nothing is scaled or blurred; only the
 * strip above it is synthetic, and it matches the wall it continues.
 */
export const Backdrop: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg, ${WALL.left} 0%, ${WALL.mid} 46%, ${WALL.right} 100%)`,
      }}
    />
    <Video
      src={SRC}
      style={{
        position: 'absolute',
        left: 0,
        top: VIDEO_TOP,
        width: VIDEO_W,
        height: VIDEO_H,
        // Only the top edge is feathered, into matching colour — it hides any
        // residual mismatch at the join without softening the frame edges.
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, #000 56px)',
        maskImage: 'linear-gradient(to bottom, transparent 0px, #000 56px)',
      }}
    />
    {/* Scrim spans the join, so both sides darken together and the seam stays
        invisible while white plates keep their contrast. */}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to bottom, rgba(8,16,31,0.46) 0%, rgba(8,16,31,0.34) 28%, rgba(8,16,31,0) 44%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(125% 62% at 50% 92%, rgba(8,16,31,0) 46%, rgba(8,16,31,0.32) 100%)',
      }}
    />
  </AbsoluteFill>
);
