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
