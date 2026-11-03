# Voyager changelog

Older update notes are listed in `Voyager_Guide.html` (Update history) and kept in `docs/updates/` and `docs/updates/versus/`.

## 2.20.47 (3 November 2026)

**Website: the real back of the card, with the stream streak.** On voyagercommand.com › My card, the Back is now the stream card's own Fleet Record side, drawn by the same template in the member's tier (Blue, Silver, Gold or Platinum, with the Ruby VIP / Emerald ribbons where they apply): Dreadnought, Voyager Versus, Missions & Seasons, and Crew & Community. Crew & Community now leads with **STREAM STREAK** — streams attended in a row on Twitch, with the best ever and total streams attended — on stream and on the site. A third side, **Medals**, shows the card's medal wall; what is still to earn is listed under it. Members who typed !voyager private keep the streak and months subscribed hidden; with the site's Activity switch off they show as Hidden. The card data in crew.json now carries the back (`back`) and the VIP / Emerald flags; the site falls back to a short record until the next publish.

## 2.20.46 (3 November 2026)

**Fleet alerts: original hero ship replaces the last third-party model.** The Fleet alerts overlay's hero is now the **Voyager Sovereign-class carrier**, an original design built from primitives when the overlay loads (`fleet-hero.mjs`): a chamfered main hull, wide hangar sponsons with lit flight decks, raised engine nacelles, a bridge tower, four stern engines and a dorsal battery deck. The RSI Polaris data (`fleet-assets/polaris-data.js`, 11.6 MB) is removed, so the install is smaller and the overlay loads faster. Hull fittings, breach sites and navigation lights now find the hull by surface probe instead of baked coordinates, and the Build, Launch, Fleet, Battle and Repair sequences, dock, cameras and weapons are unchanged. Together with 2.20.45, no Star Citizen / CIG geometry remains anywhere in Voyager. Visual build 1.14; setup page and credits updated.

## 2.20.45 (3 November 2026)

**Original Voyager fighters replace the third-party ship meshes.** Voyager Versus now flies three ships of Voyager's own design, built from primitives when the arena loads (`voyager-ships.mjs`): **VX-01 Dart** (light interceptor: slim hull, swept delta wings, wingtip guns, twin engines, V-tail), **VX-02 Bulwark** (heavy gunship: broad armoured hull, straight wings, four engines, chin cannons, dorsal turret) and **VX-03 Wraith** (stealth strike fighter: faceted wedge, blended wings, canted fins, slot exhaust). The Star Citizen holoviewer meshes, the CTM decoder and the old ship icons are removed; the hangar portraits, hangar copy, fleet preview page and credits are updated. Loadouts, weapons, effects and chat commands are unchanged (`!ship interceptor|sentinel|phantom`).

## 2.20.44 (3 November 2026)

**Dreadnought speed goals: Legendary and Hero kills with a points bonus.** Destroy the Dreadnought within **1 minute** of the battle starting and every pilot who fought earns the new **Legendary Strike** medal; within **2 minutes**, **Hero of the Fleet** (a Legendary kill counts for both). Either adds a **10% bonus** to each fighting pilot's victory points (100 → 110), shown in Missions › Points owed with the kill time. The overlay counts down the time left to the next goal under the clock during the fight and stamps the result card ("⚡ LEGENDARY STRIKE · DESTROYED IN 0:48"); chat gets the same announcement. Both medals have four grades (1 / 5 / 15 / 40 kills) and appear on the Medals overlay, membership cards and !medals. Times and bonus are in Voyager Dreadnought › Settings (0 turns a goal off).

## 2.20.43 (3 November 2026)

**Connect chat from the home page.** The "Connect chat" button from Voyager Versus › Stream setup now also sits at the top of Home, next to Open Voyager Versus, with a live status dot. One click connects Voyager's host to Streamer.bot using the address and password saved in Settings (`config.js`), read on the host, so there is nothing to type and the password never reaches the page; Disconnect appears while connected. Host control `type: "connect_saved"`.

## 2.20.42 (3 November 2026)

**Streamer.bot actions page fixes.** The "Play the Silver/Gold upgrade animation" presets are gone: in your Streamer.bot those are sub-action groups inside `THRESHOLD POINT CHECK` and the purchase actions, not actions of their own, so they could never run; "Run the giveaway threshold check" is the way to play them. When Voyager hasn't heard from the Goal FX overlay, the page now says what to do (OBS keeps the overlay page it loaded before an update: right-click the source › Refresh cache of current page). The Goal FX overlay reloads itself when it sees a new Voyager version, so that step isn't needed after this one.

## 2.20.41 (3 November 2026)

**Run your Streamer.bot actions from Voyager.** New page *Setup › Streamer.bot actions* (`Voyager_Streamerbot.html`). It lists every enabled action Streamer.bot reports, grouped as in Streamer.bot, each with a Run button, and a set of Voyager presets with the right arguments filled in: read the goal percentages from OBS, run the giveaway threshold check, play the Silver or Gold upgrade animation, scan the tier groups or broadcast a ledger snapshot (`Voyager - Points Ledger`), export medal data now, post a check message to chat through the Medals, Membership Card or Dreadnought action (all platforms or one), and send a test support alert to OBS (stage, name, amount, months, platform). Runs go through Voyager's own Streamer.bot connection and are the same as pressing Run in Streamer.bot (no test flag). A log shows the last 40 runs with the outcome. Host routes: `GET /api/streamerbot`, `POST /api/streamerbot/run` (local token).

**Goal FX celebrations from Voyager.** The same page plays the Silver, Gold or Platinum celebration on the `Voyager Goal FX` overlay and can re-arm it, without touching any points. The overlay now also polls Voyager (`/api/goalfx/overlay`, every 2 s, same-origin when opened from the Voyager host, otherwise `http://127.0.0.1:8740`, `?voyager=port` to change) and the page shows whether the overlay is open in OBS.

## 2.20.40 (3 November 2026)

**Goal FX 2.0 in the glass design, lifting off the goals strip.** The giveaway-goal celebration now ships with Voyager as `Voyager_Goal_FX.html` (point your existing "Voyager Goal FX" browser source at it): the tier's glass tile lifts off the goals strip (`?from=x,y,spread` says where the strip sits), flies to the centre and opens into the tier emblem, GOAL REACHED in the tier metal, rings, sparks and confetti, then folds back. Same Streamer.bot reader and upgrade hold as Goal FX v1.3. `goal-fx/Voyager_OBS_Bridge.cs` is the reader with the Platinum target corrected to 200,000 (was 220,000): paste it into Voyager - Read OBS Percentages. Setup: Voyager guide › Goal FX.

