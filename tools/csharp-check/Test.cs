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
        Console.WriteLine(failures == 0 ? "::notice title=Streamer.bot actions::Compiled; all " + checks + " Giveaway Engine and Stream Stats checks passed." : "::error title=Streamer.bot actions::" + failures + " of " + checks + " checks failed.");
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
