VOYAGER VERSUS v2.20.7 - DATA IN YOUR USER FOLDER

Live rankings, rewards and entries now save in %APPDATA%\Voyager\data
(copied automatically from local/data on first start). See CHANGELOG.md in
the main Voyager folder. No C# change is required. Earlier update notes
are in docs/updates/versus in the main Voyager folder.

VOYAGER VERSUS v2.8.1 - UPRIGHT CHALLENGER

Read UPDATE_2_8_1.txt for installation. The challenger faces left while
remaining upright in 3D and compatibility mode. Preserve local/data.

VOYAGER VERSUS v2.8.0 - !VERSUS REQUIRED

Read UPDATE_2_8.txt first. Every live match starts with two separate !versus
chat messages. Automatic queues and duels are disabled. Training previews
are isolated from the live OBS arena. Preserve local/data during updates.
No C# change is required for this update.

VOYAGER VERSUS v2.6 — PILOT LEADERBOARD

Saved pilot rankings now sync to Voyager Control > Live dashboard > Pilots
for display in the existing OBS leaderboard panel. Read UPDATE_2_6.txt.
Keep the original local/data folder when updating. Rewards still use v2.5.

VOYAGER VERSUS v2.5 — WINNER POINTS DELIVERY

Read UPDATE_2_5.txt first. Preserve local/data when updating.
Import dist/Voyager-Versus-Rewards-Install.sb and compile the new
Voyager Versus Rewards v2.5 action. Disable older Versus rewards actions.
Keep its dedicated blocking queue unpaused and Concurrent off.
Restart START-VOYAGER.bat, reconnect Streamer.bot, then use
Stream setup > Check rewards action.

Pending wins resume automatically after verification. Older history:
Rewards & repair > Check saved history > Apply eligible credits.
Winner 50 Voyager points; runner-up 0; 45-minute global cooldown.
One initiator and one challenger entry per viewer per stream.
Chat updates, ship models and transparent OBS overlays are retained.
Full setup: dist/START-HERE.html.