**Doubled sounds removed.** The 2.20.37 upgrade sound on the tier-up card and the 2.20.38 goals-strip celebration and sound are gone: Streamer.bot's upgrade animation groups already play the alert, and Goal FX celebrates met goals.

## 2.20.39 (3 November 2026)

**Goals strip celebration off by default.** The existing full-screen Voyager Goal FX source (Goal FX package v1.3, with its Streamer.bot reader) already celebrates a met giveaway goal, so the strip's own 2.20.38 goal-met animation and sound now only run with `?goalfx=1` on the source address. Nothing else changes.

## 2.20.38 (3 November 2026)

**Giveaway trigger met: animation and sound.** When Silver, Gold or Platinum community points cross their threshold live, the goals strip (`Voyager_Bucket_Overlay.html`) comes on screen, that tier's tile flares with a shockwave and sparks, a GOAL MET · GIVEAWAY UNLOCKED · STELLAR SUNDAY stamp slams in, and the upgrade alert sound plays; the strip stays up until the sound ends. `?sound=0` silences it, `?volume=60` sets the level. Only a crossing seen live fires it. The design preview has a "Gold goal met" button.

## 2.20.37 (3 November 2026)

**Upgrade alert sound.** When someone upgrades with `!upgrade` and the tier-up card plays on `card.html`, the supplied alert (`sounds/tierup.mp3`, 24 s) plays with it and the new card stays on screen until the sound has finished. On/off and volume in Membership cards (defaults on, 80); the control page's live view is muted so you only hear it once, with a "Play the alert sound here" button to check it. The sound comes out of the card.html browser source in OBS: tick "Control audio via OBS" on that source if you want it in your mixer.

## 2.20.36 (2 November 2026)

**Gifted subs: 100 points each.** The card ceremony after a gift-sub Fleet alert now shows +100 points per gifted sub by default (Membership cards › After Fleet alerts; saved settings keep whatever you set), and the member manual's points table says 100 per gifted sub. The points themselves are paid by the Currency System in Streamer.bot: set its Gift Sub amount to 100 there.

## 2.20.35 (2 November 2026)

**Reset for a new stream (Community › Chat engagement › Daily muster).** A button that resets the per-stream counters on the spot: everyone can `!report` again, squadron chat points start counting again for this stream, arrival cards can play again and Captain's Log allowances return. Points already earned or owed are not touched. The page also shows when the current stream started. Voyager still resets on its own when Twitch goes live or after 4 hours without chat.

## 2.20.34 (2 November 2026)

**Kick and YouTube cards on the website.** The site's card lookup (`crew.json`) carried only the top 2,000 members by lifetime points, so a viewer's Kick or YouTube account, which usually has far fewer points than their Twitch one, often fell below the cut-off and had no card to find. The file now always includes every Kick and YouTube member and every Silver, Gold or Platinum member in addition to the top 2,000. The on-stream `!voyager` card was never affected.

## 2.20.33 (2 November 2026)

**Partner logo rotation (new OBS source).** `Voyager_Partner_Logos.html` shows the Voyager, MDA009, The Unprofessionals, Tobii, CG and Thrustmaster logos one at a time in the bottom-right corner: each fades and floats in, holds for 30 seconds with a soft light sweep, fades out, then 10 seconds of nothing before the next, looping. Transparent, needs no connection. Options on the address: `show`, `gap`, `pos` (br/bl/tr/tl/c), `size`, `logos` (choose and order), `dark=0` for the black Thrustmaster mark. Logos are in `partner-logos/` as trimmed transparent PNGs (the Thrustmaster wordmark had its white background removed and is supplied in white and black). Setup: Voyager guide › Partner logos.

## 2.20.32 (2 November 2026)

**Fleet alerts visual 1.13: space lighting.** The follow, sub, gift, resub and bits sequences are now lit like orbital footage. The hull reflects a sun, a blue planet and stars instead of a studio room; one hard sun gives real shadow sides with blue planetshine underneath; the Polaris carries navigation lights (red port, green starboard, white strobe, tail and nose) once complete; the dock is toned to industrial grey with hazard amber on the clamps; and a soft starfield glow sits behind the ship while an alert plays, fading with it. Draw calls and triangles are unchanged and there is no post-processing, so performance is the same as 1.12. Refresh the `Voyager_Fleet_Overlay.html` source cache; add `?look=studio` to the source address to keep the old look. The release workflow now bundles the renderer from source.

## 2.20.31 (2 November 2026)

**Goals strip on a timer.** The giveaway goals strip now appears every 5 minutes for 30 seconds: the heading fades in, the Silver, Gold and Platinum tiles fly in one after another, the bars fill from empty, and it folds away again. The first appearance waits for live figures. Add `?every=300&show=30` (seconds) to the Browser Source address to change the timing, or `?always=1` to keep it on screen as before. The design preview has a "Play the 30-second appearance" button.

## 2.20.30 (2 November 2026)

**Giveaway goals strip in the glass design.** `Voyager_Bucket_Overlay.html` (Silver, Gold and Platinum thresholds) loses its outer bordered box. The three goals are now separate glass tiles with cut corners, the same surface as the membership card, with metal percentages and bars in each tier's metal, the tier line along the top and a transparent strip around them. The heading row keeps the Voyager brand, your logos and the connection status without a frame. Same 3840 x 480 source, same data; refresh the browser source cache.

## 2.20.29 (2 November 2026)

**Emerald Elite ribbon.** Members of your moderators' group in Streamer.bot get a green "★ EMERALD ELITE ★" ribbon on their membership card, on every side, on stream and on voyagercommand.com. Someone who is both VIP and Emerald gets one ribbon that runs red into green ("RUBY VIP · EMERALD"), so nothing covers the card title. **Needs the updated `Voyager_Points_Engine.cs`** in the Voyager - Points Ledger action (see the Points setup guide): the ledger now also reads the first group it finds named EMERALD GROUP, MODS GROUP, MOD GROUP, MODS, MODERATORS, MODERATOR GROUP or MODERATORS GROUP. Previews: Membership cards › Emerald Elite ribbon, VIP + Emerald.

## 2.20.28 (2 November 2026)

