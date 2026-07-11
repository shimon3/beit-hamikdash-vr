# Testing

## Baseline — 2026-07-12

| Test | Result | Notes |
|---|---|---|
| Static serve / Vercel config | Pass | No build step required. |
| Hebrew entry and Three.js render | Pass with issue | No console errors; viewport framing/clipping needs work. |
| Character stability | Fail (inspection) | Y movement accumulates. |
| Drag vs tap | Fail (inspection) | Click follows drag in gyro/stereo. |
| WebGL/CDN failure | Fail | No visible recovery state. |
| Orientation absent | Fail | Helper can report success when API is absent. |
| WebXR | Fail | Not detected. |
| Reduced quality / hidden page | Fail | No adaptive policy. |
| Tour performance | Fail (inspection) | Per-frame allocation and DOM writes. |

Regression testing must cover desktop keyboard, 360×800/390×844 portrait, 800×360/844×390 landscape, touch gestures, missing orientation/WebGL/audio, Low quality, tour controls, hotspots, stereo exit, WebXR fallback and static serving. Physical Samsung/Gear VR testing remains required.
