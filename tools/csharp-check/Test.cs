// Runs Voyager's Giveaway Engine in the stand-in and checks the fair-draw proof end to end.
// The expected numbers are also checked by the website's verifier test (fair-draw.test.mjs).
using System;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

public static class Program
{
    static int failures = 0, checks = 0;
    static void Check(bool ok, string what) { checks++; Console.WriteLine((ok ? "ok   " : "FAIL ") + what); if (!ok) { failures++; Console.WriteLine("::error title=C# check failed::" + what); } }
    public static int Main()
    {
        // Shared test vectors (same values asserted in JavaScript).
        string zero = new string('0', 64), mixed = String.Concat(Enumerable.Repeat("0123456789abcdef", 4));
        Check(CPHInline.ProofIndex(zero, 1) == 0, "index(zero,1)=0");
        Check(CPHInline.ProofIndex(zero, 7) == 2, "index(zero,7)=2");
        Check(CPHInline.ProofIndex(zero, 48) == 13, "index(zero,48)=13");
        Check(CPHInline.ProofIndex(mixed, 48) == 20, "index(mixed,48)=20");
        Check(CPHInline.ProofIndex(mixed, 50000) == 29044, "index(mixed,50000)=29044");
        Check(CPHInline.Hex(CPHInline.Sha(CPHInline.FromHex(mixed))) == "4884fdaafea47c29fea7159d0daddd9c085d6200e1359e85bb81736af6b7c837", "sha256(mixed)");
        Check(CPHInline.Hex(CPHInline.Sha(Encoding.UTF8.GetBytes("twitch\tAlpha\nyoutube\tBéta ✦"))) == "317925846afc26dabc308b10f107fb222ac635c616c0bd527444dc3d8d5ca29b", "pool hash text");

        // A members giveaway: lock, check the commitment, draw, reroll, confirm.
        var engine = new CPHInline(); var cph = engine.CPH;
        var users = Enumerable.Range(1, 12).Select(i => new FakeGroupUser { Id = "u" + i, Login = "viewer" + i, Username = "Viewer" + i, Type = "twitch" }).ToList();
        cph.Groups["SILVER GROUP"] = users;
        Run(engine, "create", new { mode = "groups", groups = "silver", title = "Test prize", excludeLogins = "viewer3" });
        var state = State(cph); var session = (JObject)state["session"]; var proof = (JObject)session["proof"];
        Check(proof != null && (int)proof["version"] == 1, "proof committed at lock");
        Check((int)proof["size"] == 11 && ((JArray)session["pool"]).Count == 11, "excluded login left out of the pool and proof");
        Check(cph.Chat.Any(m => m.Contains("Fair-draw fingerprint " + ((string)proof["commitment"]).Substring(0, 16))), "fingerprint announced in chat");
        var seeds = ((JArray)proof["seeds"]).Select(x => (string)x).ToList();
        Check(seeds.Count == 64, "64 seeds");
        byte[] s = CPHInline.FromHex(seeds[2]); for (int i = 0; i < 3; i++) s = CPHInline.Sha(s);
        Check(CPHInline.Hex(s) == (string)proof["commitment"], "seed 3 hashes back to the commitment");
        string lines = String.Join("\n", ((JArray)session["pool"]).Select(e => (string)e["platform"] + "\t" + (string)e["name"]));
        Check(CPHInline.Hex(CPHInline.Sha(Encoding.UTF8.GetBytes(lines))) == (string)proof["poolHash"], "pool hash matches the saved pool order");

        Run(engine, "draw", new { });
        state = State(cph); session = (JObject)state["session"];
        var d1 = (JObject)((JArray)session["draws"])[0];
        int expected1 = CPHInline.ProofIndex(seeds[0], 11);
        Check((int)d1["proof"]["n"] == 1 && (int)d1["proof"]["index"] == expected1, "draw 1 uses seed 1");
        Check((string)d1["winner"]["key"] == (string)session["pool"][expected1]["key"], "draw 1 winner is pool[index]");
        Expire(cph);
        Run(engine, "reroll", new { });
        state = State(cph); session = (JObject)state["session"];
        var remaining = ((JArray)session["pool"]).OfType<JObject>().Where(e => (string)e["key"] != (string)d1["winner"]["key"]).ToList();
        var d2 = (JObject)((JArray)session["draws"])[1];
        Check((int)d2["proof"]["n"] == 2 && (string)d2["winner"]["key"] == (string)remaining[CPHInline.ProofIndex(seeds[1], 10)]["key"], "reroll uses seed 2 on the remaining entrants");

        // A chat giveaway commits when entries close, and reopening discards the proof.
        engine = new CPHInline(); cph = engine.CPH;
        Run(engine, "create", new { mode = "chat", title = "Chat prize" });
        var openProof = State(cph)["session"]["proof"]; Check(openProof == null || openProof.Type == JTokenType.Null, "no proof while chat entries are open");
        cph.EventType = FakeEventType.CommandTriggered;
        foreach (var n in new[] { "Alpha", "Beta", "Gamma" })
        {
            cph.Args = new System.Collections.Generic.Dictionary<string, object> { ["command"] = "!enter", ["commandSource"] = "twitch", ["commandType"] = "message", ["userId"] = "id-" + n, ["userName"] = n.ToLower(), ["user"] = n };
            engine.Execute();
        }
        cph.EventType = FakeEventType.Unknown;
        Run(engine, "closeEntries", new { });
        var chatProof = (JObject)State(cph)["session"]["proof"];
        Check(chatProof != null && (int)chatProof["size"] == 3, "proof committed when entries close");
        Run(engine, "reopenEntries", new { });
        Check(State(cph)["session"]["proof"].Type == JTokenType.Null, "reopening discards the proof");
        Check(cph.Errors.Count == 0, "no engine errors: " + String.Join(" | ", cph.Errors));
        // v10: a recent impromptu winner can enter but is never drawn, and is locked into a v2 proof.
        engine = new CPHInline(); cph = engine.CPH;
        Run(engine, "create", new { mode = "chat", title = "Impromptu", noWinLogins = "twitch:id:id-Beta, youtube:id:UCx" });
        cph.EventType = FakeEventType.CommandTriggered;
        foreach (var n in new[] { "Alpha", "Beta", "Gamma", "Delta" })
        {
            cph.Args = new System.Collections.Generic.Dictionary<string, object> { ["command"] = "!enter", ["commandSource"] = "twitch", ["commandType"] = "message", ["userId"] = "id-" + n, ["userName"] = n.ToLower(), ["user"] = n };
            engine.Execute();
        }
        cph.EventType = FakeEventType.Unknown;
        var nwPool = (JArray)State(cph)["session"]["pool"];
        Check(nwPool.Count == 4 && nwPool.Count(e => (bool?)e["noWin"] == true) == 1 && (bool)nwPool.First(e => (string)e["name"] == "Beta")["noWin"], "recent winner entered, marked cannot-win");
        Run(engine, "closeEntries", new { });
        var nwProof = (JObject)State(cph)["session"]["proof"];
        Check((int)nwProof["version"] == 2 && (int)nwProof["noWin"] == 1 && ((JArray)nwProof["entrants"])[1].Count() == 3, "v2 proof lists the cannot-win entrant");
        string nwLines = String.Join("\n", nwPool.Select(e => (string)e["platform"] + "\t" + (string)e["name"] + ((bool?)e["noWin"] == true ? "\tcannot-win" : "")));
        Check(CPHInline.Hex(CPHInline.Sha(Encoding.UTF8.GetBytes(nwLines))) == (string)nwProof["poolHash"], "v2 pool hash includes cannot-win");
        Check(cph.Chat.Any(m => m.Contains("can't be drawn this time")), "chat announcement mentions recent winners");
        var nwSeeds = ((JArray)nwProof["seeds"]).Select(x => (string)x).ToList();
        var drawable = nwPool.Where(e => (bool?)e["noWin"] != true).ToList(); bool neverBeta = true;
        for (int k = 0; k < 3; k++)
        {
            Run(engine, "draw", new { });
            var sess = (JObject)State(cph)["session"]; var dk = (JObject)((JArray)sess["draws"])[k];
            neverBeta &= (string)dk["winner"]["name"] != "Beta";
            Check((string)dk["winner"]["key"] == (string)drawable[CPHInline.ProofIndex(nwSeeds[k], drawable.Count)]["key"], "draw " + (k + 1) + " counts only drawable entrants");
            drawable.RemoveAll(e => (string)e["key"] == (string)dk["winner"]["key"]);
            Expire(cph); Run(engine, "confirm", new { });
        }
        Check(neverBeta, "the recent winner is never drawn");
        bool refused = false; try { Run(engine, "draw", new { }); } catch (Exception e) { refused = e.Message.Contains("impromptu giveaway"); }
        Check(refused, "with only the recent winner left, the draw explains why it can't pick anyone");
        cph.Errors.Clear();

        // Voyager Stream Stats v6: the subscriber export used by Missions and Seasons.
        var stats = new CPHInline_2(); var sc = stats.CPH; long nowMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        sc.SetGlobalVar("VoyagerCommunityStateV1", new JObject { ["schema"] = 1, ["platforms"] = new JObject {
            ["twitch"] = new JObject { ["users"] = new JObject { ["111"] = new JObject { ["name"] = "Nova", ["login"] = "nova", ["months"] = 7, ["monthsUpdatedAt"] = nowMs - 3600000 }, ["222"] = new JObject { ["name"] = "Old", ["months"] = 2, ["monthsUpdatedAt"] = nowMs - 200L * 86400000 } } },
            ["kick"] = new JObject { ["users"] = new JObject { ["9"] = new JObject { ["name"] = "Orion", ["gifts"] = 5, ["giftsUpdatedAt"] = nowMs - 60000 } } } } }.ToString(Newtonsoft.Json.Formatting.None));
        sc.Args = new System.Collections.Generic.Dictionary<string, object> { ["requestId"] = "r1", ["includeSupport"] = "1" };
        stats.Execute(); var snap = JObject.Parse(sc.Broadcasts.Last()); var support = snap["support"] as JArray;
        Check((bool)snap["ok"] && (int)snap["supportVersion"] == 1, "stats v6 snapshot ok: " + (string)snap["error"]);
        Check(support != null && support.Count == 2, "support export keeps the last 90 days only");
        Check(support != null && support.Count > 0 && (string)support[0]["key"] == "kick:9" && (long)support[0]["gifts"] == 5, "newest supporter first, gifts included");
        Check(support != null && support.Any(r => (string)r["key"] == "twitch:111" && (long)r["months"] == 7), "twitch months included");
        sc.Args = new System.Collections.Generic.Dictionary<string, object> { ["requestId"] = "r2" };
        stats.Execute(); Check(JObject.Parse(sc.Broadcasts.Last())["support"] == null, "support is only sent when asked for");
        // Voyager Dreadnought v1: chat and support events for the boss fight.
        var boss = new CPHInline_3(); var bc = boss.CPH;
        Func<System.Collections.Generic.Dictionary<string, object>, FakeEventType, JObject> fireEvent = (args, type) => { bc.Broadcasts.Clear(); bc.Args = args; bc.EventType = type; boss.Execute(); return bc.Broadcasts.Count == 0 ? null : JObject.Parse(bc.Broadcasts.Last()); };
        var j = fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["command"] = "!join", ["commandSource"] = "kick", ["userId"] = "k9", ["userName"] = "orion", ["user"] = "Orion" }, FakeEventType.CommandTriggered);
        Check(j != null && (string)j["type"] == "voyager.boss.event" && (string)j["kind"] == "join" && (string)j["platform"] == "kick" && (string)j["userId"] == "k9", "!join becomes a join event");
        var cheer = fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["bits"] = "250", ["userId"] = "t1", ["userName"] = "nova", ["user"] = "Nova" }, FakeEventType.TwitchCheer);
        Check(cheer != null && (string)cheer["kind"] == "bits" && (long)cheer["amount"] == 250, "cheer carries its bits");
        Check(fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["fromSubBomb"] = "True", ["userId"] = "t1" }, FakeEventType.TwitchGiftSub) == null, "gift bomb children are not counted twice");
        var bomb = fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["gifts"] = "5", ["anonymous"] = "True", ["userId"] = "t1", ["user"] = "Nova" }, FakeEventType.TwitchGiftBomb);
        Check(bomb != null && (long)bomb["amount"] == 5 && (string)bomb["name"] == "Anonymous" && (string)bomb["userId"] == "", "anonymous gift bomb");
        var mass = fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["count"] = "2", ["subscribedAt"] = "2026-10-31T00:00:00Z", ["recipient.0.userId"] = "a", ["recipient.1.userId"] = "b", ["userId"] = "k9", ["user"] = "Orion" }, FakeEventType.KickMassGiftSubscription);
        Check(mass != null && ((JArray)mass["receipts"]).Count == 2, "Kick mass gift sends recipient receipts");
        Check(fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["command"] = "!dance", ["commandSource"] = "twitch", ["userId"] = "t1" }, FakeEventType.CommandTriggered) == null, "other commands are ignored");
        bc.Chat.Clear(); fireEvent(new System.Collections.Generic.Dictionary<string, object> { ["bossSay"] = "Dreadnought incoming" }, FakeEventType.Unknown);
        Check(bc.Chat.Contains("twitch:Dreadnought incoming") && bc.Chat.Contains("kick:Dreadnought incoming"), "bossSay posts to chat");

        // Voyager Medals v1: read-only data export, !medals and chat lines.
        var medals = new CPHInline_4(); var mc = medals.CPH;
        mc.Globals["VoyagerCommunityStateV1"] = "{\"schema\":1,\"platforms\":{\"twitch\":{\"users\":{\"111\":{\"id\":\"111\",\"login\":\"nova\",\"name\":\"Nova\",\"watchSeconds\":36000,\"months\":7,\"gifts\":3,\"firstSeenAt\":1000,\"lastSeenAt\":5000},\"222\":{\"id\":\"222\",\"watchSeconds\":10}}}}}";
        mc.Globals["VoyagerFleetAlertsV1"] = "{\"schema\":1,\"crew\":{\"twitch:111\":{\"name\":\"Nova\",\"login\":\"nova\",\"bits\":2500,\"follow\":1,\"firstSeenAt\":900,\"lastEventAt\":6000}},\"history\":[{\"id\":\"e1\",\"stage\":3,\"amount\":10,\"platform\":\"twitch\",\"userId\":\"111\",\"receivedAt\":6000,\"test\":false},{\"id\":\"e2\",\"stage\":5,\"source\":\"YouTubeSuperChat\",\"microAmount\":\"5000000\",\"platform\":\"youtube\",\"userId\":\"y1\",\"receivedAt\":6000},{\"id\":\"e3\",\"stage\":3,\"amount\":50,\"platform\":\"twitch\",\"userId\":\"111\",\"receivedAt\":6000,\"test\":true}]}";
        mc.Globals["VoyagerGiveawayStateV1"] = "{\"schema\":1,\"audit\":[{\"id\":\"d1\",\"status\":\"confirmed\",\"confirmedAt\":7000,\"winner\":{\"platform\":\"kick\",\"id\":\"k5\",\"login\":\"vex\",\"name\":\"Vex\"}},{\"id\":\"d2\",\"status\":\"not_confirmed\",\"winner\":{\"platform\":\"kick\",\"id\":\"k6\"}}]}";
        mc.Args = new System.Collections.Generic.Dictionary<string, object> { ["medalExport"] = "1", ["since"] = "0", ["requestId"] = "m1" };
        medals.Execute();
        var md = mc.Broadcasts.Count == 0 ? null : JObject.Parse(mc.Broadcasts.Last());
        Check(md != null && (string)md["type"] == "voyager.medals.data" && (string)md["requestId"] == "m1", "medal export is broadcast");
        Check(md != null && ((JArray)md["users"]).Count == 1 && (string)md["users"][0]["key"] == "twitch:111" && (long)md["users"][0]["watchSeconds"] == 36000 && (long)md["users"][0]["months"] == 7, "community watch time and months exported (tiny records skipped)");
        Check(md != null && (long)md["crew"][0]["bits"] == 2500 && ((JArray)md["giftEvents"]).Count == 1 && (long)md["giftEvents"][0]["amount"] == 10, "fleet Bits and real gift drops exported (test alerts skipped)");
        Check(md != null && (long)md["superChats"][0]["micro"] == 5000000 && ((JArray)md["wins"]).Count == 1 && (string)md["wins"][0]["userId"] == "k5", "Super Chats and confirmed giveaway winners exported");
        mc.Args = new System.Collections.Generic.Dictionary<string, object> { ["medalExport"] = "1", ["since"] = "5500" };
        medals.Execute(); var md2 = JObject.Parse(mc.Broadcasts.Last());
        Check(((JArray)md2["users"]).Count == 0 && ((JArray)md2["crew"]).Count == 1, "since only sends records that changed");
        mc.Broadcasts.Clear(); mc.EventType = FakeEventType.CommandTriggered;
        mc.Args = new System.Collections.Generic.Dictionary<string, object> { ["command"] = "!medals", ["commandSource"] = "youtube", ["userId"] = "y1", ["userName"] = "Lyra", ["user"] = "Lyra" };
        medals.Execute(); var me = mc.Broadcasts.Count == 0 ? null : JObject.Parse(mc.Broadcasts.Last());
        Check(me != null && (string)me["type"] == "voyager.medals.event" && (string)me["platform"] == "youtube" && (string)me["userId"] == "y1", "!medals becomes a medals event");
        mc.Chat.Clear(); mc.EventType = FakeEventType.Unknown; mc.Args = new System.Collections.Generic.Dictionary<string, object> { ["medalSay"] = "Nova earned Time Watched Gold" };
        medals.Execute(); Check(mc.Chat.Contains("twitch:Nova earned Time Watched Gold") && mc.Chat.Contains("kick:Nova earned Time Watched Gold"), "medalSay posts to chat");

        Console.WriteLine(failures == 0 ? "::notice title=Streamer.bot actions::Compiled; all " + checks + " Giveaway Engine, Stream Stats, Dreadnought and Medals checks passed." : "::error title=Streamer.bot actions::" + failures + " of " + checks + " checks failed.");
        return failures == 0 ? 0 : 1;
    }
    static JObject State(FakeCph cph) { return JObject.Parse(cph.GetGlobalVar<string>("VoyagerGiveawayStateV1")); }
    static void Expire(FakeCph cph)
    {
        // Skip the 50-second reveal wait by moving saved times into the past.
        var st = State(cph);
        foreach (var d in st["session"]["draws"]) { d["at"] = (long)d["at"] - 120000; }
        if (st["reveal"] is JObject) st["reveal"]["at"] = (long)st["reveal"]["at"] - 120000;
        cph.SetGlobalVar("VoyagerGiveawayStateV1", st.ToString(Newtonsoft.Json.Formatting.None));
    }
    static void Run(CPHInline engine, string op, object extra)
    {
        var cph = engine.CPH;
        string raw = cph.GetGlobalVar<string>("VoyagerGiveawayStateV1");
        long rev = raw == null ? 0 : (long)JObject.Parse(raw)["controlRevision"];
        cph.Args = new System.Collections.Generic.Dictionary<string, object> { ["operation"] = op, ["requestId"] = Guid.NewGuid().ToString(), ["controlRevision"] = rev.ToString() };
        foreach (var p in JObject.FromObject(extra).Properties()) cph.Args[p.Name] = (string)p.Value;
        if (!engine.Execute()) throw new Exception(op + " failed: " + String.Join(" | ", cph.Errors));
    }
}
