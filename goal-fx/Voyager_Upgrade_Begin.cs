// Voyager v1.3: begin the hold around the existing upgrade media sequence.
// Installed automatically by Voyager_Sequencing_Fix.sb. Do not add it twice.
using System;
using System.Globalization;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    public bool Execute()
    {
        const string key = "mda009_voyager_upgrade_gate";
        long revision = DateTime.UtcNow.Ticks / 10000L;
        string prior = CPH.GetGlobalVar<string>(key, false);
        if (!String.IsNullOrWhiteSpace(prior))
        {
            try { revision = Math.Max(revision, ((long?)JObject.Parse(prior)["revision"] ?? 0L) + 1L); }
            catch { }
        }
        string gate = "{\"revision\":" + revision.ToString(CultureInfo.InvariantCulture) + ",\"busy\":true}";
        CPH.SetGlobalVar(key, gate, false);
        CPH.WebsocketBroadcastJson("{\"channel\":\"mda009.voyager.goals\",\"schema\":3,\"kind\":\"upgrade-gate\",\"upgradeGate\":" + gate + "}");
        CPH.Wait(1000); // Allow the overlay to stop before the media sources are shown.
        return true;
    }
}
