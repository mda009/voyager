// A minimal stand-in for Streamer.bot's CPH object: enough to compile and run Voyager's actions in CI.
// It records chat messages and keeps global variables in memory. It is never shipped.
using System;
using System.Collections.Generic;

public enum FakeEventType { Unknown, CommandTriggered }
public class FakeGroupUser { public string Id, Login, Username, Type; }
public class FakeTwitchUser { public string ProfileImageUrl = ""; }
public class FakeCph
{
    public Dictionary<string, object> Globals = new Dictionary<string, object>();
    public Dictionary<string, object> Args = new Dictionary<string, object>();
    public Dictionary<string, List<FakeGroupUser>> Groups = new Dictionary<string, List<FakeGroupUser>>();
    public List<string> Chat = new List<string>(), Broadcasts = new List<string>(), Errors = new List<string>();
    public FakeEventType EventType = FakeEventType.Unknown;
    public FakeEventType GetEventType() { return EventType; }
    public T GetGlobalVar<T>(string name, bool persisted = true) { object v; return Globals.TryGetValue(name, out v) ? (T)v : default(T); }
    public void SetGlobalVar(string name, object value, bool persisted = true) { Globals[name] = value; }
    public bool TryGetArg<T>(string name, out T value) { object v; if (Args.TryGetValue(name, out v) && v is T) { value = (T)v; return true; } value = default(T); return false; }
    public void LogError(string m) { Errors.Add(m); }
    public void LogInfo(string m) { }
    public void LogWarn(string m) { }
    public void LogDebug(string m) { }
    public void SendMessage(string m, bool bot = true, bool fallback = true) { Chat.Add("twitch:" + m); }
    public void SendKickMessage(string m, bool bot = true, bool fallback = true) { Chat.Add("kick:" + m); }
    public void SendYouTubeMessage(string m, bool bot, bool fallback, string id) { Chat.Add("youtube:" + m); }
    public void SendYouTubeMessageToLatestMonitored(string m, bool bot = true, bool fallback = true) { Chat.Add("youtube:" + m); }
    public List<object> YouTubeGetMonitoredBroadcasts() { return new List<object>(); }
    public FakeTwitchUser TwitchGetExtendedUserInfoById(string id) { return new FakeTwitchUser(); }
    public bool GroupExists(string g) { return Groups.ContainsKey(g); }
    public List<FakeGroupUser> UsersInGroup(string g) { return Groups.ContainsKey(g) ? Groups[g] : null; }
    public void WebsocketBroadcastJson(string json) { Broadcasts.Add(json); }
    public bool EnableCommandById(string id) { return true; }
    public bool DisableCommandById(string id) { return true; }
    public void EnableCommand(string id) { }
    public void DisableCommand(string id) { }
}
public class CphBase { public FakeCph CPH = new FakeCph(); }
