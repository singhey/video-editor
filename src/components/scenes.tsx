import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, LAYOUT } from '../lib/theme';
import { mono, montserrat } from '../lib/fonts';
import { EASE, tween, springAt, useBeat, useFloat } from '../lib/motion-anim';
import { Band, Card, Kicker, Label, NumPlate, Plate } from './ui';
import { Bars, Gauge, RankList, Stars, TrendLine } from './charts';

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

type SceneProps = { durationInFrames: number };

/* ------------------------------------------------------- shared behaviours */

/** Standard overlay life-cycle wrapper: springs up in, slides out on exit. */
const Enter: React.FC<{
  d: number;
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ d, delay = 0, children, style }) => {
  const b = useBeat(d, delay);
  return (
    <div
      style={{
        opacity: b.opacity,
        transform: `translateY(${b.y}px) scale(${b.scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Text that writes itself on: a clip wipe uncovers the plate left-to-right and
 * a bright edge travels with the reveal.
 */
const Reveal: React.FC<{ delay?: number; dur?: number; children: React.ReactNode }> = ({
  delay = 0,
  dur = 16,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = EASE.expo(clamp01((frame - delay) / dur));
  return (
    <div style={{ position: 'relative', clipPath: `inset(0 ${(1 - t) * 100}% 0 0 round 14px)` }}>
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${t * 100}%`,
          width: 26,
          marginLeft: -26,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(45,127,249,0.85) 100%)',
          opacity: t > 0.02 && t < 0.99 ? 1 : 0,
        }}
      />
    </div>
  );
};

/** Thin light sweep across the band — ties one overlay to the next. */
const Sweep: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - delay) / 18);
  if (t <= 0 || t >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.bandTop - 30,
        height: LAYOUT.bandHeight + 60,
        left: `${EASE.smooth(t) * 140 - 30}%`,
        width: 190,
        transform: 'skewX(-14deg)',
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)',
        opacity: Math.sin(t * Math.PI),
      }}
    />
  );
};

/* ------------------------------------------------------------------ scenes */

/**
 * 1. Hook: the real Zomato partner dashboard as proof, then a push-in onto the
 * "Your rank #4" tile.
 *
 * The screenshot is 1987x475 and the rank number sits near its bottom edge, so
 * the zoom window is pinned to the image bottom rather than centred on the
 * number — anything else would show empty space past the crop.
 */
const SHOT_W = 1987;
const SHOT_TOP = 60; // hides the phone status bar
const SHOT_BOTTOM = 475;
const PROOF_W = 744;
const PROOF_H = 168;

// Fitted: whole dashboard, letterboxed inside the card.
const FIT_S = PROOF_W / SHOT_W;
const FIT_TX = 0;
const FIT_TY = (PROOF_H - (SHOT_BOTTOM - SHOT_TOP) * FIT_S) / 2 - SHOT_TOP * FIT_S;

// Zoomed: a 775px-wide source window on the rank tile, bottom-aligned to the
// image edge. Near 1:1 pixels, and the top lands below the date line rather
// than slicing through it.
const ZOOM_X = 1000;
const ZOOM_S = PROOF_W / 775;
const ZOOM_TX = -ZOOM_X * ZOOM_S;
const ZOOM_TY = -(SHOT_BOTTOM - PROOF_H / ZOOM_S) * ZOOM_S;

