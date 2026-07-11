# Development log

## 2026-07-12 — Initial audit and documentation
- **Affected files:** CHANGELOG.md, ROADMAP.md, DEVELOPMENT_LOG.md, ARCHITECTURE.md, TESTING.md
- **Reason:** Establish the required evidence-based baseline before behavior changes.
- **Technical implementation:** Inspected all tracked files/history; served the unmodified site; exercised Hebrew entry and Three.js rendering; reviewed console, input, tour, animation, renderer and Vercel behavior.
- **Expected user-visible effect:** None; documentation only.
- **Tests performed:** Static serve, desktop entry/render, accessibility snapshot, console warnings/errors and source inspection.
- **Remaining limitations:** Mobile/sensor/WebGL failure/WebXR hardware/older Samsung tests and functional work remain.

## 2026-07-12 — Immersive experience v2 implementation
- **Affected files:** index.html, styles.css, js/data.js, js/compatibility.js, js/app.js, AUDIO.md
- **Reason:** Deliver the requested stabilization, mode selection, tour, exploration, atmosphere, performance and VR improvements.
- **Technical implementation:** Replaced the monolith with native modules; added guarded renderer startup, capability reporting, adaptive quality, stable character animation, unified pointer gestures, tour state, hotspots with raycast visibility, safe viewpoints, opt-in generated audio channels, phone stereo/IPD and WebXR detection.
- **Expected user-visible effect:** A responsive Hebrew menu, clearer onboarding, controllable guided tour, interactive educational points, settings, graceful fallbacks and smoother mobile behavior.
- **Tests performed:** Source validation and static compatibility inspection before browser regression pass.
- **Remaining limitations:** Real WebXR and older Samsung hardware are unavailable; historical placement is educational/artistic; narration assets are intentionally absent.

## 2026-07-12 — Browser verification refinements
- **Affected files:** index.html, js/app.js, js/compatibility.js, TESTING.md
- **Reason:** Address issues found during desktop interaction verification.
- **Technical implementation:** Added keyboard-accessible hotspot cycling, automatic tour dwell controlled by pause/resume, reusable occlusion direction and occluder collections, and a deterministic WebGL-failure test hook.
- **Expected user-visible effect:** Hotspots are reachable without precise pointer input; the guided tour truly pauses/resumes; smoother frames on constrained devices.
- **Tests performed:** Menu, guided onboarding, next/previous controls, free exploration, human-height navigation, settings, capability report and console inspection.
- **Remaining limitations:** Physical sensor/headset testing and automated viewport emulation remain unavailable.

## 2026-07-12 — Vercel preview verification
- **Affected files:** DEVELOPMENT_LOG.md, TESTING.md
- **Reason:** Verify the automatically deployed branch preview.
- **Technical implementation:** Followed the Vercel Ready deployment URL published on PR #1 and inspected the response.
- **Expected user-visible effect:** None.
- **Tests performed:** Vercel deployment status and preview navigation.
- **Remaining limitations:** The preview is protected by Vercel authentication, so anonymous end-to-end rendering could not be verified; local static serving remains successful.
