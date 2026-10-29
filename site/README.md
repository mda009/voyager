# Voyager public website

- `viewer/index.html`: the viewer site (giveaways, winners, goals, leaderboards). It reads the live feed from the `public-data` branch.
- `download.html`: the app download page, served at `/download/`.
- `build-site.mjs`: builds both pages into `_site/`.
- `cloudflare.mjs`: adds Cloudflare deploy settings and security headers.

Hosting: https://voyagercommand.com on Cloudflare (Worker `voyager-site`), deployed by the **Public website** workflow whenever this folder changes. GitHub Pages is the fallback when the Cloudflare secrets are not set.
