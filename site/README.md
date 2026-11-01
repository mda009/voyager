# Voyager public website

- `viewer/index.html`: the stream companion (tabs: Live, My card, Medals, Boards, Winners, Guide). It reads the live feed (and `crew.json` for the card lookup) from the `public-data` branch.
- `viewer/companion.js`: tabs, on-air status, the Dreadnought, find-your-card, naval ranks and medals.
- `viewer/manifest.webmanifest`, `viewer/sw.js`: install to the home screen and offline support.
- `download.html`: the app download page, served at `/download/`.
- `build-site.mjs`: builds both pages into `_site/`.
- `cloudflare.mjs`: adds Cloudflare deploy settings and security headers.

Hosting: https://voyagercommand.com on Cloudflare (Worker `voyager-site`), deployed by the **Public website** workflow whenever this folder changes. GitHub Pages is the fallback when the Cloudflare secrets are not set.
