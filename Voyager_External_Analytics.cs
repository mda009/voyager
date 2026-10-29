// Voyager External Analytics v1. Read-only public data for MDA009.
// Dedicated blocking queue, Concurrent OFF. No triggers or platform credentials.
using System;
using System.IO;
using System.Net;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private const string Store = "VoyagerExternalAnalyticsV1";
    private static readonly object Gate = new object();
    public bool Execute()
    {
        object arg; Guid id;
        string requestId = CPH.TryGetArg<object>("requestId", out arg) ? Convert.ToString(arg) : "";
        string operation = CPH.TryGetArg<object>("externalOperation", out arg) ? Convert.ToString(arg) : "";
        if (operation != "refresh" || !Guid.TryParse(requestId, out id)) return true;
        lock (Gate)
        {
            try
            {
                string raw = CPH.GetGlobalVar<string>(Store, true);
                JObject state = String.IsNullOrEmpty(raw) ? new JObject { ["schema"] = 1, ["sources"] = new JObject() } : JObject.Parse(raw);
                if ((int?)state["schema"] != 1 || !(state["sources"] is JObject)) throw new Exception("External analytics cache is invalid. Saved data was preserved.");
                JObject sources = (JObject)state["sources"];
                foreach (string source in new [] { "TwitchTracker", "TwitchMetrics" })
                {
                    JObject entry = sources[source] as JObject ?? new JObject();
                    if (Now() >= ((long?)entry["nextAttemptAt"] ?? 0))
                    {
                        entry["lastAttemptAt"] = Now();
                        try
                        {
                            string body = Download(source == "TwitchTracker" ? "https://twitchtracker.com/api/channels/summary/mda009" : "https://www.twitchmetrics.net/c/869478987-mda009");
                            long fetchedAt = Now();
                            JObject parsed = source == "TwitchTracker" ? ParseTracker(body, fetchedAt) : ParseMetrics(body, fetchedAt);
                            entry["snapshot"] = parsed["snapshot"];
                            entry["rank"] = parsed["rank"];
                            entry["streams"] = parsed["streams"];
                            entry["warning"] = parsed["warning"] ?? "";
                            entry["lastSuccessAt"] = fetchedAt;
                            entry["error"] = "";
                            entry["nextAttemptAt"] = fetchedAt + 300000L;
                        }
                        catch (Exception ex)
                        {
                            // Keep the successful snapshot and its original retrieval time.
                            entry["error"] = ex.Message;
                            entry["nextAttemptAt"] = Now() + 900000L;
                            WebException web = ex as WebException;
                            HttpWebResponse response = web == null ? null : web.Response as HttpWebResponse;
                            if (response != null)
                            {
                                entry["error"] = "HTTP " + (int)response.StatusCode + ". The source did not provide readable public data.";
                                string retry = response.Headers["Retry-After"]; double seconds; DateTimeOffset until;
                                if (Double.TryParse(retry, NumberStyles.Float, CultureInfo.InvariantCulture, out seconds) && seconds > 0)
                                    entry["nextAttemptAt"] = Now() + (long)Math.Min(86400000, Math.Max(900000, seconds * 1000));
                                else if (DateTimeOffset.TryParse(retry, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out until))
                                    entry["nextAttemptAt"] = Math.Max((long)entry["nextAttemptAt"], Math.Min(Now() + 86400000, until.ToUnixTimeMilliseconds()));
                                response.Close();
                            }
                            CPH.LogWarn("[Voyager External Analytics] " + source + ": " + (string)entry["error"]);
                        }
                        sources[source] = entry;
                        CPH.SetGlobalVar(Store, state.ToString(Formatting.None), true);
                    }
                }
                Reply(new JObject { ["type"] = "voyager.external.analytics.v1", ["schema"] = 1, ["ok"] = true, ["requestId"] = requestId, ["generatedAt"] = Now(), ["sources"] = sources.DeepClone() });
                return true;
            }
            catch (Exception ex)
            {
                Reply(new JObject { ["type"] = "voyager.external.analytics.v1", ["schema"] = 1, ["ok"] = false, ["requestId"] = requestId, ["error"] = ex.Message });
                return false;
            }
        }
    }
    private static string Download(string url)
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "GET"; request.Timeout = 15000; request.ReadWriteTimeout = 15000;
        request.AllowAutoRedirect = false; request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
        request.UserAgent = "VoyagerControl/1.0 (personal MDA009 public analytics dashboard)";
        request.Accept = "application/json,text/html;q=0.9";
        using (var timeout = new System.Threading.Timer(_ => request.Abort(), null, 20000, System.Threading.Timeout.Infinite))
        using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
        {
            if (response.StatusCode != HttpStatusCode.OK) throw new Exception("Source returned HTTP " + (int)response.StatusCode + ".");
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                StringBuilder text = new StringBuilder(); char[] buffer = new char[8192]; int count; long deadline = Now() + 20000;
                while ((count = reader.Read(buffer, 0, buffer.Length)) > 0)
                {
                    text.Append(buffer, 0, count);
                    if (text.Length > 1500000 || Now() > deadline) throw new Exception("Source response exceeded the size or time limit.");
                }
                return text.ToString();
            }
        }
    }
    public static JObject ParseTracker(string body, long fetchedAt)
    {
        JObject j = JObject.Parse(body); string end = Day(fetchedAt);
        JObject s = new JObject { ["source"] = "TwitchTracker", ["start"] = DateTime.ParseExact(end, "yyyy-MM-dd", CultureInfo.InvariantCulture).AddDays(-30).ToString("yyyy-MM-dd"), ["end"] = end, ["updated"] = end,
            ["fetchedAt"] = fetchedAt, ["periodBasis"] = "rolling-as-of-fetch", ["average"] = Required(j, "avg_viewers"), ["peak"] = Required(j, "max_viewers"),
            ["watched"] = Required(j, "hours_watched"), ["hours"] = Required(j, "minutes_streamed") / 60.0, ["followers"] = Required(j, "followers_total"), ["gain"] = Required(j, "followers", true) };
        Validate(s);
        double rank = Required(j, "rank");
        if (rank != Math.Truncate(rank)) throw new Exception("Unexpected worldwide rank format.");
        return new JObject { ["snapshot"] = s, ["rank"] = rank > 0 ? new JObject { ["value"] = rank, ["source"] = "TwitchTracker", ["scope"] = "worldwide", ["asOf"] = end, ["fetchedAt"] = fetchedAt } : null };
    }
    public static JObject ParseMetrics(string html, long fetchedAt)
    {
        int start = html.IndexOf("Performance this month", StringComparison.OrdinalIgnoreCase);
        if (start < 0) throw new Exception("Public performance section was not found; the page may have changed or blocked the request.");
        string section = html.Substring(start, Math.Min(12000, html.Length - start));
        MatchCollection dates = Matches(section, @"<time\b[^>]*datetime=[""'](\d{4}-\d{2}-\d{2})[^""']*[""']");
        if (dates.Count < 2) throw new Exception("Public reporting dates were not found.");
        string text = Plain(html);
        JObject s = new JObject { ["source"] = "TwitchMetrics", ["start"] = dates[0].Groups[1].Value, ["end"] = dates[1].Groups[1].Value, ["updated"] = Day(fetchedAt), ["fetchedAt"] = fetchedAt, ["periodBasis"] = "provider-reported",
            ["gain"] = Stat(section, "follower change", true), ["watched"] = Stat(section, "viewer hours", false), ["peak"] = Stat(section, "peak viewers", false), ["hours"] = Stat(section, "hours live", false),
            ["average"] = CaptureNumber(text, @"MDA009 streamed for [\d,.]+ hours, generating [\d,.]+ hours watched, averaging ([\d,.]+) viewers"),
            ["followers"] = CaptureNumber(text, @"MDA009 has ([\d,]+) followers on Twitch") };
        Match category = Match(text, @"MDA009 is ranked #([\d,]+) for (.{1,80}?) on Twitch\.");
        if (category.Success) { s["categoryRank"] = ParseNumber(category.Groups[1].Value, false); s["category"] = category.Groups[2].Value; }
        Validate(s);
        JArray streams = new JArray(); string warning = "";
        try
        {
            int history = html.IndexOf("Stream History", StringComparison.OrdinalIgnoreCase);
            if (history < 0) throw new Exception("Recent stream list was not found.");
            string[] blocks = Regex.Split(html.Substring(history), @"<li class=""list-group-item d-block"">", RegexOptions.IgnoreCase, TimeSpan.FromSeconds(2));
            foreach (string block in blocks.Skip(1).Take(30))
            {
                Match date = Match(block, @"<time\b[^>]*datetime=[""'](\d{4}-\d{2}-\d{2})[^""']*[""']");
                Match duration = Match(Plain(block), @"streamed for\s+(?:(\d+(?:\.\d+)?)\s+hours?\s*)?(?:(\d+(?:\.\d+)?)\s+minutes?)?");
                double hours = (duration.Groups[1].Success ? ParseNumber(duration.Groups[1].Value, false) : 0) + (duration.Groups[2].Success ? ParseNumber(duration.Groups[2].Value, false) / 60 : 0);
                double avg = CaptureNumber(block, @"stat-number[^>]*>\s*([\d,]+)\s*</div>\s*<span[^>]*>avg viewers"), peak = CaptureNumber(block, @"stat-number[^>]*>\s*([\d,]+)\s*</div>\s*<span[^>]*>peak viewers");
                if (!date.Success || hours <= 0 || hours > 720 || avg > peak || date.Groups[1].Value.CompareTo(Day(fetchedAt)) > 0) throw new Exception("Recent stream format changed.");
                string categories = String.Join(" / ", Matches(block.Split(new [] { "<!-- Modal -->" }, StringSplitOptions.None)[0], @"<a\b[^>]*class=""link-natural""[^>]*>(.*?)</a>").Cast<Match>().Select(m => Plain(m.Groups[1].Value)).Distinct());
                streams.Add(new JObject { ["date"] = date.Groups[1].Value, ["category"] = categories.Length > 80 ? categories.Substring(0,80) : categories, ["average"] = avg, ["peak"] = peak, ["hours"] = hours });
            }
            if (streams.Count == 0) warning = "No public recent stream rows were available; saved stream logs were retained.";
        }
        catch { streams = new JArray(); warning = "Recent stream rows could not be read; saved stream logs were retained."; }
        return new JObject { ["snapshot"] = s, ["streams"] = streams.Count > 0 ? new JObject { ["source"] = "TwitchMetrics", ["updated"] = Day(fetchedAt), ["rows"] = streams } : null, ["warning"] = warning };
    }
    private static void Validate(JObject s)
    {
        DateTime start, end;
        if (!DateTime.TryParseExact((string)s["start"], "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out start) || !DateTime.TryParseExact((string)s["end"], "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out end) || (end-start).TotalDays != 30 || end > DateTime.ParseExact((string)s["updated"], "yyyy-MM-dd", CultureInfo.InvariantCulture)) throw new Exception("Source did not provide a valid 30-day reporting window.");
        foreach (string k in new [] { "peak", "followers", "gain" }) if ((double)s[k] != Math.Truncate((double)s[k])) throw new Exception("Source returned a non-integer " + k + ".");
        if ((double)s["average"] > (double)s["peak"] || (double)s["hours"] > 720 || (double)s["followers"] - (double)s["gain"] < 0) throw new Exception("Source returned inconsistent performance figures.");
    }
    private static double Required(JObject j, string key, bool signed = false)
    {
        JToken value = j[key];
        if (value == null || (value.Type != JTokenType.Integer && value.Type != JTokenType.Float)) throw new Exception("Source field '" + key + "' is missing or changed.");
        return ParseNumber(value.ToString(), signed);
    }
    private static double ParseNumber(string text, bool signed)
    {
        text = text.Trim().Replace("\u2212", "-"); double value;
        if (!Regex.IsMatch(text, @"^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$") || !Double.TryParse(text, NumberStyles.Number | NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture, out value) || Double.IsNaN(value) || Double.IsInfinity(value) || Math.Abs(value) > 1e12 || (!signed && value < 0)) throw new Exception("Unexpected numeric format in public data.");
        return value;
    }
    private static double Stat(string html, string label, bool signed)
    {
        Match match = Match(html, @">\s*" + Regex.Escape(label) + @"\s*</div>\s*<div[^>]*>\s*<samp[^>]*>(.*?)</samp>");
        if (!match.Success) throw new Exception("Public field '" + label + "' was not found.");
        double value = ParseNumber(Plain(match.Groups[1].Value), signed);
        if (signed && match.Groups[1].Value.Contains("fa-caret-down")) value = -Math.Abs(value);
        return value;
    }
    private static double CaptureNumber(string text, string pattern) { Match m = Match(text, pattern); if (!m.Success) throw new Exception("Public numeric field was not found; source format may have changed."); return ParseNumber(m.Groups[1].Value, false); }
    private static Match Match(string text, string pattern) { return Regex.Match(text, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline, TimeSpan.FromSeconds(2)); }
    private static MatchCollection Matches(string text, string pattern) { return Regex.Matches(text, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline, TimeSpan.FromSeconds(2)); }
    private static string Plain(string html) { return Regex.Replace(WebUtility.HtmlDecode(Regex.Replace(html, @"<[^>]*>", " ", RegexOptions.Singleline, TimeSpan.FromSeconds(2))), @"\s+", " ").Trim(); }
    private static string Day(long time) { return DateTimeOffset.FromUnixTimeMilliseconds(time).UtcDateTime.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture); }
    private static long Now() { return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(); }
    private void Reply(JObject data) { CPH.WebsocketBroadcastJson(data.ToString(Formatting.None)); }
}
