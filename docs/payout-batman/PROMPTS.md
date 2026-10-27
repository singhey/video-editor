# "Me going to Zomato after opening my weekly payout": AI prompt pack

You generate 6 short clips in Kling (or Veo 3.1). The code handles everything else: the red-light flicker on the beat, the blackout, the light flash at the drop, the reused fight footage, the paper tags on the goons, the top caption, grain and colour match.

**Keep each clip simple.** The AI only has to make one calm, steady action per clip under one steady light. Simple clips have fewer mistakes, and that is what keeps the cost down.

---

## 0. Timeline (matches the reference, so the song's drop lands at 14.2 s)

| Time | Shot | Who makes it |
|---|---|---|
| 0.0 – 1.5 s | **S1** phone glow on your face, you open the payout | AI |
| 1.5 – 4.5 s | **S2** tying the apron in red light | AI |
| 4.5 – 7.5 s | **S3** rolling sleeves and picking up the karchi | AI |
| 7.5 – 10.0 s | **S4** cape on, still silhouette (hero pose) | AI |
| 10.0 – 11.5 s | blackout | code |
| 11.5 – 14.2 s | **S5** walking toward camera through tadka smoke | AI |
| 14.2 – 19.5 s | fight (reused reference footage) + deduction tags | code |
| 19.5 – 20.7 s | **S6** back at the counter, normal light, opens phone again → loops to S1 | AI |

The frame is **16:9 inside a 9:16 reel**, the same as the reference: black bars, with the meme caption above the picture.

---

## 1. Files to collect first (shoot on your phone, landscape / horizontal)

Put them in `public/payout-batman/mine/`.

| File | What to shoot |
|---|---|
| `me_front.jpg` | Your face, shoulders up, looking at the lens, even daylight, neutral face, no sunglasses or cap |
| `me_side.jpg` | Same, but a 3/4 angle |
| `me_full.jpg` | Full body, standing, in the clothes you'll "wear" (black hoodie works best) |
| `cafe_counter.jpg` | Your billing counter, landscape, from about chest height (used for S1 and S6) |
| `cafe_kitchen.jpg` | The kitchen area where you'll "suit up", with the stove and the pass visible |
| `cafe_passage.jpg` | A passage or door you could walk out of toward the camera (for S5) |

The reference frames are already saved in `public/payout-batman/reference/`:
- `ref_A_red_silhouette.png`: lighting and mood for S2–S4
- `ref_B_walk_red_strobe.png`: lighting and mood for S5
- `ref_C_stairwell_reveal.png`: the haze and colour we match into the fight

---

## 2. Settings for every generation

- **Aspect 16:9, 1080p, 5 s** (Kling) or **8 s** (Veo). We only use 1.5–3 s of each.
- **Sound off** (Kling) / ignore the audio (Veo). The song is added in Instagram.
- **Locked-off camera.** Every prompt says so. A static camera keeps faces stable and lets the code-made flicker look real.
- **Do not ask the AI to flicker the light.** Keep the red light constant; the code flickers it on the beat.
- **No phone screen content.** The screen faces away from the camera or shows only glow. If you want a real payout screen, screenshot yours, blur it and send it; I'll overlay it in code.
- **No Batman suit, ears, mask or bat logo.** Models often refuse or mangle them, and they're copyrighted. A plain black cape gives the same vibe.

### The character block (paste it unchanged into every prompt)

> the man from the reference photos, exact same face, hairstyle and skin tone, wearing a plain black hoodie, a black canvas chef's apron and black trousers

### The red-light block (S2–S5)

> lit only by a single deep-red practical light from the left side, the rest of the frame falls into near-black shadow, hard shadows, light haze in the air, cinematic, 35mm film grain, muted, desaturated except the red

### Negative prompt (Kling's "negative" box)

> text, letters, words, logo, watermark, subtitles, bat symbol, mask, superhero suit, helmet, extra fingers, deformed hands, distorted face, face change, camera shake, handheld, zoom, cuts, flickering light, strobe, cartoon, 3D render

---

## 3. Step 1: One hero image (do this first, reuse it everywhere)

**Tool:** Kling image with face reference / Elements, or Nano Banana (Gemini / Google Flow).
**Upload:** `me_front.jpg`, `me_side.jpg`, `me_full.jpg`, `cafe_kitchen.jpg`

> Photorealistic film still, 16:9. [CHARACTER BLOCK]. He stands in his own restaurant kitchen (use the kitchen photo for the room: same stove, tiles and steel counters), facing the camera, calm and serious. Soft overhead kitchen light. Shot on a 35mm lens at chest height, shallow depth of field, cinematic colour grade, natural skin texture.

Make 4 variations and **pick the one where the face looks most like you**. Save it as `hero.png` in `public/payout-batman/mine/`. **From here on, upload `hero.png` as the face/character reference for every shot.** That's what keeps you looking the same across all clips.

---

## 4. Step 2: Start frames (images) → Step 3: Clips (image-to-video)

