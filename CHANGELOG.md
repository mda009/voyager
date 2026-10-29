# Voyager changelog

Older update notes are listed in `Voyager_Guide.html` (Update history) and kept in `docs/updates/` and `docs/updates/versus/`.

## 2.11.0 (30 October 2026)

Less clutter and one place for settings. **No Streamer.bot C# changes**, nothing to re-import, and OBS overlays are unchanged. Installed apps update themselves.

- **New Settings page** (sidebar footer, Ctrl K, or the tray menu):
  - **Connections:** change the Streamer.bot address, port and password once. Voyager saves them into your `config.js` (only those lines; your comments and other settings are kept), so every page and OBS source uses them. The password is never shown again. Test the connection from the same screen.
  - **Branding & logos:** choose whether the MDA009 and Unprofessionals logos appear on Home and in the sidebar.
  - **Public website** and **App** show publishing status, the version and your data folder.
- **Live status in the sidebar.** Every page shows whether Streamer.bot, Voyager and the public site are working, with links to Settings and System check.
- **One header per page.** The large "Voyager Control" banner with three logos is gone from control pages, so content starts higher. The Voyager emblem stays at the top of the sidebar; MDA009 and The Unprofessionals appear once on Home and as a small "Presented by" row at the bottom of the sidebar. The Entrant board display keeps its banner.
- **Help on every page.** The **?** button in each page header opens that page's setup guide in a side panel, so you don't lose your place. The sidebar's "Setup guide" is now **Help**.
- **Giveaways in one place.** The sidebar has a single **Giveaways** item. Chat & members, Ticketed and the Entrant board are tabs at the top of the giveaway pages.
- **Fleet alerts is now called Support alerts**, so it isn't confused with Voyager Versus.
- **Home** no longer repeats the sidebar: the Live dashboard and Reporting cards and the Stream tools list are removed.
- **System check** now has the sidebar like every other page.
- Pages still have their own Connection box for one-off changes; these only affect that page until it is reloaded.

## 2.10.0 (30 October 2026)

New look for Voyager Control. **No Streamer.bot C# changes**, nothing to re-import, and OBS overlays are unchanged. Installed apps update themselves.

- **Glass design.** Every control page now uses floating frosted-glass panels over soft Voyager blue and cyan glows, with the same colours and Rajdhani headings as before. Page headers float and stay visible while you scroll.
- **One sidebar everywhere.** Every control page shows the same menu, grouped into Live, Community and Setup, with the current page highlighted. Ticketed giveaway, Fleet alerts, Entrant board, Live dashboard, Reporting, System check and the Setup guide are now one click from anywhere. Each page's own tools (giveaway pools, notes, settings) stay underneath.
- **Jump anywhere (Ctrl K).** Press Ctrl K (or click "Jump to…" in the sidebar) on any page, type a few letters and press Enter to open a page, a setup guide, or a section of the current page.
- **Giveaway steps.** Giveaway control shows where you are: Set up, Entries open (chat giveaways), Draw, Confirm.
- If Windows "reduce transparency" is on, panels use solid colours instead of glass.

## 2.9.1 (29 October 2026)

Desktop app update. **No Streamer.bot C# changes**, and nothing to re-import. Installed apps update themselves.

