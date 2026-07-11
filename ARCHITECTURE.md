# Architecture

## Baseline
The initial static Vercel project contains a monolithic `index.html` and `vercel.json`. Markup, CSS, Hebrew content, Three.js construction, controls and rendering are coupled; Three.js r128 is loaded from jsDelivr.

## Target
- `index.html`: semantic application shell.
- `styles.css`: responsive RTL interface.
- `js/data.js`: immutable tour/hotspot content.
- `js/compatibility.js`: feature and quality detection.
- `js/ui.js`: menus, panels, onboarding and settings.
- `js/scene.js`: scene, cameras, animation and renderer lifecycle.
- `js/app.js`: startup, modes and error boundary.

Native modules preserve framework-free Vercel deployment. DOM writes occur only on state changes, temporary math objects are reused, animations derive from stable base positions, and missing optional capabilities never block normal use.
