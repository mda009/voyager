// Voyager Goal FX v1.3 (Platinum target 200,000 from Voyager 2.20.40) - account reader with an explicit upgrade-animation hold.
// Keep its timer/trigger. Run every 2 seconds, Lines = 0, Repeat and Enabled on.
// Reads each account independently. Does not change points or send chat messages.
using System;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    private const int ObsConnection = 0; // Zero-based OBS connection index.
    private const string OverlaySource = "Voyager Goal FX"; // Exact OBS Browser Source name.

    // CONFIGURATION: your Silver screenshot confirms persisted user global points.
    // Silver is a long with value 72000. Gold/Platinum use the same store here.
    private const string PointsVariable = "points";
    private const bool PointsPersisted = true;
    private readonly string[] TierKeys = { "silver", "gold", "platinum" };
    private readonly string[] AccountLogins = {
        "mdavoyagersilver",
        "mdavoyagergold",
        "mdavoyagerplatinum" // ASSUMED from the naming pattern: confirm or change.
    };
    private readonly long[] PointTargets = { 72000L, 120000L, 200000L }; // Voyager 2.20.40: Platinum 200,000, matching the Points Ledger
    private string lastIssue = "";
    private DateTime lastStatusLog = DateTime.MinValue;

    public bool Execute()
    {
        JObject samples = new JObject();
        JArray issues = new JArray();
        for (int i = 0; i < TierKeys.Length; i++)
        {
            JObject sample = new JObject();
            string login = AccountLogins[i].Trim().ToLowerInvariant();
            sample["account"] = login;
            sample["variable"] = PointsVariable;
            sample["persisted"] = PointsPersisted;
            sample["identity"] = "twitch:" + login + ":" + PointsVariable + ":" + (PointsPersisted ? "persisted" : "temporary");
            sample["targetPoints"] = PointTargets[i];
            sample["points"] = JValue.CreateNull();
            try
            {
                if (String.IsNullOrWhiteSpace(login)) throw new Exception("Set this tier's account login in AccountLogins.");
                object raw = CPH.GetTwitchUserVar<object>(login, PointsVariable, PointsPersisted);
                if (raw == null)
                    throw new Exception("User global '" + PointsVariable + "' was not found in the " + (PointsPersisted ? "persisted" : "non-persisted") + " store. Confirm this account, variable name and store in Streamer.bot.");
                decimal points;
                string text = Convert.ToString(raw, CultureInfo.InvariantCulture);
                // Use unformatted numbers, not a displayed percentage or locale-formatted string.
                if (raw is bool || !decimal.TryParse(text, NumberStyles.AllowLeadingSign | NumberStyles.AllowDecimalPoint | NumberStyles.AllowLeadingWhite | NumberStyles.AllowTrailingWhite, CultureInfo.InvariantCulture, out points) || points < 0 || points > 9007199254740991m)
                    throw new Exception("The point variable must contain a non-negative number, e.g. 72000, without commas or a % sign.");
                sample["points"] = points;
            }
            catch (Exception ex)
            {
                string issue = TierKeys[i] + " / " + login + ": " + ex.Message;
                sample["error"] = issue;
                issues.Add(issue);
            }
            samples[TierKeys[i]] = sample;
        }

        // Only release queued celebrations while the overlay is in Program.
        bool? overlayActive = null;
        try
        {
            JObject request = new JObject();
            request["sourceName"] = OverlaySource;
            JObject data = ReadObs("GetSourceActive", request);
            if (data["videoActive"] == null) throw new Exception("OBS returned no videoActive field.");
            overlayActive = (bool)data["videoActive"];
        }
        catch (Exception ex) { issues.Add("Overlay visibility: " + ex.Message + " Check OverlaySource and ObsConnection near the top of the C# code."); }

        JObject packet = new JObject();
        packet["channel"] = "mda009.voyager.goals";
        packet["schema"] = 3;
        packet["bridgeVersion"] = "1.3";
        packet["sampleId"] = Guid.NewGuid().ToString("N");
        packet["timestamp"] = DateTime.UtcNow.ToString("o");
        packet["overlayActive"] = JToken.Parse(overlayActive.HasValue ? (overlayActive.Value ? "true" : "false") : "null");
        packet["upgradeGate"] = ReadUpgradeGate(issues);
        packet["samples"] = samples;
        packet["issues"] = issues;
        CPH.WebsocketBroadcastJson(packet.ToString(Formatting.None));

        string issueText = issues.ToString(Formatting.None);
        if (issueText != lastIssue)
        {
            lastIssue = issueText;
            if (issues.Count > 0) CPH.LogWarn("Voyager Goal FX 1.3: " + issueText);
        }
        if ((DateTime.UtcNow - lastStatusLog).TotalSeconds >= 30)
        {
            lastStatusLog = DateTime.UtcNow;
            CPH.LogInfo("Voyager Goal FX 1.3: overlayActive=" + (overlayActive.HasValue ? overlayActive.Value.ToString() : "unknown") + "; account readings=" + samples.ToString(Formatting.None));
        }
        return true;
    }

    private JObject ReadUpgradeGate(JArray issues)
    {
        const string key = "mda009_voyager_upgrade_gate";
        try
        {
            string saved = CPH.GetGlobalVar<string>(key, false);
            if (String.IsNullOrWhiteSpace(saved))
            {
                JObject initial = new JObject();
                initial["revision"] = DateTime.UtcNow.Ticks / 10000L;
                initial["busy"] = false;
                saved = initial.ToString(Formatting.None);
                CPH.SetGlobalVar(key, saved, false);
            }
            JObject gate = JObject.Parse(saved);
            if (gate["revision"] == null || gate["busy"] == null) throw new Exception("Invalid upgrade-hold state.");
            return gate;
        }
        catch (Exception ex)
        {
            issues.Add("Upgrade hold: " + ex.Message);
            // A missing/invalid gate makes the overlay hold until a good sample arrives.
            return null;
        }
    }

    private JObject ReadObs(string requestType, JObject requestData)
    {
        string raw = CPH.ObsSendRaw(requestType, requestData.ToString(Formatting.None), ObsConnection);
        if (string.IsNullOrWhiteSpace(raw)) throw new Exception("No OBS response. Check Streamer.bot's OBS connection.");
        JObject root = JObject.Parse(raw);
        JObject envelope = root["d"] as JObject ?? root;
        JObject status = envelope["requestStatus"] as JObject;
        if (status != null && (bool?)status["result"] == false)
            throw new Exception((string)status["comment"] ?? "OBS request failed.");
        return envelope["responseData"] as JObject ?? envelope;
    }
}
