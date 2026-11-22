# Element Sniper 2.3.0

Arcade-style bookmarklet element hider.

## Files
- `gun.js` — readable engine; exposes `window.ElementSniper()`.
- `index.html` — live demo, compressed inlined bookmarklet generator, CDN loader.
- `gun.min.js` — compact engine build.

## CDN
`https://cdn.jsdelivr.net/gh/xclounkit234x/p@main/bookmark/gun/gun.js`

## Deploy
This folder can be served at:
- `https://xkjs.pages.dev/bookmark/gun/`
- `https://xkjs-dev.web.app/bookmark/gun/`

## Notes
The muzzle flash, tracer and shell use the same SVG barrel-tip coordinate transformed by the gun's actual rotation. Detection uses composed event paths, `elementFromPoint`, open Shadow DOM hit-testing, text-node normalization and best-effort same-origin iframe traversal. Cross-origin frames and closed Shadow Roots remain inaccessible by browser design.

## Controls
Move to aim; click to fire; MULTI toggles repeated shots; UNDO or Ctrl/⌘+Z restores the most recent target; Escape exits.
