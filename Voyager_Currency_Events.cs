using System;
using System.Collections.Generic;
using StreamUP;
using Newtonsoft.Json;

public class CPHInline
{
    public StreamUpLib SUP;
    public void Init()
    {
        SUP = new StreamUpLib(CPH, "sup045");
        SUP.SetGenericCurrencyTriggers();
    }

    public bool Execute()
    {
        // Watchtime is handled before per-chatter event logic.
        EventType watchtimeEvent = CPH.GetEventType();
        if (watchtimeEvent == EventType.TwitchPresentViewers || watchtimeEvent == EventType.YouTubePresentViewers || watchtimeEvent == EventType.KickPresentViewers)
            return VoyagerWatchtime();

        //# Settings
        var settings = SUP.GetTypedSettings<CurrencySettings>();
        string pointsName = settings.Points_Name;
        string pointsVar = settings.Points_Var;
        int cooldownChatPoints = settings.Generic_ChatCooldown;
        bool boostUsers = settings.User_Boosts;
        bool boostSubs = settings.Sub_Boost;
        bool excludeUsers = settings.Exclude_Users;
        double boostMultiplier = settings.Boost_Amount;
        string boostedName = settings.Boosted_Group;
        string excludedName = settings.Excluded_Group;
        string user = SUP.TryGetArgOrDefault("user", "CodeWithTD");
        string userId = SUP.TryGetArgOrDefault("userId", "535833752");
        string userType = SUP.TryGetArgOrDefault("userType", "twitch");
        Enum.TryParse(userType, true, out Platform platform);
        if (excludeUsers && CPH.UserIdInGroup(userId, platform, excludedName))
        {
            return false;
        }

        long pointsToAdd = 0;
        //# This is getting the Event Type
        EventType eventName = CPH.GetEventType();
        // Try Handle Chat Messages First.
        if (eventName == EventType.TwitchChatMessage || eventName == EventType.YouTubeMessage || eventName == EventType.KickChatMessage)
        {
            DateTime lastRun = SUP.GetUserVariableById<DateTime>(userId, "supCurrencyChatMessageLastRan", platform, false, DateTime.Now.AddDays(-1));
            if (lastRun < DateTime.Now.AddSeconds(-cooldownChatPoints))
            {
                SUP.SetUserVariableById(userId, "supCurrencyChatMessageLastRan", DateTime.Now, platform, false);
            }
            else
            {
                return false;
            }
        }

        
        //# Get Event points
        long eventPoints = SUP.GetEventPoints(eventName, platform, settings);

        bool subbed = SUP.IsUserPaidMember(userId, platform);
        if (eventName != EventType.TwitchChatMessage && eventName != EventType.YouTubeMessage && eventName != EventType.KickChatMessage)
        {
            SUP.LogInfo($"[Currency System Admin] - [Events] - '{user}'/'{userId}/{platform}' '{eventName}' Points to Add Logged as {eventPoints}");
        }

        if ((subbed && boostSubs) || (boostUsers && CPH.UserIdInGroup(userId, platform, boostedName)))
        {
            eventPoints = (long)Math.Ceiling(eventPoints * boostMultiplier);
        }

        
        // Voyager: a label around this existing write. Native events capture the amounts.
        try {
            CPH.SetArgument("voyagerMovementScope", "current");
            CPH.SetArgument("voyagerMovementPlatform", userType.ToLowerInvariant());
            CPH.SetArgument("voyagerMovementUserId", userId);
            CPH.SetArgument("voyagerMovementReason", "reward");
            CPH.SetArgument("voyagerMovementAction", "StreamUP / " + eventName.ToString());
            CPH.SetArgument("voyagerMovementDelta", eventPoints);
            CPH.ExecuteMethod("Voyager Points Ledger", "BeginMovement");
        } catch (Exception auditError) { CPH.LogWarn("Voyager label start: " + auditError.Message); }
        SUP.AddUserPointsById(userId, platform, eventPoints, pointsVar);
        try { CPH.ExecuteMethod("Voyager Points Ledger", "EndMovement"); }
        catch (Exception auditError) { CPH.LogWarn("Voyager label end: " + auditError.Message); }
        
        return true;
    }

    // Voyager watchtime v1.0. Both currency paths enter this one method.
    // Non-persisted progress prevents credit for time while Streamer.bot is closed.
    private static readonly object VoyagerWatchtimeLock = new object();
    private const long VoyagerWatchtimeIntervalMs = 600000L;
    private const long VoyagerWatchtimeMaximumGapMs = 660000L;
    private const string VoyagerWatchtimeField = "points";

    public class VoyagerWatchtimeState
    {
        public long LastSeenAt = 0;
        public Dictionary<string, long> StartedAt = new Dictionary<string, long>();
    }

