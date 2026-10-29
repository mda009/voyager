// Voyager Banner v1. Dedicated blocking queue, Concurrent OFF. No triggers required.
// Stores only banner text/style. Never sends chat or changes giveaways, points or groups.
using System;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
public class CPHInline
{
    private const string Store = "VoyagerBannerStateV1";
    private const string Seed = @"{""messages"": [""RSI DISCOVERY MONTH"", ""GIVEAWAY TODAY - CONGRATS FITZY_AU OUR SILVER CHAMPION WINNING THE SABRE RAVEN EX & KAIBERIOUS777 OUR GOLD WINNER CONNIE PHOENIX MKIV | MONTHLY GIVEAWAY RSI CENTAURUS MKV - DRAW 14TH NOVEMBER !entergiveaway"", ""VOYAGER, OUR COMMUNITY REWARDS WHERE YOU CAN EARN ACCESS TO EXCLUSIVE GIVEWAYS !voyager TO CALL YOUR MEMBERSHIP CARD & !points TO CHECK YOUR POINTS BALANCE"", ""!upgrade TO ADVANCE TO THE NEXT TIER""], ""speed"": 55, ""fontSize"": 32, ""height"": 56, ""opacity"": 90, ""textColor"": ""#ffffff"", ""borderColor"": ""#4169e1"", ""glowColor"": ""#ff8c00"", ""separator"": ""⯁"", ""letterSpacing"": 2, ""uppercase"": true, ""scanlines"": true, ""visible"": true, ""paused"": false}";
    private static readonly object Gate = new object();
    public bool Execute()
    {
        string op = Read("bannerOperation"), requestId = Read("requestId"); Guid request;
        if (op != "snapshot" && op != "publish" && op != "visibility" && op != "pause") return true;
        if (!Guid.TryParse(requestId, out request)) return false;
        lock (Gate)
        {
            try
            {
                string raw = CPH.GetGlobalVar<string>(Store, true);
                JObject s = String.IsNullOrEmpty(raw) ? new JObject { ["schema"] = 1, ["epoch"] = Guid.NewGuid().ToString(), ["revision"] = 0, ["updatedAt"] = 0, ["settings"] = Validate(JObject.Parse(Seed)), ["requests"] = new JArray() } : JObject.Parse(raw);
                Guid epoch;
                if ((int?)s["schema"] != 1 || !Guid.TryParse((string)s["epoch"], out epoch) || s["revision"] == null || s["revision"].Type != JTokenType.Integer || (long)s["revision"] < 0 || (long)s["revision"] >= 9007199254740991L || !(s["requests"] is JArray)) throw new Exception("Invalid saved banner state; data was preserved.");
                s["settings"] = Validate(s["settings"] as JObject);
                if (String.IsNullOrEmpty(raw)) Save(s);
                JArray requests = (JArray)s["requests"];
                if (op != "snapshot")
                {
                    foreach (JToken done in requests) if ((string)done == requestId) { Reply(s, requestId, false, ""); return true; }
                    long baseRevision;
                    if (Read("baseEpoch") != (string)s["epoch"] || !Int64.TryParse(Read("baseRevision"), out baseRevision) || baseRevision != (long)s["revision"]) throw new Exception("The live banner changed after this draft was loaded. Refresh live state and load the latest banner before publishing.");
                    JObject settings = (JObject)s["settings"];
                    if (op == "publish")
                    {
                        string incoming = Read("bannerSettings");
                        if (incoming.Length > 20000) throw new Exception("Banner update is too large.");
                        settings = Validate(JObject.Parse(incoming));
                    }
                    else
                    {
                        bool value;
                        if (!Boolean.TryParse(Read("bannerValue"), out value)) throw new Exception("Missing banner toggle value.");
                        settings[op == "visibility" ? "visible" : "paused"] = value;
                    }
                    s["settings"] = settings; s["revision"] = (long)s["revision"] + 1; s["updatedAt"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                    requests.Add(requestId); while (requests.Count > 100) requests.RemoveAt(0);
                    Save(s);
                }
                Reply(s, requestId, op != "snapshot", ""); return true;
            }
            catch (Exception ex) { CPH.LogWarn("[Voyager Banner] " + ex.Message); Reply(null, requestId, false, ex.Message); return false; }
        }
    }
    private JObject Validate(JObject raw)
    {
        if (raw == null) throw new Exception("Banner settings are missing.");
        JArray messages = raw["messages"] as JArray;
        if (messages == null || messages.Count < 1 || messages.Count > 20) throw new Exception("Enter 1 to 20 messages.");
        JArray clean = new JArray(); int total = 0;
        foreach (JToken item in messages)
        {
            if (item.Type != JTokenType.String) throw new Exception("Messages must be plain text.");
            string text = ((string)item).Trim();
            if (text.Length == 0 || text.Length > 600) throw new Exception("Each message must contain 1 to 600 characters.");
            foreach (char c in text) if (c < 32 || c == 127) throw new Exception("Each message must be a single line.");
            total += text.Length; clean.Add(text);
        }
        if (total > 6000) throw new Exception("Maximum 6000 message characters.");
        JObject s = new JObject { ["messages"] = clean };
        Number(raw,s,"speed",15,240); Number(raw,s,"fontSize",18,64); Number(raw,s,"height",40,120); Number(raw,s,"opacity",0,100); Number(raw,s,"letterSpacing",0,8);
        if ((int)s["height"] < Math.Ceiling((int)s["fontSize"] * 1.1) + 16) throw new Exception("Banner height is too small for this font size.");
        foreach (string key in new [] { "textColor", "borderColor", "glowColor" })
        {
            string color = raw[key] != null && raw[key].Type == JTokenType.String ? (string)raw[key] : "";
            if (color.Length != 7 || color[0] != '#') throw new Exception("Invalid banner color.");
            for (int i = 1; i < color.Length; i++) if (!Uri.IsHexDigit(color[i])) throw new Exception("Invalid banner color.");
            s[key] = color.ToLowerInvariant();
        }
        foreach (string key in new [] { "uppercase", "scanlines", "visible", "paused" }) { if (raw[key] == null || raw[key].Type != JTokenType.Boolean) throw new Exception("Missing banner option " + key + "."); s[key] = (bool)raw[key]; }
        string separator = (string)raw["separator"];
        if (separator != "⯁" && separator != "•" && separator != "|" && separator != "★" && separator != "/") throw new Exception("Unsupported separator.");
        s["separator"] = separator; return s;
    }
    private void Number(JObject raw, JObject clean, string key, int min, int max)
    {
        JToken v = raw[key]; long number;
        if (v == null || v.Type != JTokenType.Integer || !Int64.TryParse(v.ToString(), out number) || number < min || number > max) throw new Exception(key + " must be a whole number between " + min + " and " + max + ".");
        clean[key] = number;
    }
    private void Save(JObject s) { CPH.SetGlobalVar(Store, s.ToString(Formatting.None), true); }
    private void Reply(JObject state, string requestId, bool changed, string error)
    {
        JObject publicState = state == null ? null : new JObject { ["schema"] = 1, ["epoch"] = state["epoch"], ["revision"] = state["revision"], ["updatedAt"] = state["updatedAt"], ["settings"] = state["settings"].DeepClone() };
        CPH.WebsocketBroadcastJson(new JObject { ["type"] = "voyager.banner.v1", ["schema"] = 1, ["requestId"] = requestId, ["ok"] = error.Length == 0, ["change"] = changed, ["state"] = publicState, ["error"] = error }.ToString(Formatting.None));
    }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) ?? "" : ""; }
}
