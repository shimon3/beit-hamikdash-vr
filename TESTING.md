# Testing

## Environment
- Date: 2026-07-12
- Static server: Python 3.11 on 127.0.0.1:4173
- Browser: Codex in-app Chromium, 1280×720, DPR 2
- Branch: feature/immersive-experience-v2

## Results
| Test | Result | Notes |
|---|---|---|
| JavaScript syntax | Pass | node --check for app.js, data.js and compatibility.js. |
| Static load / Vercel structure | Pass with limitation | Local static server passes; Vercel reports Ready, but its preview requires Vercel authentication. |
| Hebrew RTL menu | Pass | Three distinct accessible mode buttons and onboarding dialogs. |
| Three.js startup | Pass | Menu appears after guarded renderer initialization; no new console errors. |
| Forced WebGL failure | Pass | ?forceWebglError=1 shows Hebrew recovery screen and retry. |
| Guided tour | Pass | Previous/next, pause/resume, exit, progress, educational panel and automatic dwell. |
| Keyboard controls | Pass | Arrow navigation changed stop 2 to 3; Space/Escape handlers present. |
| Free exploration | Pass | Overview, safe human-height viewpoints and keyboard hotspot cycle. |
| Pointer drag/tap separation | Pass by implementation | 8 px movement threshold prevents tap action after drag. |
| Character drift | Pass by implementation | Y is derived from saved baseY every frame. |
| Low quality and FPS | Pass | Low preset selected at runtime; FPS display reported 41 FPS in test browser. |
| Settings/capabilities | Pass | WebGL, orientation, fullscreen, lock and WebXR status displayed. |
| Phone stereo fallback | Pass | Split mode entered; orientation-lock failure produced guidance; visible exit returned to menu. |
| WebXR unavailable | Pass | Capability shown unavailable without blocking other modes. |
| Audio disabled/unavailable | Pass | Experience remained complete; automation context declined activation without runtime error. |
| Hidden page | Pass by implementation | Rendering returns early while document.hidden and clock resets on resume. |
| Desktop overflow | Pass | scrollWidth equals 1280 at a 1280-wide viewport. |
| Mobile portrait/landscape CSS | Pass by inspection | Dedicated <=720 px and short landscape rules, safe areas and 44 px controls. |

## Limitations
The connected browser did not expose viewport-resizing or touch-emulation controls, so 360×800, 390×844, 800×360 and 844×390 were verified through responsive-rule inspection rather than screenshots. Physical touch, device orientation, WebXR hardware, thermal behavior, Gear VR/Cardboard comfort and older Samsung performance require real-device testing. The historical reconstruction remains an educational artistic interpretation.

## External remote-control results

| Test | Result | Notes |
|---|---|---|
| Supabase project health | Pass | Dedicated eu-central-1 project is ACTIVE_HEALTHY. |
| Supabase advisors | Pass | No security or performance lints. |
| Pairing token | Pass | 128-bit Web Crypto token, formatted for display and shared in URL. |
| Two-page Realtime connection | Pass | Headset and controller subscribed to the same ephemeral Broadcast topic. |
| Connection status | Pass | Controller and headset both displayed connected state. |
| Remote mode selection | Pass | Controller changed headset from stereo to guided tour. |
| Remote tour navigation | Pass | Next command moved headset to stop 2 / 7. |
| Remote quality | Pass | Controller changed headset quality to High. |
| Local stereo preparation | Pass with fallback | Local gesture entered stereo; unavailable landscape lock produced Hebrew guidance. |
| Console | Pass | No new errors or warnings in either page. |

Remote control requires internet access and possession of the pairing link. Fullscreen must be prepared locally because browsers do not allow a WebSocket message to satisfy the user-gesture requirement.
