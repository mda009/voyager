# Voyager desktop app

A Windows app that runs the Voyager host itself and shows Voyager Control in its own window. You no longer need the command window or `START-VOYAGER-CONTROL.bat`.

**Publishing:** see `PUBLISHING.md` in the main folder. GitHub builds the installer on Windows, launches it to check that it works (`--smoke-test`), and publishes it with a download page and automatic updates.

## What it does
- **Starts with Voyager running.** The host runs on `127.0.0.1:8740`, the same address your OBS browser sources already use, so no OBS changes are needed.
- **Closing the window does not stop Voyager.** Overlays keep working. The tray icon reopens it or quits it.
- **Tray menu.** Voyager Control, Versus, System check, Setup guide, data folder, `config.js`, Streamer.bot import files, start when you sign in, check for updates, quit.
- **First run.** It offers to import your existing Voyager folder: rankings, rewards and entries, plus `config.js` and `stream-command-settings.js`. Your old folder is never changed. The app then opens the System check.
- **Your files live in** `%APPDATA%\Voyager`:
  - `data\` holds live data.
  - `config.js` holds your Streamer.bot settings and password. The tray menu has "Edit config.js".
  - Uninstalling leaves this folder alone.
- **Quitting saves first.** It asks the host to save and stop, and only force-stops it after 8 seconds.
- **Reuses a running host.** If an old command window is already running Voyager, the app uses it instead of starting a second copy.
- **Link safety.** Only local Voyager pages open inside the app. Other web links open in your normal browser, and `file:` and `javascript:` links are blocked.

## Building it on your own PC (optional)
Publishing does not need this; it is for trying changes before you push them.
1. Install Node.js 22.4 or newer from https://nodejs.org/.
2. In PowerShell, in this `desktop` folder, run:
   - `npm install`
   - `npm test`
   - `npm start` (opens the app from source)
3. `npm run dist` builds `release\Voyager-Setup-<version>.exe`.
4. `npm run smoke` launches the built app and runs the same self-test as the release build.

## Streamer.bot actions
The installed app includes the `.cs` and `.sb` files. Tray > "Open Streamer.bot import files" opens that folder for importing actions as before.
