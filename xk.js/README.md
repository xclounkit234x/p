# xk.js

A modular browser plugin framework by Xclounkit234X Productions.

## Development

- `src/` — readable ES module source.
- `dist/xk.js` — bundled ES module for production.
- `dist/xk.min.js` — minified ES module for CDN use.
- `main.js` — backwards-compatible entry for the existing `/xk.js/main.js` URL.

## Build

From this directory:

```sh
npm install
npm run build
```

The build generates both distribution files in `dist/`.

## ES module usage

```js
import * as XK from "./dist/xk.js";

console.log(XK.VERSION);
```
