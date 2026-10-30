# Voyager changelog

Older update notes are listed in `Voyager_Guide.html` (Update history) and kept in `docs/updates/` and `docs/updates/versus/`.

## 2.14.0 (30 October 2026)

Season and missions on stream. **No Streamer.bot changes** and nothing to import.

- New OBS panel, **Voyager_Community_Panel.html**, in the same style and position options as the leaderboard panel. It shows one of:
  - **Season standings** (top 3–10, points earned this season and Versus wins),
  - **Hall of Fame** (past season champions),
  - **This week's missions** (rewards and how many viewers finished).
- Control it from **Seasons › Show on stream**: choose what to show, rows, an optional title, how long it stays up (or until hidden), and position, width, background and scroll speed. A live preview shows exactly what OBS will show.
- **Missions** has a **Show on stream** button that puts the missions panel up (or takes it down) in one click.
- Add it once in OBS: a **Browser** source, 1920 × 1080, address `http://127.0.0.1:8740/control/Voyager_Community_Panel.html` (Copy button on the Seasons page). Leave "Local file" unticked. It reads from Voyager, so Voyager must be running.

## 2.13.0 (30 October 2026)

Missions and seasons. **No Streamer.bot changes** and nothing to import: both work from data Voyager already has (Points Ledger and Voyager Versus). Installed apps update themselves.

### Missions (Community > Missions)
- Weekly missions, reset every Monday at 12:00 am on your PC. Three are ready to go, and you can edit, switch off, remove or add up to eight:
  - **Regular Pilot**: earn points on 3 different stream days (250 points),
  - **Point Collector**: earn 500 Voyager points this week (150 points),
  - **Ace of the Arena**: win a Voyager Versus battle (400 points).
- Each mission shows how many viewers have started and finished it, with progress bars for the leaders.
- **Points owed** lists everyone who finished a mission this week or last week. **Pay all owed** pays them one by one through your Points Ledger's own audited adjustment (the same preview-and-apply as Points > member controls), so every payment appears in Points history. Payments are recorded so nobody is paid twice.
- Versus missions count Twitch pilots and pay to the matching Twitch points account.

### Seasons (Community > Seasons)
- Standings rank **points earned this season** plus Versus wins. They are separate from balances: spending points never lowers a standing, and nobody loses saved points.
- Seasons last 13 weeks by default (change the name and length any time). When a season ends, automatically or with **End season now**, its top five go into the **Hall of Fame** and the next season starts from zero.

### Public website
- New **This week's missions** section (mission names, rewards and how many viewers finished; no names) and a **Season** section with the top-10 standings and the Hall of Fame.
- Both can be switched off under Public website > What is shared. Names follow **Show viewer names**.

### Notes
- Progress needs Voyager running (the app keeps the Public website publisher going in the background). Points earned while Voyager was closed are counted the next time it runs, but stream days are only seen while it runs.
- Badges and a chat message on completion are planned for a later update; for now, payments show in Points history.

## 2.12.0 (30 October 2026)

Fairer, clearer giveaways. **One Streamer.bot update:** paste the new `Voyager_Giveaway_Engine.cs` into your existing **Voyager - Giveaway Engine** action (see below). Everything else updates itself.

### How to update the Giveaway Engine (once, about 2 minutes)
1. Finish or start a new giveaway first. A giveaway that is already open keeps working, but only giveaways started after the update get a fair-draw proof.
2. In Streamer.bot, open the **Voyager - Giveaway Engine** action and double-click its **Execute C# Code** sub-action.
3. Select all the code, delete it, and paste the whole of `Voyager_Giveaway_Engine.cs` (tray menu > **Open Streamer.bot import files**).
4. Click **Compile**. It should say "Compiled successfully". Then **Save and Compile**.
5. In Voyager Control, Giveaway control should show the engine as connected. The engine version is now 9.

### Fair-draw proof
- When a pool locks (members giveaway) or entries close (chat giveaway), Voyager seals the entrant list and posts a short **fingerprint** in chat before anyone is drawn.
- Each draw uses a secret seed that can only come from that fingerprint. After a pick is confirmed or re-drawn, its seed is published.
- On voyagercommand.com, the giveaway card shows the fingerprint, and every winner has a **✓ Check** button. Viewers' own browsers repeat the draw and show each step, including the full entrant list.
- A pick waiting for confirmation is never published, so the site can't spoil the on-stream reveal. A re-drawn pick is shown as "re-drawn" without its name, though it can be worked out from the published list.
- Entrant names are only published while **Show viewer names** is on (Public website). With names hidden, viewers can still check the seeds but not the full list.
- Ticketed giveaways don't have a proof yet; that comes in the next update.

### Who can win
- Giveaway control has a new **Who can win** section with three rules, saved for every giveaway:
  - **Hasn't won recently** (default: confirmed winners in the last 30 days),
  - **Not flagged by Security** (watchlist and confirmed bot, alt, abuse, compromised or impersonation accounts),
  - **Account old enough** (off by default; uses the Twitch account dates Security has looked up).
- It lists exactly who will be left out and why before you lock the pool. They are added to the giveaway's exclusions, so they can't be drawn and can't enter chat giveaways.
- Ticketed giveaways keep their own Block controls for now.

### Chat commands page
- New **Chat commands** page (Setup in the sidebar, or Ctrl K) lists every Streamer.bot command, which Voyager feature it belongs to, and its platforms.
- It warns about **duplicates** (one word used by two commands) and **look-alikes** such as `!ticket` and `!tickets`.
- Optional: import the new **Voyager - Command Manager** action (`Voyager_Command_Manager.cs`, one Execute C# Code sub-action, no triggers) to switch commands on and off from this page. Without it the page is read-only.
- Cooldowns and permissions are still changed in Streamer.bot.

### For maintainers
- The Streamer.bot actions are now compiled on every push (against a stand-in for Streamer.bot) and the Giveaway Engine's fair draw is run end to end. The website verifier is tested with the same numbers.

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