export const Hook: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = EASE.expo(clamp01((frame - 18) / 34));
  const s = FIT_S + (ZOOM_S - FIT_S) * push;
  const tx = FIT_TX + (ZOOM_TX - FIT_TX) * push;
  const ty = FIT_TY + (ZOOM_TY - FIT_TY) * push;
  const ring = clamp01(springAt(frame - 50, fps, { stiffness: 240, damping: 15 }));
  const pulse = 1 + Math.sin(Math.max(0, frame - 58) / 7) * 0.03 * ring;

  return (
    <>
      <Sweep />
      <Band gap={12}>
        <Enter d={d}>
          <Kicker color={COLORS.green}>Zomato partner app</Kicker>
        </Enter>
        <Enter d={d} delay={3}>
          <div
            style={{
              background: COLORS.white,
              padding: 6,
              borderRadius: 16,
              boxShadow: '0 20px 52px rgba(6,14,33,0.55)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: PROOF_W,
                height: PROOF_H,
                overflow: 'hidden',
                borderRadius: 10,
                background: '#1E1E1E',
              }}
            >
              <Img
                src={staticFile('my_cafe_top_5.jpg')}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: SHOT_W,
                  maxWidth: 'none',
                  transformOrigin: '0 0',
                  transform: `translate(${tx}px, ${ty}px) scale(${s})`,
                }}
              />
              {/* Ring lands on the rank number once the push-in settles. */}
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 82,
                  width: 134,
                  height: 72,
                  borderRadius: 12,
                  border: `4px solid ${COLORS.green}`,
                  boxShadow: `0 0 26px ${COLORS.green}aa, inset 0 0 22px ${COLORS.green}44`,
                  opacity: ring,
                  transform: `scale(${(0.7 + 0.3 * ring) * pulse})`,
                }}
              />
            </div>
          </div>
        </Enter>
      </Band>
    </>
  );
};

