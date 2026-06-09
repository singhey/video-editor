---
name: miniclip-transition
description: 'Reusable Remotion pattern for transitioning a full-screen background video into a miniplayer with red border, while swapping in a new background video. Animates the video shrinking into a corner clip with smooth easing.'
---

# Miniplayer Transition Skill

## What This Does

At a configurable swap point (e.g., second 63), the main background video:
1. **Fades out** (1s crossfade)
2. **Shrinks** from full-screen into a small miniplayer (1s animation)
3. **Continues playing** from the exact same frame via `trimBefore`

Meanwhile, a **new background video** fades in and takes over as the main background.

## Architecture

```
┌─────────────────────────────────────┐
│  BackgroundVideo (new)              │  ← end_scene.mp4, full opacity
│  ┌───────────┐                      │
│  │ Miniplayer │ ← video_31.mp4     │  ← continues from swap frame
│  │ (red border)│   trimBefore=swap  │
│  └───────────┘                      │
└─────────────────────────────────────┘
```

## Key Components

### 1. `BackgroundVideo` — Fading Out Original Video

```tsx
const SWAP_FRAME = Math.round(63 * 30); // frame 1890 at 30fps

const BackgroundVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [SWAP_FRAME - 15, SWAP_FRAME + 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity: Math.max(0, fadeOut) }}>
      <Video
        src={staticFile('video_31.mp4')}
        objectFit="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
};
```

**Key behavior**: Starts at full opacity, fades to 0 starting 0.5s before the swap and completing 1s after.

### 2. `MiniplayerVideo` — Shrinking into Corner Clip

```tsx
const MiniplayerVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const shrinkProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.exp),
  });
  const width = interpolate(shrinkProgress, [0, 1], [1080, 280]);
  const height = interpolate(shrinkProgress, [0, 1], [1920, 500]);
  const left = interpolate(shrinkProgress, [0, 1], [0, 80]);
  const bottom = interpolate(shrinkProgress, [0, 1], [0, 272]);
  const radius = interpolate(shrinkProgress, [0, 1], [0, 16]);
  const borderWidth = interpolate(shrinkProgress, [0, 1], [0, 4]);

  return (
    <div
      style={{
        position: 'absolute', bottom, left, width, height,
        borderRadius: radius, overflow: 'hidden',
        border: `${borderWidth}px solid #FF0000`,
        boxShadow: `0 ${2 + shrinkProgress * 2}px ${10 + shrinkProgress * 20}px rgba(255, 0, 0, ${shrinkProgress * 0.4})`,
        zIndex: 50,
      }}
    >
      <Video
        src={staticFile('video_31.mp4')}
        trimBefore={SWAP_FRAME}
        objectFit="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
```

**Key behavior**: `trimBefore={SWAP_FRAME}` makes the video continue from the swap point — no restart.

### 3. Sequences in Composition

```tsx
{/* Original video — fades out at swap */}
<Sequence from={0} durationInFrames={SWAP_FRAME + 30} layout="none">
  <BackgroundVideo />
</Sequence>

{/* New background — starts at swap */}
<Sequence from={SWAP_FRAME} durationInFrames={Math.round(16 * fps)} layout="none">
  <AbsoluteFill style={{ opacity: 1 }}>
    <Video src={staticFile('end_scene.mp4')} objectFit="cover" style={{ width: '100%', height: '100%' }} />
  </AbsoluteFill>
</Sequence>

{/* Miniplayer — continues original video */}
<Sequence from={SWAP_FRAME} durationInFrames={Math.round(16 * fps)} layout="none">
  <MiniplayerVideo />
</Sequence>
```

## Configurable Values

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SWAP_FRAME` | `Math.round(63 * 30)` = frame 1890 | When the transition starts (seconds × fps) |
| Miniplayer width | 280px | Final miniplayer width |
| Miniplayer height | 500px | Final miniplayer height |
| Miniplayer left | 80px | Distance from left edge |
| Miniplayer bottom | 272px | Distance from bottom edge |
| Border color | `#FF0000` (red) | Miniplayer border |
| Border width | 4px | Miniplayer border thickness |
| Shrink duration | 30 frames (1s) | Animation duration |
| Easing | `Easing.out(Easing.exp)` | Fast start, smooth settle |

## Usage

1. Place this pattern in your Remotion `Composition.tsx`
2. Set `SWAP_FRAME` to your desired swap point (seconds × fps)
3. Replace video file names with your assets
4. Adjust miniplayer size/position as needed
5. The original video must be long enough to cover both the main portion AND the miniplayer portion after the swap

## Dependencies

- `remotion` (AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing, staticFile)
- `@remotion/media` (Video component)
