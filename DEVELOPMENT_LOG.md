# Development log

## 2026-07-12 — Ground-level immersive journey
- **Affected files:** index.html, styles.css, js/data.js, js/journey.js, js/app.js, CHANGELOG.md, DEVELOPMENT_LOG.md
- **Reason:** Add a fourth experience in which the visitor begins at the foot of the outer wall, receives an explanation, and advances step by step at human height.
- **Technical implementation:** Added a ten-stop journey dataset, a dedicated Hebrew/French interface, an opening in the reconstructed eastern wall, smooth `THREE.CatmullRomCurve3` waypoint movement, pause/resume, previous/continue/exit controls, keyboard navigation and validated journey remote commands.
- **Expected user-visible effect:** The visitor now experiences a progressive walk from outside the Temple Mount through the entrance and principal educational stops, ending respectfully in front of the Heikhal.
- **Tests performed:** Static source review, route endpoint validation, menu/control ID verification, mode-state validation and Vercel-static compatibility review.
- **Remaining limitations:** Physical mobile, Gear VR/Cardboard comfort, collision clearance and exact historical route require real-device and historical-expert validation before production merge.

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

## 2026-07-12 — External VR remote control
- **Affected files:** index.html, styles.css, remote.html, remote.css, js/remote-session.js, js/remote-controller.js, js/app.js, ARCHITECTURE.md, TESTING.md
- **Reason:** Keep the experience controllable after the phone is placed inside a headset.
- **Technical implementation:** Added an ephemeral Supabase Realtime Broadcast session using a cryptographically random 128-bit token, a separate Hebrew/French control page, headset status reporting and remote commands for modes, tour, viewpoints, hotspots, quality, audio and VR exit. Only the browser-safe publishable key is committed; no service key or personal data is stored.
- **Expected user-visible effect:** A second phone or computer can control the headset without touching it.
- **Tests performed:** Planned two-tab pairing, command delivery, reconnect/error states and existing local regression suite.
- **Remaining limitations:** Control requires internet access; pairing links grant control until the headset page closes; production should later add authenticated private channels if persistent accounts are required.

## 2026-07-12 — Remote headset preparation refinement
- **Affected files:** index.html, js/app.js, TESTING.md
- **Reason:** Fullscreen requires a local user gesture on mobile and the pairing dialog must not cover remotely selected content.
- **Technical implementation:** Added a local prepare-stereo action before headset insertion and automatically closes pairing UI when the controller selects an experience.
- **Expected user-visible effect:** The phone enters stereo/fullscreen while still touchable, then stays unobstructed under remote control.
- **Tests performed:** Two-tab Realtime connection and remote guided-tour activation.
- **Remaining limitations:** Browser permission behavior varies by mobile vendor; orientation lock may still require manual landscape rotation.
