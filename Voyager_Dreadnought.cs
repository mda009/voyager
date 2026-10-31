// Voyager Dreadnought v1 - chat co-op boss fight events for the Voyager host (Voyager 2.17).
// Action name: Voyager - Dreadnought. One Core > C# > Execute C# Code sub-action (this whole file).
// Queue: a dedicated "Voyager Dreadnought" queue, Blocking OFF is fine; action Concurrent OFF.
// Triggers (add each one to this action):
//   Core > Commands > Command Triggered: !join and !fire (everyone), !dreadnought (set to Moderators/Broadcaster).
//   Twitch > Cheer, Twitch > Subscriptions > Gift Subscription, Twitch > Subscriptions > Gift Bomb.
//   YouTube > Super Chat, YouTube > Super Sticker, YouTube > Membership Gift.
//   Kick > Gift Subscription, Kick > Mass Gift Subscription.
// It only tells the Voyager host what happened (WebSocket broadcast). The host decides whether a fight is running,
// works out damage and pays the same victory points to every pilot. It never changes points, tickets or giveaways.
using System;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    public bool Execute()
    {
        try
        {
            // The Voyager host runs this action with bossSay to post fight updates in chat.
            string say = Read("bossSay");
            if (say.Length > 0) { Say(say.Length > 450 ? say.Substring(0, 450) : say); return true; }
            if (Flag("isTest") || Flag("isFromSharedChatGuest")) return true;
            string type = CPH.GetEventType().ToString();
            string command = Read("command").Trim().ToLowerInvariant();
            JObject ev = null;
            if (command.Length > 0)
            {
                // commandSource on current Streamer.bot; older builds only give userType / eventSource.
                string platform = Read("commandSource").Trim().ToLowerInvariant();
                if (platform.Length == 0) platform = Read("userType").Trim().ToLowerInvariant();
                if (platform.Length == 0) platform = Read("eventSource").Trim().ToLowerInvariant();
                if (platform.Length == 0) platform = "twitch";
                if (platform != "twitch" && platform != "youtube" && platform != "kick") return true;
                if (command.IndexOf(' ') > 0) command = command.Substring(0, command.IndexOf(' '));
                string kind = command == "!join" ? "join" : command == "!fire" ? "fire" : command == "!dreadnought" ? "call" : "";
                if (kind.Length == 0) return true;
                ev = Event(kind, platform, 0);
                if (kind == "call") { long role = ArgNumber("role"); ev["role"] = role; ev["broadcaster"] = Flag("isBroadcaster") || role >= 4; }
            }
            else if (type == "TwitchCheer") ev = Event("bits", "twitch", ArgNumber("bits"));
            else if (type == "TwitchGiftSub") { if (Flag("fromSubBomb")) return true; ev = Event("gift", "twitch", 1); }
            else if (type == "TwitchGiftBomb") ev = Event("gift", "twitch", ArgNumber("gifts"));
            else if (type == "YouTubeSuperChat" || type == "YouTubeSuperSticker")
            {
                // 1.00 of the viewer's currency counts like 100 bits (microAmount is millionths of a unit).
                long micro = ArgNumber("microAmount");
                ev = Event("bits", "youtube", micro > 0 ? micro / 10000 : 0);
            }
            else if (type == "YouTubeMembershipGift") ev = Event("gift", "youtube", ArgNumber("count"));
            else if (type == "KickGiftSubscription" || type == "KickMassGiftSubscription")
            {
                // Kick can report the same gifts as a mass gift and as single gifts: send recipient receipts so each counts once.
                string at = Read("subscribedAt"); var receipts = new JArray();
                if (type == "KickGiftSubscription") { string r = Read("recipient.userId"); if (r.Length > 0) receipts.Add("kick:" + r + ":" + at); }
                else
                {
                    long count = ArgNumber("count"); if (count < 1 || count > 10000) return true;
                    for (int i = 0; i < count; i++) { string r = Read("recipient." + i + ".userId"); if (r.Length > 0) receipts.Add("kick:" + r + ":" + at); }
                }
                ev = Event("gift", "kick", type == "KickGiftSubscription" ? 1 : ArgNumber("count"));
                if (receipts.Count > 0) ev["receipts"] = receipts;
            }
            if (ev == null) return true;
            if ((string)ev["kind"] != "join" && (string)ev["kind"] != "fire" && (string)ev["kind"] != "call" && (long)ev["amount"] <= 0) return true;
            if (Flag("anonymous")) { ev["userId"] = ""; ev["login"] = ""; ev["name"] = "Anonymous"; }
            CPH.WebsocketBroadcastJson(ev.ToString(Formatting.None));
            return true;
        }
        catch (Exception ex) { CPH.LogWarn("[Voyager Dreadnought] " + ex.Message); return false; }
    }
    private JObject Event(string kind, string platform, long amount)
    {
        string name = Read("user"); if (name.Length == 0) name = Read("userName");
        return new JObject
        {
            ["type"] = "voyager.boss.event", ["v"] = 1, ["id"] = Guid.NewGuid().ToString("N"), ["kind"] = kind, ["platform"] = platform,
            ["userId"] = Read("userId"), ["login"] = Read("userName").TrimStart('@').ToLowerInvariant(), ["name"] = name, ["amount"] = Math.Max(0, amount)
        };
    }
    private void Say(string message)
    {
        foreach (string platform in new[] { "twitch", "youtube", "kick" })
        {
            try
            {
                if (platform == "twitch") CPH.SendMessage(message, true, true);
                else if (platform == "kick") CPH.SendKickMessage(message, true, true);
                else
                {
                    var broadcasts = CPH.YouTubeGetMonitoredBroadcasts();
                    if (broadcasts == null || broadcasts.Count != 1) continue;
                    CPH.SendYouTubeMessageToLatestMonitored(message, true, true);
                }
            }
            catch (Exception ex) { CPH.LogWarn("[Voyager Dreadnought] " + platform + " message failed: " + ex.Message); }
        }
    }
    private long ArgNumber(string key) { long n; return Int64.TryParse(Read(key), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) && n >= 0 ? n : -1; }
    private bool Flag(string key) { bool value; return Boolean.TryParse(Read(key), out value) && value; }
    private string Read(string key) { object value; return CPH.TryGetArg<object>(key, out value) && value != null ? Convert.ToString(value, CultureInfo.InvariantCulture) : ""; }
}
// End of Voyager Dreadnought v1.