**Ruby VIP ribbon.** Members currently in your Streamer.bot VIP GROUP get a red "★ RUBY VIP ★" ribbon across the top-right corner of their membership card, on the front, the stats side and the medal wall, on stream and on voyagercommand.com. It follows the group: when VIP status is removed the ribbon goes. The VIP flag travels with the Points Ledger members the Public website page already sends to Voyager (keep that page open as before). Preview: Membership cards › Ruby VIP ribbon.

## 2.20.27 (2 November 2026)

**Chat engagement uses the same round emblems.** The arrival, `!report`, squadron enlistment and Captain's Log cards on `engage.html` now carry the medal-style Voyager medallion (ticked rim, space disc, star) in the event's colours, the Bridge Quiz panel has one too, and each wing in the squadron panel gets a small one in its colour.

## 2.20.26 (2 November 2026)

**Round medals, modelled on the Voyager roundel.** Every medal symbol is now a round medallion in the style of the Voyager emblem: a lettered metal rim in the grade's metal (bronze, silver, gold, legend), a dark space disc with a horizon glow, the four-point Voyager star at the top and the medal's own mark in the centre. The same mark is used everywhere a medal appears: the membership card's medal row and medal wall, the on-stream medal announcements (`medals.html`), the companion site (Medals tab, Hall of Honour, card back) and the member manual.

## 2.20.25 (2 November 2026)

**Chat replies stay on their platform.** The `!report` muster line is now posted on the platform the reports came from (one line per platform; a Kick report is announced on Kick only), and `!squadron` / `!log` replies go to the viewer's own platform. The Bridge Quiz and Comms Relay still post everywhere. **Needs the updated `Voyager_Medals.cs`** pasted into the Voyager - Medals action (Compile, Save); until then lines go to every platform as before. See the Medals setup guide.

## 2.20.24 (2 November 2026)

**!report pays at most 2 points.** Accounts are per platform (a Twitch, Kick and YouTube account never merge), so one person on all three can muster three times a stream. The reward is now capped at 2 points per report (Chat engagement › Daily muster, 0–2); a saved reward above that is brought down to 2 on start. The hint on that page now says where muster points are paid from: Missions › Points owed › Pay all. Member manual updated to match.

## 2.20.23 (2 November 2026)

**Cards after Fleet alerts: new followers are presented, and support lands on members' cards live (Community › Membership cards).**

Voyager now listens to the "Voyager - Fleet Alerts" queue. When a follow, sub, resub, gift-sub or bits alert plays its Fleet animation, a card follows on the same `card.html` source once the animation (and any alerts queued right behind it) has finished:

- **New follower.** A gold WELCOME title card, then the follower's brand-new Blue Explorer card is presented: NEW RECRUIT, member since today, and the follow reward counting onto it.
- **Subs, resubs, gift subs and bits.** The member's card opens, a data-link sweep crosses it and a ★ FLEET SUPPORT ★ banner names the event (RESUBSCRIBED · 15 MONTHS, 5 GIFT SUBS, 500 BITS). The banner clears and the tiles that changed flash and count to their new values with floating tags (+1 MONTH, +250 POINTS, +2 HONOUR), a "+points" headline plays, and a medal the support just earned or upgraded (Loyal Subscriber, Fleet Gifter, Gift Bomb, Power Supply) slams onto the medal row with NEW MEDAL / UPGRADED.
- **Settings:** switch the follower card and the support update on or off, and set the points each event pays (defaults 50 / 250 / 5 / 20 per gift / 1 per Bit; 0 leaves points out). Months, gifts and medals come from the alert itself.
- **Previews** for each of the five ceremonies in Membership cards; Fleet Control's "Send test to OBS" also plays its card.
- Raids have no supporter card. Alerts that ended more than 30 seconds before Voyager heard of them are skipped.

Also: the tier-up and promotion banners now fade as intended, and long single-word medal names fit under their tiles.

## 2.20.22 (1 November 2026)

**Chat engagement: six new ways to get chat talking (Community › Chat engagement).**

1. **Comms Relay.** During a Dreadnought fight, plain chat charges a relay (meter under the hull bar). At 50 messages the whole fleet fires a barrage for 2% of the hull. One message per viewer every 5 seconds counts, on Twitch, Kick and YouTube.
2. **Daily muster · `!report`.** Once a stream, viewers report for duty: an on-stream card, one grouped chat line every 20 seconds, a streak for streams in a row, and 10 Voyager points (0–50).
3. **Bridge Quiz.** Ask a question (or set one every N minutes). The first correct answer in chat wins 25 points (0–50). Ten starter questions about space and Voyager; add your own, with several accepted answers each. Shown on stream with a countdown.
4. **Squadrons · `!squadron red | gold | blue`.** A weekly squadron war: chat (up to 60 messages a stream), missions finished, Dreadnought damage and Versus wins score for your squadron. Viewers can switch once every 30 days. Show the standings on stream for 60 seconds or until hidden; the public site shows them under Boards.
5. **Arrival cards.** The first time a Silver, Gold or Platinum member (your choice), or anyone promoted since last time, chats each stream, a "now on the bridge" card slides in with their tier and naval rank.
6. **Captain's Log · `!log <moment>`.** Viewers log moments during the stream (3 each, no links). Pin the best in Voyager Control; pinned entries from your latest stream become the Captain's Log on voyagercommand.com.

- **New OBS source:** one Browser source at `http://127.0.0.1:8740/engage.html` (1920 × 1080) for arrival, muster, enlistment and log cards, the quiz and the squadron panel.
- Muster and quiz points are listed in Missions › Points owed and paid from there, like mission rewards. Chat replies go out through the Voyager - Medals action.
- Public website: new switches for **Squadron war** and **Captain's Log**; new copy buttons for `!report`, `!squadron` and `!log`.
- Fix: a chat reply while Streamer.bot was offline could stop the Voyager host. Replies are now skipped quietly instead.

## 2.20.21 (1 November 2026)

**Missions and medals now work together, with mission rewards capped at 50 points.**