    public bool VoyagerWatchtime()
    {
        bool isTest;
        if (CPH.TryGetArg<bool>("isTest", out isTest) && isTest) return true;
        bool isLive;
        if (!CPH.TryGetArg<bool>("isLive", out isLive))
        {
            CPH.LogWarn("[Voyager Watchtime] Missing isLive; no points awarded.");
            return false;
        }
        string platformName = "";
        string eventName = CPH.GetEventType().ToString();
        if (eventName == "TwitchPresentViewers") platformName = "twitch";
        else if (eventName == "YouTubePresentViewers") platformName = "youtube";
        else if (eventName == "KickPresentViewers") platformName = "kick";
        // ExecuteMethod may expose the caller's original source through arguments.
        if (platformName.Length == 0)
        {
            CPH.TryGetArg<string>("eventSource", out platformName);
            platformName = (platformName ?? "").ToLowerInvariant();
        }
        if (platformName != "twitch" && platformName != "youtube" && platformName != "kick")
        {
            CPH.LogWarn("[Voyager Watchtime] Unsupported or missing platform; no points awarded.");
            return false;
        }
        Platform platform;
        if (!Enum.TryParse<Platform>(platformName, true, out platform)) return false;
        string stateKey = "voyagerWatchtime10mV1_" + platformName;
        lock (VoyagerWatchtimeLock)
        {
            try
            {
                if (!isLive)
                {
                    CPH.SetGlobalVar(stateKey, "", false);
                    return true;
                }
                List<Dictionary<string, object>> users;
                if (!CPH.TryGetArg<List<Dictionary<string, object>>>("users", out users) || users == null)
                {
                    CPH.SetGlobalVar(stateKey, "", false);
                    CPH.LogWarn("[Voyager Watchtime] Missing present viewers; progress paused.");
                    return false;
                }
                if (SUP == null) SUP = new StreamUpLib(CPH, "sup045");
                var settings = SUP.GetTypedSettings<CurrencySettings>();
                long now = (DateTime.UtcNow.Ticks - 621355968000000000L) / 10000L;
                string raw = CPH.GetGlobalVar<string>(stateKey, false);
                VoyagerWatchtimeState previous = null;
                if (!String.IsNullOrWhiteSpace(raw))
                {
                    try { previous = JsonConvert.DeserializeObject<VoyagerWatchtimeState>(raw); }
                    catch { CPH.LogWarn("[Voyager Watchtime] Invalid progress; starting a fresh 10-minute period."); }
                }
                if (previous == null || previous.StartedAt == null || now < previous.LastSeenAt || now - previous.LastSeenAt > VoyagerWatchtimeMaximumGapMs)
                    previous = new VoyagerWatchtimeState();
                var next = new VoyagerWatchtimeState();
                next.LastSeenAt = now;
                // Persist each reservation before its award so a second path cannot replay it
                // after a later user fails. Entries absent from this snapshot are dropped.
                foreach (var user in users)
                {
                    if (user == null) continue;
                    object rawId;
                    if (!user.TryGetValue("id", out rawId)) continue;
                    string id = Convert.ToString(rawId);
                    if (String.IsNullOrWhiteSpace(id) || next.StartedAt.ContainsKey(id)) continue;
                    if (settings.Exclude_Users && CPH.UserIdInGroup(id, platform, settings.Excluded_Group)) continue;
                    long startedAt;
                    if (!previous.StartedAt.TryGetValue(id, out startedAt) || startedAt > now || startedAt <= 0) startedAt = now;
                    next.StartedAt[id] = startedAt;
                }
                var due = new List<string>();
                foreach (string id in new List<string>(next.StartedAt.Keys))
                {
                    if (now - next.StartedAt[id] < VoyagerWatchtimeIntervalMs) continue;
                    next.StartedAt[id] = now;
                    due.Add(id);
                }
                // Reserve the whole batch before writes. Repeated events cannot replay it.
                CPH.SetGlobalVar(stateKey, JsonConvert.SerializeObject(next), false);
                foreach (string id in due)
                {
                    try
                    {
                        VoyagerWatchtimeLabelStart(platformName, id);
                        // Fixed +1; subscriber/group boosts do not multiply watchtime.
                        SUP.AddUserPointsById(id, platform, 1L, VoyagerWatchtimeField);
                        CPH.LogInfo("[Voyager Watchtime] +1 point / 10 minutes: " + platformName + ":" + id);
                    }
                    catch (Exception awardError)
                    {
                        // Do not retry an ambiguous write and risk crediting it twice.
                        CPH.LogWarn("[Voyager Watchtime] Award failed or uncertain for " + platformName + ":" + id + ": " + awardError.Message);
                    }
                    finally
                    {
                        try { CPH.ExecuteMethod("Voyager Points Ledger", "EndMovement"); }
                        catch (Exception auditError) { CPH.LogWarn("[Voyager Watchtime] Label end: " + auditError.Message); }
                    }
                }
                return true;
            }
            catch (Exception error)
            {
                CPH.LogWarn("[Voyager Watchtime] " + error.Message);
                return false;
            }
        }
    }

    private void VoyagerWatchtimeLabelStart(string platform, string id)
    {
        try
        {
            CPH.SetArgument("voyagerMovementScope", "current");
            CPH.SetArgument("voyagerMovementPlatform", platform);
            CPH.SetArgument("voyagerMovementUserId", id);
            CPH.SetArgument("voyagerMovementReason", "reward");
            CPH.SetArgument("voyagerMovementAction", "Watchtime / 1 point per 10 minutes");
            CPH.SetArgument("voyagerMovementDelta", 1L);
            CPH.SetArgument("voyagerFlowId", "");
            CPH.ExecuteMethod("Voyager Points Ledger", "BeginMovement");
        }
        catch (Exception auditError) { CPH.LogWarn("[Voyager Watchtime] Label start: " + auditError.Message); }
    }

}