For each shot: make the **start-frame image** first (cheap, so retry until it's right), then upload that image as the **first frame** in Kling image-to-video with the **motion prompt**. Save the clip with the file name shown, in `public/payout-batman/generated/`.

### S1: Phone glow (0.0–1.5 s) → `s1_phone.mp4`
**Upload:** `hero.png`, `cafe_counter.jpg`

**Image prompt:**
> Photorealistic film still, 16:9. [CHARACTER BLOCK], sitting behind the billing counter of his café (match the counter photo) at night, all lights off. The only light is the cold white-blue glow of a smartphone in his hands, lighting his face from below. The phone's back faces the camera; we cannot see the screen. Medium close-up, eye level, locked-off camera, deep black background, cinematic, 35mm film grain.

**Motion prompt:**
> Static camera. He looks down at his phone, calm. After a second his expression slowly drops: eyebrows lower, jaw tightens, a slow exhale through the nose. He keeps still. No other movement.

### S2: Tying the apron (1.5–4.5 s) → `s2_apron.mp4`
**Upload:** `hero.png`, `cafe_kitchen.jpg`, `ref_A_red_silhouette.png` (lighting only)

**Image prompt:**
> Photorealistic film still, 16:9. [CHARACTER BLOCK], standing in his restaurant kitchen at night, side profile, pulling the apron strings tight behind his back. [RED-LIGHT BLOCK]. Medium shot, locked-off camera. Match the lighting and mood of the red reference image, but keep the location as his kitchen.

**Motion prompt:**
> Static camera. He pulls the apron strings tight with one firm tug and ties a knot behind his back, slowly and deliberately. Light haze drifts. No camera movement, no light change.

### S3: Sleeves + karchi (4.5–7.5 s) → `s3_karchi.mp4`
**Upload:** `hero.png`, `cafe_kitchen.jpg`, `ref_A_red_silhouette.png`

**Image prompt:**
> Photorealistic film still, 16:9. Close-up of [CHARACTER BLOCK] at a steel kitchen counter at night, hoodie sleeves pushed up to the elbows, his hand resting near a large steel ladle (karchi) on the counter. [RED-LIGHT BLOCK]. Locked-off camera.

**Motion prompt:**
> Static camera. He slowly closes his hand around the steel ladle handle and lifts it off the counter, holding it at his side like a weapon. Calm, heavy, deliberate movement. No camera movement, no light change.

### S4: Cape on, hero silhouette (7.5–10.0 s) → `s4_cape.mp4`
**Upload:** `hero.png`, `cafe_kitchen.jpg`, `ref_A_red_silhouette.png`

**Image prompt:**
> Photorealistic film still, 16:9. [CHARACTER BLOCK] plus a plain matte black cloth cape over his shoulders, knee length, no symbols. He stands still in his dark kitchen, three-quarter back view, head slightly lowered, the ladle in his right hand. Mostly a silhouette against a red-lit wall. [RED-LIGHT BLOCK]. Wide shot, locked-off camera, composition like the red reference image.

**Motion prompt:**
> Static camera. He stays almost completely still; only the cape moves slightly as if a slow breeze passes. He slowly raises his head. No camera movement, no light change.

### S5: The walk (11.5–14.2 s) → `s5_walk.mp4`
**Upload:** `hero.png`, `cafe_passage.jpg`, `ref_B_walk_red_strobe.png`
**Tip:** Veo 3.1 is often better at smoke and walking. If Kling's walk looks rubbery, try this one in Veo.

**Image prompt:**
> Photorealistic film still, 16:9. [CHARACTER BLOCK] with the plain black cape, standing at the far end of the passage from his kitchen (match the passage photo), facing the camera, ladle in one hand, a crumpled sheet of paper in the other. Thick grey cooking smoke hangs in the air. [RED-LIGHT BLOCK], with small red light points in the background like the reference. Wide shot, low camera, locked-off.

**Motion prompt:**
> Static low camera. He walks slowly and steadily toward the camera through the smoke, cape moving behind him, stopping in a medium shot. Smoke swirls around him. Steady walking pace, no running. No camera movement, no light change.

### S6: Loop shot (19.5–20.7 s) → `s6_loop.mp4`
**Upload:** `hero.png`, `cafe_counter.jpg`, and **your chosen S1 start frame** (so the framing matches and the loop is seamless)

**Image prompt:**
> Photorealistic film still, 16:9. Exactly the same framing as the reference start frame: [CHARACTER BLOCK] (no cape) sitting behind the billing counter of his café, but now the café lights are on, normal warm evening light, calm face. He holds his phone; its back faces the camera. Locked-off camera, cinematic, 35mm film grain.

**Motion prompt:**
> Static camera. He calmly picks up the phone and looks down at it, as if opening an app. Small natural movement only. No camera movement.

---

## 5. How many tries

- Images: 2–4 variations per shot, until the face and framing are right. Images are cheap, so do the fixing here.
- Clips: 1 try per shot, a 2nd only if it's broken (face changes, hands melt, camera moves). Use draft/standard mode first; use high quality only for the final keeper.
- **Rough total: 6 clips × 1–2 tries = 6–12 clip generations.**

## 6. Send back

1. The 6 clips in `public/payout-batman/generated/` (or upload them in chat) with the file names above.
2. **The song** you'll pick in Instagram, and where the audio starts, so I can lock the flicker to its beats.
3. **The deduction names exactly as they appear on your payout** (e.g. commission, platform fee, ads…). These become the paper tags on the goons. Names only; amounts are optional, and only real ones.
4. Optional: a blurred screenshot of your payout screen for S1.
