// Create ONE action named exactly: Voyager - Broadcast Members
// Add Core > C# > Execute C# Code. Replace the entire editor with this file.
// Compile, Save and Compile, then enable the action. No trigger is required:
// the OBS overlay requests this action on connection and every 15 seconds.
// Requires Streamer.bot 0.2.5+ (also uses the documented 1.x APIs).
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

public class CPHInline
{
    public bool Execute()
    {
        string requestId = "";
        CPH.TryGetArg("voyagerRequestId", out requestId);
        var groups = new Dictionary<string, object>();
        groups["blue"] = ReadGroup("BLUE GROUP");
        groups["silver"] = ReadGroup("SILVER GROUP");
        groups["gold"] = ReadGroup("GOLD GROUP");
        groups["platinum"] = ReadGroup("PLATINUM GROUP");
        groups["vip"] = ReadGroup("VIP GROUP");
        var payload = new Dictionary<string, object>();
        payload["type"] = "voyager.members.v1";
        payload["requestId"] = requestId ?? "";
        payload["generatedAt"] = DateTime.UtcNow.ToString("o");
        payload["groups"] = groups;
        CPH.WebsocketBroadcastJson(JsonConvert.SerializeObject(payload));
        return true;
    }

    private object ReadGroup(string groupName)
    {
        var result = new Dictionary<string, object>();
        var members = new List<object>();
        result["groupName"] = groupName;
        result["exists"] = false;
        result["error"] = "";
        result["users"] = members;
        try
        {
            if (!CPH.GroupExists(groupName))
            {
                result["error"] = "Group not found: " + groupName;
                CPH.LogWarn("[Voyager Members] Group not found: " + groupName);
                return result;
            }
            result["exists"] = true;
            var users = CPH.UsersInGroup(groupName);
            if (users == null)
            {
                result["error"] = "Could not read group: " + groupName;
                return result;
            }
            foreach (var user in users)
            {
                if (user == null) continue;
                string name = String.IsNullOrWhiteSpace(user.Username) ? user.Login : user.Username;
                if (String.IsNullOrWhiteSpace(name)) continue;
                members.Add(new Dictionary<string, object>
                {
                    { "id", user.Id ?? "" },
                    { "platform", user.Type ?? "" },
                    { "login", user.Login ?? "" },
                    { "name", name }
                });
            }
        }
        catch (Exception ex)
        {
            result["error"] = "Unable to read group: " + groupName;
            CPH.LogError("[Voyager Members] " + groupName + ": " + ex.Message);
        }
        return result;
    }
}