- **Every mission works toward a medal.** Missions › each mission shows the medal it advances (Regular Pilot, Point Collector, Versus Ace, Loyal Subscriber, Fleet Gifter, Sub Streak…), and finishing any mission still counts toward Mission Runner and Full Spectrum.
- **New medal mission types**, each counting this week's progress on the same thing a medal tracks: watch hours live (Time Watched), chat messages (new **Comms Officer** medal), streams in a row (Unbreakable), Dreadnought fights and victories (Dreadnought Slayer), Dreadnought damage and MVPs (Top Gun), and torpedoes (Torpedo Run).
- **Mission ideas:** 13 ready-made missions to add with one click: Night Shift, Comms Check, Hold the Line, Boarding Party, Dreadnought Down, Heavy Hitter, Top Gun, Torpedo Run, Arena Rookie, Shore Leave Cancelled, Quartermaster, Care Package and Re-enlist (up to 8 missions run at once).
- **50-point cap:** each mission pays at most 50 Voyager points. Existing missions above 50 were lowered to 50 (unpaid rewards from this and last week now pay 50; anything already paid is unchanged). Match your Currency System also stops at 50 for missions; season goals keep their full rewards.
- **New medal: Comms Officer** (100 / 1,000 / 5,000 / 20,000 chat messages), counted from 2.20.19.
- The public site's mission cards say which medal each one works toward, and each medal lists this week's matching mission. The on-stream missions panel shows the new mission types.

## 2.20.20 (1 November 2026)

**My card on voyagercommand.com: the front is the card from stream, the back has everything else.**

- **Front:** the exact membership card viewers see on stream when they type `!voyager`. It uses the same card design and is built by the same code, so the tier, callsign, member ID, member since, points, lifetime points, time watched, Versus, season, Dreadnought, months subscribed, Honour, six medals, naval rank and next-tier bar all match. On phones, **⤢ Full screen** shows it sideways at full size.
- **Back:** only what the front doesn't show: Dreadnought victories, MVPs and damage, Versus battles and best streak, missions, season points and podiums, giveaways won, streams attended and best watch streak, chat messages, gifted subs, best sub streak, days with the crew, and the full medal wall with the medals still to earn.
- Tap the card (or use Front / Back) to flip it.
- With **Activity on cards** off, the front shows "Hidden" for time watched and months subscribed. `!voyager private` shows "Private", as on stream.
- Update the app so it publishes the card fronts; until then My card shows the back only with a note.

## 2.20.19 (1 November 2026)

**More on the back of each card at voyagercommand.com › My card.**

- New **Activity** section on the back: hours watched and streams attended, watch streak (and best ever), chat messages, months subscribed (and best sub streak), gifted subs, Voyager points balance, days with the crew and best Versus win streak — alongside the Dreadnought, Versus record, missions, season and giveaways already there.
- **Chat messages** are now counted by Voyager for Twitch, Kick and YouTube (from this version on, so everyone starts at 0).
- Members who type **!voyager private** keep their hours watched and months subscribed hidden on the site, as on their card. Bits and other money are never published.
- New switch in Public website › What is shared: **Activity on cards** (on). Turn it off to publish only the service record and medals.

## 2.20.18 (1 November 2026)

**Find your card shows both sides of the membership card.**

- On voyagercommand.com › My card, the card now has a **front** and a **back**. Tap the card (or use the Front / Back buttons) and it flips over in 3D.
- **Front:** tier, name, all-time place and lifetime points, naval rank with insignia and progress to the next rank, and the top six medals with Honour.
- **Back (service record):** Honour, Dreadnought (fights, victories, MVPs, damage), Voyager Versus record and win rate, missions completed, season place and points, giveaways won and when they joined the crew, then the full medal wall with the medals still to earn.
- The back only uses games, missions, seasons and wins (already shown on stream); watch time, subs, gifts and Bits are never published.
- A link straight to `voyagercommand.com/#crew` now opens My card.
- Update the app so it publishes the service record; until then the back shows the medal wall only.

## 2.20.17 (1 November 2026)

**The public website is now a stream companion app (voyagercommand.com).**

