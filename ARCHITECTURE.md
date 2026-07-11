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

## External remote control

The headset page and `remote.html` communicate through an ephemeral Supabase Realtime Broadcast topic named from a cryptographically random 128-bit token. The token is included in the shared remote URL and is never stored in Postgres. Closing the headset page ends the receiver session.

- `js/remote-session.js`: pinned Supabase browser client, token generation and channel lifecycle.
- `js/remote-controller.js`: external administration state and command sender.
- Headset `js/app.js`: command validation, experience actions and status broadcasts.
- Only the Supabase publishable key is public. No secret or service-role key is shipped.
- The public topic is practically undiscoverable because the channel token has 128 bits of entropy. Anyone holding the pairing link can control that temporary session.
- Fullscreen is prepared by a local user gesture before headset insertion because browsers reject network-triggered fullscreen.
- A future account-based system should switch to authenticated private channels and Realtime Authorization policies.
