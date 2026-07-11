# Testing

## Ground-level journey — 2026-07-12

| Test | Result | Notes |
|---|---|---|
| Fourth main-menu mode | Pass by source review | `מסע בתוך המקדש` is present alongside the three existing modes. |
| Journey dataset | Pass by source review | Ten ordered stops include Hebrew titles, French subtitles, explanations, positions, look targets, durations and safe waypoints. |
| Journey controls | Pass by source review | Previous, pause/resume, continue, exit, counter and progress elements are wired. |
| Curved movement | Pass by source review | Uses prebuilt `THREE.CatmullRomCurve3` paths with smooth easing. |
| Human-height start | Pass by source review | The first viewpoint starts outside at the foot of the reconstructed eastern wall. |
| Restricted-area ending | Pass by source review | The route ends in front of the Heikhal and explicitly explains restricted access. |
| Existing modes retained | Pass by source review | Tour, exploration and phone stereo code paths remain present. |
| Keyboard controls | Pass by source review | Arrow keys navigate and Space pauses/resumes the journey. |
| Remote validation | Pass by source review | Journey commands are accepted only in journey mode and stop indexes are range checked. |
| Responsive controls | Pass by CSS inspection | Four-card desktop/tablet layouts and compact landscape controls are defined. |
| Physical route clearance | Not yet verified | Must be tested visually on the Vercel preview and on a real phone before merge. |
| JavaScript runtime/console | Not yet verified | This environment could edit GitHub but could not execute the branch in a browser. |

## Existing v2 environment
- Date: 2026-07-12
- Static server: Python 3.11 on 127.0.0.1:4173
- Browser: Codex in-app Chromium, 1280×720, DPR 2
- Branch: feature/immersive-experience-v2

## Existing v2 results
| Test | Result | Notes |
|---|---|---|
| JavaScript syntax | Pass | node --check for app.js, data.js and compatibility.js. |
| Static load / Vercel structure | Pass with limitation | Local static server passes; Vercel reports Ready, but its preview requires Vercel authentication. |
| Hebrew RTL menu | Pass | Three original accessible mode buttons and onboarding dialogs. |
| Three.js startup | Pass | Menu appears after guarded renderer initialization; no new console errors. |
| Forced WebGL failure | Pass | ?forceWebglError=1 shows Hebrew recovery screen and retry. |
| Guided tour | Pass | Previous/next, pause/resume, exit, progress, educational panel and automatic dwell. |
| Keyboard controls | Pass | Arrow navigation and Space/Escape handlers present. |
| Free exploration | Pass | Overview, safe human-height viewpoints and keyboard hotspot cycle. |
| Pointer drag/tap separation | Pass by implementation | 8 px movement threshold prevents tap action after drag. |
| Character drift | Pass by implementation | Y is derived from saved baseY every frame. |
| Low quality and FPS | Pass | Low preset selected at runtime; FPS display reported 41 FPS in test browser. |
| Settings/capabilities | Pass | WebGL, orientation, fullscreen, lock and WebXR status displayed. |
| Phone stereo fallback | Pass | Split mode entered; orientation-lock failure produced guidance; visible exit returned to menu. |
| WebXR unavailable | Pass | Capability shown unavailable without blocking other modes. |
| Audio disabled/unavailable | Pass | Experience remained complete. |
| Hidden page | Pass by implementation | Rendering returns early while document.hidden and clock resets on resume. |
| Mobile portrait/landscape CSS | Pass by inspection | Dedicated breakpoints, safe areas and 44 px controls. |

## Limitations
Physical touch, device orientation, WebXR hardware, thermal behavior, Gear VR/Cardboard comfort, older Samsung performance, exact collision clearance and historical route accuracy require real-device and expert validation. The reconstruction remains an educational artistic interpretation.

## External remote-control results
| Test | Result | Notes |
|---|---|---|
| Supabase project health | Pass | Dedicated eu-central-1 project is ACTIVE_HEALTHY. |
| Pairing token | Pass | 128-bit Web Crypto token, formatted for display and shared in URL. |
| Two-page Realtime connection | Pass | Headset and controller subscribed to the same ephemeral Broadcast topic. |
| Remote tour navigation | Pass | Next command moved headset to stop 2 / 7. |
| Remote quality | Pass | Controller changed headset quality to High. |
| Local stereo preparation | Pass with fallback | Local gesture entered stereo; unavailable landscape lock produced Hebrew guidance. |
