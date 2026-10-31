# Voyager changelog

Older update notes are listed in `Voyager_Guide.html` (Update history) and kept in `docs/updates/` and `docs/updates/versus/`.

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
