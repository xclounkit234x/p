# Element Sniper 2.1

Arcade-style page element hider bookmarklet.

- `gun.js`: standalone bookmarklet payload (also exposes `window.ElementSniper` for the demo page).
- `index.html`: live demo and bookmarklet/CDN-loader copier.

## CDN loader
```js
javascript:(()=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/xclounkit234x/p@main/bookmark/gun/gun.js';document.head.appendChild(s)})()
```

Open Shadow DOM is traversed where supported. Cross-origin iframe documents and closed Shadow Roots remain inaccessible by browser security design.