- **Tabs:** Live, My card, Medals, Boards, Winners and Guide. On phones they sit along the bottom like an app; the site can be installed to the home screen and opens instantly, even offline (showing the last update).
- **Live:** an on-air badge (from chat activity), watch links, one-tap copy buttons for `!voyager`, `!medals`, `!join`, `!fire`, `!enter` and `!entergiveaway`, the **Dreadnought** (boarding countdown, hull bar, pilots, time left and top pilots during a fight; results and recent fights afterwards), giveaways, Voyager Versus and this week's missions.
- **My card:** viewers search their name to see their membership tier, naval rank with insignia and progress to the next rank, all-time place, lifetime points and every medal (earned in their grade's colour, the rest locked). The page remembers who they are next time.
- **Medals:** the Hall of Honour, the latest medals awarded, and every medal with how to earn it and its four grade targets. Secret medals keep their secret.
- **Ranks:** the twelve-rank ladder with how many crew hold each, the senior officers and recent promotions.
- **Privacy:** five new switches in Public website › What is shared (on air, Dreadnought, ranks, medals, crew lookup). The crew lookup (`crew.json`, top 2,000 by lifetime points, refreshed every 10 minutes) is only published with Show viewer names on. Never published: watch time (only medal grades, as on the cards), ticket balances, user IDs or logins.
- Update the app so it publishes the new information; the website itself is already live.

## 2.20.16 (1 November 2026)

**More exciting membership card reveals, promotions and tier-ups.**

- **Every card (`!voyager`):** a warp-speed starburst, a beam of light that opens into the card like a hologram, stats that count up, medals that pop in one by one with sparks in their colour, and the naval rank stamping on with a gold shockwave. The card then floats gently with a light sweep across the glass, and folds back into a beam when it leaves.
- **Promotions:** a gold **PROMOTED** title card slams in with the member's name and old → new rank. The card opens showing their old insignia, which charges up and flips to the new one with a shockwave, a fountain of gold embers, a screen shake, the rank name decoding to the new title and gold confetti, before the promotion banner appears.
- **Tier-ups (Silver, Gold, Platinum):** the old card charges with sparks, then explodes in the new tier's colour with a screen shake before the new card opens, followed by confetti.
- No Streamer.bot changes. Refresh the membership card browser source in OBS after updating. Use the preview buttons on the Membership cards and Ranks pages to see each one.

## 2.20.15 (1 November 2026)

**Membership cards show each viewer's medals and naval rank clearly.**

- **Medals:** the medal row on the front of the card now shows each earned medal in its grade's metal (bronze, silver, gold or prismatic Legend), with a clearer icon and the medal's name underneath. Up to six are shown, best first. A viewer with none yet sees how to start earning them.
- **Rank:** the naval rank now has its own panel under the tier emblem: "NAVAL RANK", a larger sleeve-lace insignia, the rank name, and their all-time place and lifetime points.
- **Fairer ranks:** lifetime points are now never less than the points someone currently holds. Before, points earned before Voyager started counting were missed, so long-time members showed a lower rank than they'd earned.
- No Streamer.bot changes. Refresh the membership card browser source in OBS after updating.

## 2.20.14 (1 November 2026)

**Ticketed giveaway: show and hide the on-screen panel any time, and it gets out of the way of the winner reveal.**

- **Show ticket panel** and **Hide ticket panel** in Ticket controls now work at any time, with or without a ticketed giveaway running. Before, both were greyed out until a giveaway existed, so a panel already on screen couldn't be hidden. Hide takes the shared panel off screen whatever it is showing.
- **Draw winner**, **Reroll** and **Confirm** no longer pop the panel onto the stream. They hide it instead, and the countdown, buildup, wheel and winner play on their own. Press Show ticket panel to bring the list back afterwards.
- While a reveal plays in another source (such as the main Giveaway overlay), the Leaderboard panel keeps its list off screen so it never sits over the animation.
- No Streamer.bot changes. Refresh the Leaderboard panel browser source in OBS after updating.

## 2.20.13 (1 November 2026)

**New Ranks page in Voyager Control (Community › Ranks).**

- **The ladder:** all twelve Royal Australian Navy officer ranks with their sleeve-lace insignia, the lifetime points each one needs, the leaderboard place the flag ranks need, and how many crew hold each rank. Click a rank to list its holders.
- **Fleet roster:** everyone with lifetime Voyager points, by all-time place, with their rank, membership tier, platform and a progress bar to their next rank ("28,000 to Lieutenant Commander"). Search by name and filter by rank or platform.
- **At a glance:** ranked crew, flag officers (Commodore and above), promotions in the last 7 days and the senior officer.
- **Recent promotions:** every promotion is now logged, including those below the on-stream threshold.
- **Settings:** the rank settings moved here from Membership cards (show ranks, chat announcements, which promotions show on stream, points for each rank), with a reset to the default points and a promotion card preview.
- No Streamer.bot or OBS changes.

## 2.20.12 (1 November 2026)

**The Dreadnought is easier to defeat.**

- Less hull: 1,000 plus 150 per pilot (was 4,000 plus 350), and 75 per late joiner (was 150). With 10 pilots it now has 2,500 hull instead of 7,500.
- `!fire` hits harder and more often: 15–30 damage (was 12–22) every 3 seconds (was 4). Critical hits still triple it.
- Four minutes on the clock (was three).
- Its return fire knocks pilots out for 6 seconds (was 10), every 20 seconds (was 15; 10 when enraged, was 8).
- Cheers, gifted subs, the shield at 50% and victory points are unchanged.
- If your saved Dreadnought settings were still on the old defaults they move to the new ones automatically; any value you changed yourself is kept. Everything can still be tuned on the Dreadnought page.
- No Streamer.bot or OBS changes.

## 2.20.11 (1 November 2026)

**Ticketed giveaway reveals now always play on stream, in exactly one OBS source.**

- The shared **Leaderboard panel** (`Voyager_Leaderboard_Panel.html`, the source the Ticket control page uses) now plays a ticketed draw's countdown, buildup, 30-second wheel and winner even when the panel is hidden or showing a different leaderboard. Before, the reveal only played while the ticket list itself was on screen, so a draw made after hiding the panel or switching leaderboards showed the winner in Ticket controls but nothing on stream.
- One rule now decides which source plays each reveal: the main **Giveaway overlay** first, then the **Leaderboard panel**, then the separate **Ticket overlay**. A source only steps aside when a higher one is on screen and actually playing that same reveal; if it doesn't start within 2.5 seconds, the next one plays it. This replaces the 2.20.10 hand-off, which could silence the Ticket overlay while the main overlay sat in a scene that wasn't live.
- No Streamer.bot changes. Refresh the Giveaway overlay, Leaderboard panel and Ticket overlay browser sources in OBS after updating.

## 2.20.10 (1 November 2026)

**Every giveaway reveal now plays the same way, from the same OBS source.**

- The main **Giveaway overlay** (`Voyager_Giveaway_Overlay.html`, the one that plays impromptu and member giveaways) now also plays **ticketed giveaway** reveals: the same 10-second countdown, buildup, 30-second wheel (segments sized by tickets), winner reveal, claim timer and congratulations. Before, a ticketed draw only showed in the separate Ticket overlay source, so with just the main overlay in OBS nothing appeared.
- If you also keep the **Ticket overlay** in OBS for its ticket leaderboard panel, it now steps aside during reveals when the main overlay is running, so the animation and sound never play twice. On its own it still plays the reveal as before.
- Add `?tickets=0` to the main overlay's address if you ever want it to ignore ticketed giveaways.
- No Streamer.bot changes. Refresh both giveaway browser sources in OBS after updating.

## 2.20.9 (31 October 2026)

**Fix: the giveaway wheel didn't appear during the winner reveal.** Since 2.16, impromptu giveaways keep recent winners in the pool ("can enter, can't be drawn"). The Giveaway Engine leaves them out of the draw, but the wheel still counted them, so its pool no longer matched the saved draw and it stayed hidden for safety. The wheel now leaves those entrants off too, so it matches the draw exactly and spins to the real winner. Member and ticketed giveaways were not affected. No Streamer.bot changes; refresh the giveaway browser source in OBS after updating.

## 2.20.8 (31 October 2026)

**Kick (and YouTube) chat now reach Voyager directly.**

- Voyager used to hear only Twitch chat itself; Kick and YouTube only worked if a Streamer.bot command trigger forwarded them. It now also subscribes to Streamer.bot's **Kick ChatMessage** and **YouTube Message** events, so `!join`, `!fire`, `!voyager` (with `stats`, `badges`, `title`, `private`) and `!medals` work from Kick and YouTube chat even without the command triggers. Voyager Versus stays Twitch-only.
- A message that also arrives through a command trigger is only acted on once.
- The Dreadnought and Membership cards checklists show whether Kick/YouTube chat has been seen, and say so if Streamer.bot refuses those events (older Streamer.bot).
- Chat replies to Kick still go out through Streamer.bot's Kick connection (Platforms › Kick must be connected with a bot or broadcaster account).

## 2.20.7 (31 October 2026)

**Dreadnought: smoother animation and a pay-out button.**

- **No more stutter from resolution pumping.** The 60 fps governor used to resize every render target whenever a second ran a little slow, and it mistook OBS's 30 fps browser sources for a slow PC. It now learns the frame cap (30 or 60), only lowers resolution after 2 slow seconds in a row, only raises it after 15 good ones, never changes more than once every 10 seconds, and leaves the first 10 seconds alone while the scene settles.
- **Lighter HUD.** The pilot leaderboard, hull text, clock and labels are only rewritten when they change (they were rebuilt 60 times a second), and the server clock is smoothed so countdowns don't jitter.
- **Pay victory points** on the Voyager Dreadnought page: after a victory it lists every pilot who fought and pays them all with one button, through the Points Ledger's audited adjustment (same as Missions › Points owed, which stays in step). Failed payments show why and can be retried; paid pilots are never paid twice.
- OBS: refresh the Dreadnought browser source after updating.

## 2.20.6 (31 October 2026)

- **Membership card: only the card is on screen.** The OBS overlay is cut to the card's own cut-corner outline, so the space scene and glow around it are gone. Add `?frame=full` to the address to bring the surrounding scene back.
- The Voyager points tile reads "Balance for !upgrade" on one line.

## 2.20.5 (31 October 2026)

**Clearer Streamer.bot checklists** on the Voyager Dreadnought and Membership cards pages, so you can see exactly which link is missing:

- Is Voyager connected to Streamer.bot; is there exactly one **enabled** action with the exact name (or is it missing, disabled or duplicated); has Voyager seen Twitch chat; have events arrived from the action.
- **Send test message** on the Dreadnought page runs the action and posts a line in chat, proving it is installed, compiled and reachable.
- The trigger reminder is no longer shown with a tick, since Voyager can't check triggers.
- A missing action is re-checked every 20 seconds instead of every 5 minutes, so the checklist updates soon after you add it.

## 2.20.4 (31 October 2026)

**Fix: `!voyager` didn't show the card when the Streamer.bot command wasn't reaching the new action.**

- Voyager now reads Twitch `!voyager` straight from chat and asks the **Voyager - Membership Card** action for the viewer's tier and points. If that action isn't installed, isn't found or doesn't answer within 3 seconds, Voyager shows the card from its own Points Ledger data (tier, balance, leaderboard place). A request that arrives both ways shows once.
- The Public website publisher now passes each member's tier to Voyager for that.
- YouTube and Kick `!voyager` still go through the Streamer.bot command trigger.

## 2.20.3 (31 October 2026)

**Dreadnought fixes.**

- **Black box over the Dreadnought as it flies in.** One invalid (NaN/infinite) pixel from the ship's lighting could spread through the bloom passes into a large black rectangle. The bloom, final image and ambient-occlusion passes now discard invalid values (also in Voyager Versus). The ship's 2,200 hull details and 760 windows no longer get culled while it is partly off screen.
- **!join (and !fire) from Twitch chat work even without the Streamer.bot command trigger**: Voyager reads them straight from chat while a fight is running. The action's copy of the same message is ignored, so nobody boards twice or fires double.
- `Voyager_Dreadnought.cs`, `Voyager_Medals.cs` and `Voyager_Membership_Card.cs` work out the platform from `userType` when `commandSource` is missing, and a viewer without a user ID can still board (keyed by login). Paste the new Dreadnought file into its action and Save and Compile.
- OBS: refresh the Dreadnought browser source (or tick "Refresh browser when scene becomes active") so it loads the new version.

## 2.20.2 (31 October 2026)

**Fix: Voyager - Membership Card did not compile in Streamer.bot** (CS0234 "Linq does not exist in the namespace System", CS1061 / CS1955). `Voyager_Membership_Card.cs` (v1.1) and `Voyager_Medals.cs` (v1.2) no longer use System.Linq at all, so they compile with Streamer.bot's default references whatever the action's References tab holds. Paste each new file into its action's Execute C# Code and Save and Compile. The reference check now also rejects `using System.Linq` in these actions.

## 2.20.1 (31 October 2026)

**Fix: Voyager - Medals did not compile in Streamer.bot** (CS0012 "ITypedList / IBindingList / INotifyCollectionChanged ... add a reference to System"). `Voyager_Medals.cs` is now v1.1: it reads Fleet Alerts history and giveaway winners with plain loops, so it compiles with Streamer.bot's default references. Paste the new file into the action's Execute C# Code and Save and Compile. A new check stops this from coming back in the Medals, Membership Card and Dreadnought actions.

## 2.20.0 (31 October 2026)

**Naval ranks** on the membership card. **No new Streamer.bot steps** beyond 2.19's Voyager - Membership Card. Updating from 2.16? Follow `UPDATE_2.20_SETUP.html` (Help › Updating to 2.20), which covers 2.17 to 2.20 in one pass.

- Twelve Royal Australian Navy officer ranks earned by **lifetime Voyager points** (spending on `!upgrade` never lowers a rank), ranked on the all-time leaderboard of those points: Midshipman, Acting Sub-Lieutenant (5,000), Sub-Lieutenant (15,000), Lieutenant (40,000), Lieutenant Commander (80,000), Commander (150,000), Captain (300,000), Commodore (600,000), Rear Admiral (1,000,000), Vice Admiral (2,000,000 and top 10), Admiral (3,500,000 and top 3), **Admiral of the Fleet (10,000,000 and #1 all-time, one holder)**.
- The card shows the sleeve-lace insignia, rank and "#6 ALL-TIME · 214,560 POINTS EARNED" under the tier title, and a **Lifetime points** tile with the points to the next rank. Bucket accounts are left out of the leaderboard.
- **Promotions**: announced in chat (grouped) and, from Lieutenant Commander up, a PROMOTED card on stream. The first check records everyone's current rank quietly.
- Voyager Control › Membership cards: turn ranks on or off, edit every rank's points, choose which promotions show on stream, see how many viewers hold each rank, and preview a promotion.

## 2.19.0 (31 October 2026)

**The new `!voyager` membership card**, built on your existing tiers and upgrade logic, alongside the Voyager Dreadnought (2.17) and Voyager Medals (2.18). **New Streamer.bot action: Voyager - Membership Card** (see `MEMBERSHIP_CARD_SETUP.html`, which also lists what your current Streamer.bot setup still needs).

- **Tier glass card** in Blue Explorer, Silver Sentinel, Gold Commander and Platinum Vanguard (ultraviolet) colours: chrome titles, faceted crest, machined roundel, planet and nebula backdrop. OBS source `/card.html` (`?backdrop=0` for the card alone), one card at a time with a tier entrance (scan, chrome sweep, crest flare, ultraviolet pulse).
- **Live data**: points balance and leaderboard place (from your `points` variable), lifetime points, time watched and streak, Versus record, season rank, Dreadnought, months subscribed, Honour, six best medals, a callsign and a member ID and member-since date.
- **Next-tier bar from your upgrade prices**: Silver 1,200 points, Silver → Gold 1,800, Gold → Platinum 17,000 (as in your purchase actions), with "type !upgrade" once affordable.
- **`!voyager stats`** (Fleet Record) and **`!voyager badges`** (Medal Wall) back sides; **`!voyager title <medal>`** picks a callsign; **`!voyager private`** hides time watched and months subscribed.
- **Tier-up ceremony**: when someone is added to SILVER, GOLD or PLATINUM GROUP (by !upgrade, a purchase or a FAST TRACK sub), the old card charges, flashes and reveals the new tier with a TIER UP banner.
- Tiers, `!upgrade`, purchases, bucket accounts, threshold giveaways and upgrade sounds are unchanged. Giveaway ticket balances are never shown.
- **Voyager Control › Membership cards**: previews for every tier, side and the tier-up, seconds on screen, per-viewer cooldown, upgrade prices and a setup checklist.
- Medals now record Dreadnought damage and fights joined (shown on the card).

## 2.18.0 (31 October 2026)

**Voyager Medals**: medals viewers earn for their time with the crew, their support and taking part. **New Streamer.bot action: Voyager - Medals** (see `MEDALS_SETUP.html`).

- **24 medals in four grades** (Bronze, Silver, Gold, Legend) plus four special medals. Built to reward the viewers who have been here longest and contributed most:
  - **Time & loyalty**: Time Watched (10 h → 1,500 h), Follower Since (3 months → 4 years), Unbreakable (streams in a row), Regular Pilot (stream days).
  - **Subs & support**: Loyal Subscriber (months), Sub Streak (months in a row), Fleet Gifter (gifted subs), Gift Bomb (biggest single drop), Power Supply (Bits, Kicks and Super Chats), Goal Breaker (season sub goals).
  - **Hall of Honour** (by rank): Fleet Patron (top supporters), Elder of the Fleet (longest-serving), Season Patron.
  - Versus & Dreadnought, Community (points, missions, seasons, giveaway wins) and Special (Founding Crew until Season 2 ends, First Contact, and two secret medals).
- **Honour rating**: 1, 2, 4 and 8 stars per grade; the loyalty, support and Hall of Honour medals count double. Shown in `!medals` and the Medals page's Hall of Honour.
- **Prestige only**: medals never pay points or giveaway tickets and never change anyone's odds. A medal is never taken away.
- **`!medals`** in chat (Twitch, YouTube, Kick): medal count by grade, Honour and rank, latest medal and the closest next grade. One reply every 30 seconds per viewer.
- **Announcements**: grouped chat lines (at most one every 20 seconds) and a glass medal pop-up on stream (`/medals.html`, Silver and above by default). The first run awards everyone's history quietly with one summary line.
- **Voyager Control › Medals**: change any grade target, switch medals off, choose what shows on stream, preview the pop-up, see recent unlocks and the Hall of Honour.
- The Dreadnought now records the killing blow and passes each fight's pilots, torpedoes and MVP to Medals.

## 2.17.3 (31 October 2026)

The Dreadnought's photoreal lighting comes to **Voyager Versus**. **No Streamer.bot changes.**

- Versus ships (Gladius, Paladin, Sabre) in the battle arena, challenger splash and hangar now reflect the space scene (nebula, star, gas giant) instead of a studio light box.
- Ambient occlusion in the battle arena darkens intakes, panel gaps and the joins between hull sections. It's off with `?quality=low`.
- The lighting code is now shared by Versus and the Dreadnought (`space-lighting.mjs`). Gameplay, controls and overlays are unchanged.

## 2.17.2 (31 October 2026)

More photorealistic PBR for the Voyager Dreadnought overlay. **No Streamer.bot changes.**

- **Physically correct materials.** The armour is now painted plating (non-metal paint with realistic roughness) over steel, instead of everything behaving like bare metal. Paint chips and wears through at plate edges and in flecks, exposing bright bare steel. Seams are dark, vents are unpainted metal, and grime, run-off streaks and scorch marks change roughness as well as colour. All 4K/2K/1K texture sets are regenerated.
- **Image-based lighting from space.** Reflections now come from the actual scene (the nebula, the star and the gas giant, with cool and warm fill) instead of a studio light box, so metal and paint pick up believable highlights. The player ships get the same lighting.
- **Ambient occlusion.** A screen-space AO pass darkens crevices, the gaps between hull tiers and the bases of turrets and details, on both the Dreadnought and the fleet. It's off at `?quality=low`.
- **Bevelled edges.** Every hull edge and every hull detail block is chamfered, so edges catch thin highlights the way machined armour does.
- **Engine bells** are heat-tinted titanium (iridescent, brushed metal).
- **Painted markings** on the hull: the hull number XV-07, its class name, hazard chevrons and thruster-wash warnings, all worn so the plating shows through.

## 2.17.1 (31 October 2026)

Dreadnought visual overhaul and reward rule. **No Streamer.bot changes.**

- **If the Dreadnought escapes, no points are awarded** (and none for a fight ended early). The escape screen and chat message now say so.
- **New Dreadnought model:** a faceted, three-tier armoured hull with a ventral keel, command tower with lit bridge, 8 twin-barrel turrets that track the fleet, 5 engine bells with animated volumetric plumes, prow spikes, swept fins, hangar bays, comms dishes, about 2,000 hull details, 700 lit windows and blinking running lights.
- **4K PBR materials** made for it (base colour, normal, ambient occlusion/roughness/metal, emissive): weathered armour plating with seams, rivets, vents, hatches, run-off streaks and scorch marks. 2K and 1K versions are used automatically with `?quality=balanced` / `?quality=low`.
- **Cinematic rendering:** HDR with multi-level bloom, ACES tone mapping, 4K soft shadows, MSAA, impact lights that light the hull, hex-shield ripples where shots land, sparks and smoke trails, fires and smoke that spread as the hull is damaged, a breakup with flying debris on victory and a jump-to-light-speed escape.
- **4K space backdrop** (nebula and star field) with a gas giant and atmosphere glow, plus drifting dust for depth. `?backdrop=0` still gives a transparent overlay.
- **60 fps:** effects are pooled (no stutter mid-fight), shaders compile before the first fight, and a governor lowers the render resolution slightly if frames run slow. Set the OBS Browser source to a custom frame rate of 60. For a 4K canvas, use 3840 × 2160 and `?res=2`.

## 2.17.0 (31 October 2026)

**Voyager Dreadnought**: a chat co-op boss fight. **One Streamer.bot change:** create the **Voyager - Dreadnought** action from `Voyager_Dreadnought.cs` and add its commands and triggers (see `DREADNOUGHT_SETUP.html`).

- **You call it** from **Voyager Control › Voyager Dreadnought** (or a moderator types `!dreadnought`). Chat has a boarding countdown to type **`!join`**; only pilots who join can attack.
- **`!fire`** is free: lasers for 12–22 damage every 4 seconds, with the odd critical hit. **Cheers and YouTube Super Chats** fire missile barrages (2.5 damage per bit). **Gifted subs** on Twitch, YouTube and Kick fire torpedoes, the biggest hits (600 each). Cheering or gifting joins the fleet automatically.
- The boss raises **shields at 50%** (`!fire` halved for 8 seconds), becomes **enraged at 20%**, and knocks pilots out for 10 seconds every 15 seconds. Destroy it before the clock runs out (3 minutes by default) or it escapes.
- **OBS overlay** `http://127.0.0.1:8740/dreadnought.html` in the Voyager Versus style: the same 3D ships and hull materials, a Dreadnought capital ship with shields, lasers, missiles, torpedoes, a hull bar, timer, fleet leaderboard, battle feed and a victory or escape screen. It is invisible between fights.
- **Rewards:** victory pays the **same** points (100 by default) to every pilot who fought, through **Missions › Points owed**. Paid support only changes damage, never rewards, and never gives giveaway tickets.
- **Preview (simulated chat)** shows a full fight without posting in chat or paying anyone. Every setting (hull, damage, timings, rewards, boss name) is on the page.
- Fight updates post to Twitch, YouTube and Kick chat through the new action. Voyager Versus is paused while a fight is on.

## 2.16.1 (31 October 2026)

Subscriber rewards now follow your Currency System's own points. **No Streamer.bot changes.**

- **Missions › Match your Currency System** reads what StreamUP already pays per gifted sub and per sub/resub from Points history, and sets:
  - **Crew Supporter** = one sub's points,
  - **Fleet Gifter** = one gifted sub's points (a bonus on top of what each gift already earns),
  - **Veteran Crew** = half a sub's points,
  - **Season sub goals** = one gift's points per helper (subs-only goals: one sub's),
  - **Supporter bonus** (season score only) = one gift's points.
- Rewards you haven't edited are matched automatically the first time the Points Ledger connects. If no sub or gift events are in Points history yet, type the two numbers and click **Match subscriber rewards**.
- Until then, the 2.15 subscriber rewards are lowered: Crew Supporter 250 (was 500), Fleet Gifter 250 (was 750), Veteran Crew 125 (was 300), Grow the Crew 250 (was 300); Gift Fleet stays 200. Rewards you changed yourself are kept.

## 2.16.0 (31 October 2026)

Fairer impromptu giveaways. **One Streamer.bot change:** paste the new `Voyager_Giveaway_Engine.cs` (v10) into **Voyager - Giveaway Engine** and compile.

- **Everyone can enter.** Anyone who won an **impromptu** giveaway in the last 30 days can still type `!enter` and is counted as an entrant, but **can't be drawn** as the winner. Giveaway Control marks them "can't be drawn", and the chat lock message says how many there are.
- **Silver, Gold and Platinum giveaways are not affected.** Recent impromptu winners can win them, and winning one doesn't count toward the 30 days.
- The rule is **Hasn't won an impromptu giveaway recently** under Who can win (on by default, 1–365 days). Security rules (watchlist, confirmed bots or alts, account age) still keep those accounts out completely.
- **Fair-draw proof:** the list of entrants who couldn't be drawn is locked into the fingerprint before the draw (proof version 2), so voyagercommand.com can still re-check every draw. Its entrant list marks them "entered, could not be drawn".

## 2.15.0 (30 October 2026)

Subscriber goals for Missions and Seasons, for Twitch subs, YouTube memberships and Kick subs. **One Streamer.bot change:** paste the new `Voyager_Stream_Stats.cs` (v6) into **Voyager - Stream Stats** and compile (see `NATIVE_COMMUNITY_SETUP.html`). **Voyager - Community Tracker** must be enabled.

### New weekly missions (Community › Missions)
- Three subscriber missions are added and switched on (switch any off, edit or remove them):
  - **Crew Supporter**: subscribe or renew this week (500 points),
  - **Fleet Gifter**: gift 3 subs or memberships this week (750 points),
  - **Veteran Crew**: renew this week with 6+ months subscribed (300 points).
- Every mission now has a **Platform** option (All, Twitch, YouTube or Kick), so you can run a Kick-only or YouTube-only push.
- Subscriber rewards go through **Points owed** and **Pay all owed** like the other missions. Subscribers without a points account show as "No points account" until they earn their first points.

### Season sub goals (Community › Seasons)
- Up to four **community sub goals** per season, counting subs and renewals, gifted subs, or both, on all platforms or one. Two are ready: **Grow the Crew** (50 subs, renewals and gifted subs, 300 points each helper) and **Gift Fleet** (25 gifted subs, 200 points each helper).
- When a goal is reached, everyone who helped earns its reward. It appears in **Missions › Points owed** and stays payable after the season ends.
- **Supporter bonus**: each sub, renewal or gifted sub this season adds 100 to a viewer's **season score** (change it or set 0). Standings now show points earned, subs and gifts, and the score.
- New OBS panel view: **Season sub goals** with progress bars (Seasons › Show on stream).
- voyagercommand.com shows the sub goals with progress and how many supporters helped (never who), and the subscriber missions.

Rewards are always Voyager points, never giveaway tickets. Anonymous gifts can't be credited.

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