- New tray item **View my public website in browser**. It opens your live viewer site (for example https://voyagercommand.com). If no address is set yet, it opens the Public website page instead.
- `PUBLISHING.md`: how to make `www.voyagercommand.com` work on Cloudflare (a proxied `www` record plus a Worker route), which fixes Error 522.
- The website workflow deploys with Wrangler directly and shows Cloudflare's error on the run summary if a deploy fails. It also reports which Cloudflare settings it finds, without showing their values.

## 2.9.0 (29 October 2026)

Voyager Versus host 2.9.0. **No Streamer.bot C# changes.** You do not need to recompile or re-import any action.

### How to update from 2.8.x (folder version)
1. Stop Voyager: close the START-VOYAGER window, or press Ctrl+C in it.
2. Copy your `config.js` and `stream-command-settings.js` somewhere safe. The package contains blank defaults of both.
3. Extract this package over your existing `Voyager_Giveaway` folder and allow it to replace files.
4. Put your two saved files back.
5. Run `START-VOYAGER-CONTROL.bat`. The console shows `Copied existing Voyager data from ...`, and the Data folder line shows the new location.
6. Open **System check** (new item in the sidebar) and confirm every item is green or amber.

### Your live data has moved out of the program folder
- Rankings, rewards, cooldown, per-stream entries and chat history are now saved in your user folder:
  - Windows: `%APPDATA%\Voyager\data`
  - macOS: `~/Library/Application Support/Voyager/data`
  - Linux: `~/.local/share/voyager/data`
- On first start, Voyager copies your existing `Voyager_Versus/local/data` there automatically. It never overwrites a data folder that already has files, and it leaves the old folder untouched as a backup with a `MOVED_TO_APPDATA.txt` note.
- Updating is now simply extracting the new package over the old one. Your data can no longer be overwritten, rolled back or shared by accident.
- The console window and the new System check page both show the data folder in use. `VOYAGER_DATA_DIR` still overrides it.

### Streamer.bot password protection
- All Voyager pages now share one sign-in routine.
- If Streamer.bot's WebSocket authentication is off, control pages show a warning. OBS browser sources never show it.
- New `requireAuthentication` setting in `config.js`. Set it to `true` once a password is on, and pages will refuse to connect to an unprotected Streamer.bot.

### New pages
- `Voyager_System_Check.html` checks the Voyager host, the data folder, Node.js, the Streamer.bot connection, password protection, and which Voyager actions are installed (flagging duplicates). It only reads; it never runs an action.
- `Voyager_Guide.html` gathers every setup page, grouped by feature, plus the full update history.

### Public website for viewers
- New **Public website** page in Voyager Control, with a public site your viewers can open on any phone or computer.
- The site shows:
  - active giveaways and the chat command to enter
  - recent winners (only after you confirm them)
  - the Silver, Gold and Platinum community goals
  - the points and Versus pilot leaderboards
  - Voyager Versus status
  - how the program works
- Stream statistics, user IDs, chat, security data and individual ticket balances are never published. Everything passes a strict allow-list on your PC before upload.
- Works on your own domain. For example, `voyager.theunprofessionalsgroup.com` takes a single DNS record, and Voyager generates the code to show the site as a page inside your Fourthwall store; the embedded frame sizes itself to the content.
- Ready for your own domain on Cloudflare (for example voyagercommand.com). Cloudflare offers at-cost registration and free hosting. The website workflow deploys there automatically once two secrets are added, and the site ships with security headers that only let your store embed it. Without them, it falls back to GitHub Pages.
- Choose the sections, hide viewer names if you like, and preview exactly what viewers see. Updates are published to your GitHub repository while Voyager runs. Setup is in `PUBLISHING.md`.

### Windows app
- New Voyager app for Windows. It runs Voyager itself, so there is no command window to keep open.
  - Closing the window keeps OBS overlays running; the tray icon reopens or quits it.
  - It can start when you sign in to Windows.
  - On first start it imports your existing folder (rankings, rewards, `config.js`).
  - It updates itself.
- Published from GitHub. The installer is built and self-tested on a Windows machine before every release, and a download page always offers the latest version. Setup steps are in `PUBLISHING.md`.

### Clean-up
- Removed 8 stale "- Copy" files, including an old `Voyager_Points_Engine - Copy.cs` that would have rolled back the points ledger if pasted into Streamer.bot.
- Removed an outdated duplicate of `versuscall.html` from the main folder. The live ready alert is served from `Voyager_Versus/dist`, so OBS URLs are unchanged.
- `Voyager_Versus/dist/Voyager-Versus.zip` is now rebuilt from current files every release, instead of carrying a stale 2.8.1 copy.
- The 34 update and fix notes moved from the main folder into `docs/updates/`, and the 13 Voyager Versus notes into `docs/updates/versus/`. Links on every page were updated.
- The version shown by the host now comes from `package.json`, so it cannot drift.

### For maintainers
- Fixed the launcher test, which used to start a match through the control API (the host correctly refuses that). It now types `!versus` through a stand-in Streamer.bot.
- New tests cover the data folder move, the no-overwrite rule, the desktop import, and serving `config.js` from your user folder.
- `tools/build-release.mjs` builds the release zip. It leaves out live data, copies, nested zips and secrets, and refuses to build if duplicated files have drifted apart or `config.js` contains a password.
- A GitHub Actions workflow runs every test on Windows and Linux.
