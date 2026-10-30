// Action name: Voyager - Command Manager. One Execute C# Code sub-action only. No triggers.
// Optional: lets Voyager Control > Chat commands turn Streamer.bot commands on and off.
// It only enables or disables an existing command by its ID; it never creates, renames or deletes one.
using System;
using Newtonsoft.Json;

public class CPHInline
{
    public bool Execute()
    {
        string requestId = Read("requestId"), id = Read("commandId"), enabled = Read("enabled").ToLowerInvariant();
        try
        {
            Guid parsed;
            if (!Guid.TryParse(requestId, out parsed)) throw new Exception("Open Voyager Control > Chat commands to use this action.");
            if (!Guid.TryParse(id, out parsed)) throw new Exception("Unknown command ID.");
            if (enabled != "true" && enabled != "false") throw new Exception("Choose on or off.");
            if (enabled == "true") CPH.EnableCommand(id); else CPH.DisableCommand(id);
            Reply(requestId, id, enabled == "true", "");
            return true;
        }
        catch (Exception ex)
        {
            CPH.LogError("[Voyager Commands] " + ex.Message);
            Reply(requestId, id, enabled == "true", ex.Message);
            return false;
        }
    }
    private void Reply(string requestId, string id, bool enabled, string error)
    {
        CPH.WebsocketBroadcastJson(JsonConvert.SerializeObject(new { type = "voyager.commands.result.v1", requestId = requestId, commandId = id, enabled = enabled, ok = error.Length == 0, error = error }));
    }
    private string Read(string name) { object value; return CPH.TryGetArg<object>(name, out value) && value != null ? Convert.ToString(value) : ""; }
}
// End of Voyager Command Manager v1.