/** 2. Five simple moves — numbered chips landing one by one. */
export const FiveMoves: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = springAt(frame - 58, fps, { stiffness: 200, damping: 13 });
  return (
    <>
      <Sweep />
      <Band gap={22}>
        <Enter d={d}>
          <Reveal delay={4}>
            <Plate size={62} accent={COLORS.blue}>
              5 SIMPLE MOVES
            </Plate>
          </Reveal>
        </Enter>
        <div style={{ display: 'flex', gap: 16 }}>
          {[1, 2, 3, 4, 5].map((n, i) => {
            const p = springAt(frame - 20 - i * 6, fps, { stiffness: 280, damping: 14 });
            return (
              <div
                key={n}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  background: COLORS.white,
                  color: COLORS.navy,
                  fontFamily: mono,
                  fontWeight: 800,
                  fontSize: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${clamp01(p)}) translateY(${(1 - clamp01(p)) * 24}px)`,
                  opacity: clamp01(p * 2),
                  boxShadow: '0 14px 34px rgba(6,14,33,0.5)',
                  border: `4px solid ${[COLORS.red, COLORS.amber, COLORS.gold, COLORS.green, COLORS.blue][i]}`,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div
          style={{
            transform: `rotate(${-6 + (1 - clamp01(stamp)) * 14}deg) scale(${0.6 + 0.4 * clamp01(stamp)})`,
            opacity: clamp01(stamp * 2),
          }}
        >
          <Kicker color={COLORS.green} size={27}>
            Nothing complex
          </Kicker>
        </div>
      </Band>
    </>
  );
};

/** 3. Menu score gauge sweeping past the 80% cutoff. */
export const MenuScore: React.FC<SceneProps> = ({ durationInFrames: d }) => (
  <>
    <Sweep />
    <Band gap={10}>
      <Enter d={d}>
        <Reveal delay={3}>
          <Plate size={46} accent={COLORS.green}>
            MENU SCORE
          </Plate>
        </Reveal>
      </Enter>
      <Enter d={d} delay={6}>
        <Gauge value={86} threshold={80} size={310} delay={12} duration={40} />
        <Kicker color={COLORS.green} size={23} style={{ marginTop: -6 }}>
          Minimum 80%
        </Kicker>
      </Enter>
    </Band>
  </>
);

/** 4. Below 80% the curve just flatlines. */
export const NoPush: React.FC<SceneProps> = ({ durationInFrames: d }) => (
  <>
    <Sweep />
    <Band gap={14}>
      <Enter d={d}>
        <Reveal delay={3}>
          <Plate size={44} accent={COLORS.red}>
            NO ORGANIC PUSH
          </Plate>
        </Reveal>
      </Enter>
      <Enter d={d} delay={5}>
        <Card style={{ padding: '14px 18px 10px' }}>
          <Label style={{ marginBottom: 6 }}>Order volume</Label>
          <TrendLine
            points={[0.46, 0.47, 0.45, 0.46, 0.47, 0.46, 0.45, 0.46]}
            color={COLORS.red}
            w={LAYOUT.contentWidth - 60}
            h={150}
            delay={8}
            duration={34}
          />
          <Label color={COLORS.red} size={24} style={{ textAlign: 'center', marginTop: 2 }}>
            Stagnant
          </Label>
        </Card>
      </Enter>
    </Band>
  </>
);

/** 5. Ads toggle flipping on. */
export const AdsOn: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flip = clamp01(springAt(frame - 26, fps, { stiffness: 220, damping: 20 }));
  const on = flip > 0.5;
  return (
    <>
      <Sweep />
      <Band gap={22}>
        <Enter d={d}>
          <Reveal delay={3}>
            <Plate size={44} accent={COLORS.amber}>
              ADS + DISCOUNTS
            </Plate>
          </Reveal>
        </Enter>
        <Enter d={d} delay={6}>
          <div
            style={{
              width: 260,
              height: 116,
              borderRadius: 58,
              background: on ? COLORS.green : 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              padding: 8,
              boxShadow: on ? `0 0 44px ${COLORS.green}88` : 'none',
            }}
          >
            <div
              style={{
                width: 94,
                height: 94,
                borderRadius: '50%',
                background: COLORS.white,
                transform: `translateX(${flip * 144}px)`,
                boxShadow: '0 10px 26px rgba(6,14,33,0.5)',
              }}
            />
          </div>
          <Kicker color={on ? COLORS.green : COLORS.navy} size={28}>
            {on ? 'Running' : 'Off'}
          </Kicker>
        </Enter>
      </Band>
    </>
  );
};

/** 6. New restaurant, ads off: visibility drops to zero. */
export const ZeroVisibility: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const shake = frame > 34 && frame < 46 ? Math.sin(frame * 2.6) * 5 : 0;
  return (
    <>
      <Sweep />
      <Band gap={14}>
        <Enter d={d}>
          <Kicker color={COLORS.navy}>New restaurant</Kicker>
        </Enter>
        <Enter d={d} delay={4}>
          <Card style={{ padding: '14px 20px', transform: `translateX(${shake}px)` }}>
            <Label style={{ marginBottom: 8 }}>Visibility</Label>
            <TrendLine
              points={[0.72, 0.5, 0.34, 0.2, 0.1, 0.04, 0.02, 0.02]}
              color={COLORS.red}
              w={LAYOUT.contentWidth - 70}
              h={128}
              delay={6}
              duration={30}
            />
          </Card>
        </Enter>
        <Enter d={d} delay={30}>
          <NumPlate size={56} color={COLORS.red} style={{ letterSpacing: 0 }}>
            ORDERS · 0
          </NumPlate>
        </Enter>
      </Band>
    </>
  );
};

/** 7. Ratings: five stars filling to 4.3. */
export const RatingScene: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const val = tween(frame, [10, 46], [3.2, 4.3], EASE.out);
  return (
    <>
      <Sweep />
      <Band gap={18}>
        <Enter d={d}>
          <Reveal delay={3}>
            <Plate size={44} accent={COLORS.gold}>
              GET TO 4 STARS
            </Plate>
          </Reveal>
        </Enter>
        <Enter d={d} delay={6}>
          <Stars rating={4.3} size={92} delay={10} />
          <NumPlate size={64} color={val >= 4 ? COLORS.green : COLORS.navy}>
            {val.toFixed(1)}
          </NumPlate>
        </Enter>
      </Band>
    </>
  );
};

/** 8. Below four stars vs above: two curves, one dead, one alive. */
export const GrowthSplit: React.FC<SceneProps> = ({ durationInFrames: d }) => (
  <>
    <Sweep />
    <Band gap={14}>
      <Enter d={d}>
        <Reveal delay={3}>
          <Plate size={42} accent={COLORS.green}>
            GROWTH · SIDE BY SIDE
          </Plate>
        </Reveal>
      </Enter>
      <Enter d={d} delay={5} style={{ flexDirection: 'row', gap: 18 }}>
        <Card style={{ padding: '12px 14px' }}>
          <Label color={COLORS.red}>Under 4★</Label>
          <TrendLine
            points={[0.34, 0.3, 0.33, 0.3, 0.31, 0.29]}
            color={COLORS.red}
            w={330}
            h={124}
            delay={8}
            duration={28}
          />
        </Card>
        <Card style={{ padding: '12px 14px' }}>
          <Label color={COLORS.green}>4★ and up</Label>
          <TrendLine
            points={[0.22, 0.34, 0.42, 0.6, 0.76, 0.95]}
            color={COLORS.green}
            w={330}
            h={124}
            delay={14}
            duration={30}
          />
        </Card>
      </Enter>
    </Band>
  </>
);

/** 9. Premium customers scan ratings before they order. */
export const PremiumPicks: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pick = clamp01(springAt(frame - 40, fps, { stiffness: 220, damping: 16 }));
  const cards = [
    { r: '3.6', ok: false },
    { r: '4.4', ok: true },
    { r: '3.9', ok: false },
  ];
  return (
    <>
      <Sweep />
      <Band gap={18}>
        <Enter d={d}>
          <Reveal delay={3}>
            <Plate size={40} accent={COLORS.purple}>
              THEY CHECK RATINGS FIRST
            </Plate>
          </Reveal>
        </Enter>
        <Enter d={d} delay={6} style={{ flexDirection: 'row', gap: 16 }}>
          {cards.map((c, i) => {
            const p = clamp01(springAt(frame - 12 - i * 6, fps, { stiffness: 260, damping: 16 }));
            const lift = c.ok ? pick : 0;
            return (
              <div
                key={c.r}
                style={{
                  width: 200,
                  height: 176,
                  borderRadius: 18,
                  background: c.ok ? COLORS.white : 'rgba(255,255,255,0.14)',
                  border: c.ok ? `4px solid ${COLORS.green}` : '2px solid rgba(255,255,255,0.22)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transform: `scale(${(0.86 + 0.14 * p) * (1 + lift * 0.09)}) translateY(${-lift * 12}px)`,
                  opacity: clamp01(p * 2) * (c.ok ? 1 : 1 - lift * 0.55),
                  boxShadow: c.ok ? `0 20px 50px rgba(0,179,126,${0.2 + lift * 0.4})` : 'none',
                }}
              >
                <div
                  style={{
                    width: 132,
                    height: 22,
                    borderRadius: 6,
                    background: c.ok ? 'rgba(20,38,74,0.14)' : 'rgba(255,255,255,0.22)',
                  }}
                />
                <div
                  style={{
                    fontFamily: mono,
                    fontWeight: 800,
                    fontSize: 46,
                    color: c.ok ? COLORS.green : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {c.r}★
                </div>
                {c.ok ? (
                  <div
                    style={{
                      fontFamily: mono,
                      fontWeight: 800,
                      fontSize: 19,
                      letterSpacing: 2,
                      color: COLORS.green,
                      opacity: pick,
                    }}
                  >
                    ORDERED
                  </div>
                ) : (
                  <div style={{ height: 24 }} />
                )}
              </div>
            );
          })}
        </Enter>
      </Band>
    </>
  );
};

/** 10. Organic reach climbing. */
export const OrganicReach: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const pct = tween(frame, [10, 44], [0, 138], EASE.out);
  return (
    <>
      <Sweep />
      <Band gap={12}>
        <Enter d={d}>
          <Reveal delay={3}>
            <Plate size={46} accent={COLORS.green}>
              ORGANIC REACH
            </Plate>
          </Reveal>
        </Enter>
        <Enter d={d} delay={5}>
          <Card style={{ padding: '12px 18px 8px', position: 'relative' }}>
            <TrendLine
              points={[0.12, 0.2, 0.3, 0.46, 0.68, 0.9]}
              color={COLORS.green}
              w={LAYOUT.contentWidth - 66}
              h={138}
              delay={8}
              duration={34}
            />
          </Card>
        </Enter>
        <Enter d={d} delay={26}>
          <NumPlate size={52} color={COLORS.green}>
            +{Math.round(pct)}%
          </NumPlate>
        </Enter>
      </Band>
    </>
  );
};

/** 11. Average order value bars. */
export const AovScene: React.FC<SceneProps> = ({ durationInFrames: d }) => (
  <>
    <Sweep />
    <Band gap={16}>
      <Enter d={d}>
        <Reveal delay={3}>
          <Plate size={42} accent={COLORS.amber}>
            AVERAGE ORDER VALUE
          </Plate>
        </Reveal>
      </Enter>
      <Enter d={d} delay={6}>
        <Bars
          bars={[
            { label: 'a', value: 280, color: '#8FA0BC', caption: 'Before' },
            { label: 'b', value: 640, color: COLORS.amber, caption: 'After' },
          ]}
          max={700}
          h={152}
          barW={136}
          gap={70}
          delay={10}
          format={(n) => `₹${Math.round(n)}`}
        />
      </Enter>
    </Band>
  </>
);

/** 12. Why the platform cares: the commission chain. */
export const CommissionFlow: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { t: 'BIGGER ORDER', c: COLORS.amber },
    { t: 'MORE COMMISSION', c: COLORS.blue },
    { t: 'ZOMATO PUSHES YOU', c: COLORS.green },
  ];
  return (
    <>
      <Sweep />
      <Band gap={12}>
        {steps.map((s, i) => {
          const p = clamp01(springAt(frame - 8 - i * 13, fps, { stiffness: 220, damping: 18 }));
          const arrow = clamp01((frame - 16 - i * 13) / 8);
          return (
            <React.Fragment key={s.t}>
              {i > 0 ? (
                <svg width={34} height={30} style={{ opacity: arrow }}>
                  <path
                    d={`M 4 ${4 + (1 - arrow) * 10} L 17 ${20 + (1 - arrow) * 6} L 30 ${4 + (1 - arrow) * 10}`}
                    stroke={s.c}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ) : null}
              <div
                style={{
                  opacity: clamp01(p * 2),
                  transform: `translateX(${(1 - p) * (i % 2 ? 60 : -60)}px)`,
                }}
              >
                <Plate size={40} accent={s.c} pad="9px 22px">
                  {s.t}
                </Plate>
              </div>
            </React.Fragment>
          );
        })}
      </Band>
    </>
  );
};

/** 13. The payoff: the algorithm lifts you to the top. */
export const PushRank: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const b = useBeat(d, 0, { exit: 10 });
  return (
    <>
      <Sweep />
      <Band gap={12} justify="flex-start">
        <Enter d={d}>
          <Kicker color={COLORS.green}>Algorithm picks you</Kicker>
        </Enter>
        <div style={{ opacity: b.opacity, transform: `translateY(${b.y}px)` }}>
          <RankList
            rows={[
              { name: 'Spice Junction' },
              { name: 'The Curry Co.' },
              { name: 'Tandoori Nights' },
              { name: 'Bowl & Co.' },
            ]}
            fromRank={4}
            toRank={1}
            rowH={45}
            w={LAYOUT.contentWidth}
            delay={10}
            duration={40}
          />
        </div>
      </Band>
    </>
  );
};

/** 14. Teaser for the next video. */
export const NextVideo: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const float = useFloat(5, 70);
  return (
    <>
      <Sweep />
      <Band gap={16}>
        <Enter d={d}>
          <Kicker color={COLORS.red}>Next video</Kicker>
        </Enter>
        <Enter d={d} delay={6} style={{ transform: `translateY(${float}px)` }}>
          <Reveal delay={10} dur={20}>
            <Plate size={54} accent={COLORS.blue} style={{ whiteSpace: 'normal', textAlign: 'center' }}>
              THE MATH NOBODY SHOWS YOU
            </Plate>
          </Reveal>
        </Enter>
      </Band>
    </>
  );
};

/** 15. ₹12L on the platform equals ₹2L direct — the hook for next time. */
export const Compare: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eq = clamp01(springAt(frame - 40, fps, { stiffness: 260, damping: 12 }));
  // Both bars are drawn the same height on purpose: the punchline is that the
  // two very different revenue numbers come out to the same money.
  const col = (value: string, caption: string, color: string, delay: number) => {
    const g = EASE.expo(clamp01((frame - delay) / 26));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            background: COLORS.white,
            color: COLORS.navy,
            fontFamily: mono,
            fontWeight: 800,
            fontSize: 40,
            padding: '3px 16px',
            borderRadius: 10,
            borderBottom: `5px solid ${color}`,
            opacity: g,
            transform: `translateY(${(1 - g) * 14}px)`,
            boxShadow: '0 12px 30px rgba(6,14,33,0.45)',
          }}
        >
          {value}
        </div>
        <div
          style={{
            width: 156,
            height: 142 * g,
            background: color,
            borderRadius: '14px 14px 5px 5px',
            boxShadow: `0 0 34px ${color}66`,
          }}
        />
        <Kicker color={color} size={21}>
          {caption}
        </Kicker>
      </div>
    );
  };

  return (
    <>
      <Sweep />
      <Band gap={14}>
        <Enter d={d}>
          <Reveal delay={3}>
            <Plate size={44} accent={COLORS.gold}>
              SAME MONEY
            </Plate>
          </Reveal>
        </Enter>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          {col('₹12L', 'Zomato', COLORS.red, 6)}
          <div
            style={{
              marginBottom: 70,
              fontFamily: mono,
              fontWeight: 900,
              fontSize: 88,
              color: COLORS.white,
              transform: `scale(${0.3 + 0.7 * eq}) rotate(${(1 - eq) * -25}deg)`,
              opacity: eq,
              textShadow: '0 10px 30px rgba(0,0,0,0.65)',
            }}
          >
            =
          </div>
          {col('₹2L', 'Direct', COLORS.green, 18)}
        </div>
      </Band>
    </>
  );
};

/** 16. Follow CTA. */
export const FollowCta: React.FC<SceneProps> = ({ durationInFrames: d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = clamp01(springAt(frame - 4, fps, { stiffness: 220, damping: 14 }));
  const ripple = (frame % 34) / 34;
  return (
    <>
      <Sweep />
      <Band gap={18}>
        <div style={{ position: 'relative', transform: `scale(${0.7 + 0.3 * pop})`, opacity: pop }}>
          <div
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: 22,
              border: `4px solid ${COLORS.red}`,
              transform: `scale(${1 + ripple * 0.5})`,
              opacity: (1 - ripple) * 0.8,
            }}
          />
          <div
            style={{
              background: COLORS.white,
              color: COLORS.navy,
              fontFamily: montserrat,
              fontWeight: 900,
              fontSize: 66,
              letterSpacing: -1,
              padding: '14px 56px',
              borderRadius: 18,
              borderBottom: `8px solid ${COLORS.red}`,
              boxShadow: '0 20px 50px rgba(6,14,33,0.5)',
            }}
          >
            FOLLOW
          </div>
        </div>
        <Enter d={d} delay={14}>
          <Kicker color={COLORS.navy} size={26}>
            Part 2 drops next
          </Kicker>
        </Enter>
      </Band>
    </>
  );
};

export const SceneFill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);
