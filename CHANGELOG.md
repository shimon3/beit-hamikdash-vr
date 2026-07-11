# Changelog

## [Unreleased]

### Added
- External mobile/desktop VR remote control with ephemeral Supabase Realtime pairing.
- Remote commands for modes, tour stops, viewpoints, hotspots, recentering, quality, volume and exits.
- Local stereo/fullscreen preparation before headset insertion.
- Hebrew experience selection for guided tour, free exploration and phone stereo.
- Mode-specific onboarding, persistent menu return and semantic accessible controls.
- Seven-stop guided tour with previous, pause/resume, next, exit and progress.
- Interactive hotspots, educational panel, overview and safe human-height viewpoints.
- Optional locally generated audio channels with mute, volume and channel controls.
- Low, Balanced and High quality presets plus optional FPS display.
- Capability reporting for WebGL, orientation, fullscreen, orientation lock and WebXR.
- Phone stereo fallback with adjustable IPD and visible exit.
- Required architecture, roadmap, testing, changelog and development records.

### Fixed
- Cumulative vertical character drift.
- Accidental viewpoint action after drag gestures.
- Unguarded Three.js/WebGL initialization and missing runtime recovery UI.
- Resize/orientation handling and hidden-page rendering work.
- Repeated tour DOM writes and per-frame camera/hotspot math allocations.

### Changed
- Split the monolithic prototype into HTML, CSS and native JavaScript modules.
- Clarified that the fallback is phone stereoscopic mode, not verified full Gear VR support.
