using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Net;

public class CPHInline
{
    // Voyager labels only; all original currency writes below are preserved.
    private long WatchAmount() { long amount; CPH.TryGetArg<long>("pointsGivenPerTick", out amount); return amount; }
    private void AuditStart(string id, string platform, long? delta, string reason)
    {
        try {
            CPH.SetArgument("voyagerMovementScope", "current"); CPH.SetArgument("voyagerMovementPlatform", platform);
            CPH.SetArgument("voyagerMovementUserId", id); CPH.SetArgument("voyagerMovementReason", reason);
            CPH.SetArgument("voyagerMovementAction", reason == "reward" ? "Legacy Currency Core / watchtime" : "Legacy Currency Core / administrator adjustment");
            CPH.SetArgument("voyagerMovementDelta", delta);
            CPH.ExecuteMethod("Voyager Points Ledger", "BeginMovement");
        } catch (Exception e) { CPH.LogWarn("Voyager label start: " + e.Message); }
    }
    private void AuditEnd() { try { CPH.ExecuteMethod("Voyager Points Ledger", "EndMovement"); } catch (Exception e) { CPH.LogWarn("Voyager label end: " + e.Message); } }

    //VERSION CHECKING
    public void Init()
    {
        string url = "https://terrierdarts.co.uk/versions/core.json";
        string content;
        int installed = 5;
        using (WebClient client = new WebClient())
        {
            content = client.DownloadString(url);
        //client.Dispose(); This is a new line ive just added
        }

        bool check = int.TryParse(content, out int latest);
        if (check && latest > installed)
        {
            CPH.ShowToastNotification("PRODUCT OUT OF DATE", "CORE SYSTEM HAS HAD AN UPDATE", "Check The Log Search '[UDT]' for more info", "noIcon");
            CPH.LogInfo("[UDT] Core System Needs updating visit https://extensions.streamer.bot/docs?topic=49 to get the latest code");
        }
    }

    public bool SetPointsTwitch()
    {
        //Pull in info!
        CPH.TryGetArg("targetUserId", out string userId);
        CPH.TryGetArg("targetUser", out string user);
        CPH.TryGetArg("user", out string addedBy);
        long? amountToSet = GetPointsFromRawInput("input0");
        if(amountToSet == null)
        {
            return false;
        }
        //Set Points
        CPH.SetTwitchUserVarById(userId, "points", amountToSet, true);
        //Set Args For Output Message
        CPH.SetArgument("points", amountToSet);
        CPH.SetArgument("addedBy", addedBy);
        CPH.SetArgument("addedTo", user);
        CPH.LogInfo($"[Points Admin] [Set Points] Twitch - Set {user}({userId}) by {addedBy} => {amountToSet}");
        return true;
    }

    public bool AddPointsTwitch()
    {
        //Pull in info!
        CPH.TryGetArg("targetUserId", out string userId);
        CPH.TryGetArg("targetUser", out string user);
        CPH.TryGetArg("user", out string addedBy);
        long? amountToAdd = GetPointsFromRawInput("input0");
        //Add Points
        long? currentPoints = 0;
        currentPoints = GetUserPoints(userId,user,"twitch");
        if(currentPoints != null && amountToAdd != null)
        {
            long? newPoints = currentPoints + amountToAdd;
            AuditStart(userId, "twitch", amountToAdd, "adjustment");
            CPH.SetTwitchUserVarById(userId, "points", newPoints, true);
            AuditEnd();
            //Set Args For Output Message
            CPH.SetArgument("newPoints", newPoints);
            CPH.SetArgument("oldPoints", currentPoints);
            CPH.SetArgument("pointsAdded", amountToAdd);
            CPH.SetArgument("addedBy", addedBy);
            CPH.SetArgument("addedTo", user);
            CPH.LogInfo($"[Points Admin] [Add Points] Twitch - Added To {user} by {addedBy} => {currentPoints} + {amountToAdd} = {newPoints}");
        }else{

            return false;
        }

        return true;
    }

    public bool SetPointsYouTube()
    {
        string id;
        long? amountToSet = GetPointsFromRawInput("input0");
        if(amountToSet == null)
        {
            return false;
        }
        string varName = "points";
        bool persisted = true;
        CPH.TryGetArg("usersFound",out int usersFound);
        CPH.TryGetArg("targetUserName", out string target);
        for (int i = 0; i < usersFound; i++)
        {
            CPH.TryGetArg($"targetFoundUserId{i}", out id);
            //Get and Add Points
            CPH.SetYouTubeUserVarById(id, varName, amountToSet, persisted);
            //Log Info
            CPH.LogInfo($"[Points Admin] [Set Points] YouTube - {target}/{id} => {amountToSet}");
            //Set Arguments
            CPH.SetArgument("target", target);
            CPH.SetArgument("points", amountToSet);
			//Send Message
			//CPH.SendYouTubeMessage($"{target} has been set to {pointsToAdd}");
        }

        return true;
    }
    public bool AddPointsYouTube()
    {
        string id;
        long? pointsToAdd = GetPointsFromRawInput("input0");
        if(pointsToAdd == null)
        {
            return false;
        }
        string varName = "points";
        bool persisted = true;
        CPH.TryGetArg("usersFound",out int usersFound);
        CPH.TryGetArg("targetUserName",out string target);
        int failCount = 0;
        long? newPoints = 0; 
        for (int i = 0; i < usersFound ; i++)
        {
        	CPH.TryGetArg($"targetFoundUserId{i}", out id);
        	//Get and Add Points
            long? points = GetUserPoints(id,target,"youtube",varName);
            if(points != null)
            {
                newPoints = pointsToAdd + points;
                AuditStart(id, "youtube", pointsToAdd, "adjustment");
            CPH.SetYouTubeUserVarById(id, varName,newPoints, persisted);
            AuditEnd();
                //Log Info
                CPH.LogInfo($"[Points Admin] [Add Points] YouTube - {target}/{id} => {points} + {pointsToAdd} = {newPoints}");

            }else{
                failCount +=1;
            }
        }
        if(failCount==usersFound)
        {
            CPH.LogError($"[Points Admin] [Add Points] YouTube - All found users had non numeric points values. Stopping action.");
        }else{
            //Set Arguments
            CPH.SetArgument("target", target);
            CPH.SetArgument("pointsToAdd",pointsToAdd);
            CPH.SetArgument("newPoints", newPoints);
        }
        return failCount<usersFound;
    }

    public bool SetPointsTrovo()
    {
        //Pull in info!
        CPH.TryGetArg("targetUserId", out string userId);
        CPH.TryGetArg("targetUser", out string user);
        CPH.TryGetArg("user", out string addedBy);
        long? amountToSet = GetPointsFromRawInput("input0");
        if(amountToSet == null)
        {
            return false;
        }
        //Add Points
        CPH.SetTrovoUserVar(user, "points", amountToSet, true);
        //Set Args For Output Message
        CPH.SetArgument("points", amountToSet);
        CPH.SetArgument("addedBy", addedBy);
        CPH.SetArgument("addedTo", user);
        CPH.LogInfo($"[Points Admin] [Add Points] Trovo - Set To {user} by {addedBy} => {amountToSet}");
        return true;
    }
    public bool AddPointsTrovo()
    {
        //Pull in info!
        CPH.TryGetArg("targetUserId", out string userId);
        CPH.TryGetArg("targetUser", out string user);
        CPH.TryGetArg("user", out string addedBy);
        long? amountToAdd = GetPointsFromRawInput("input0");
        
        //Add Points
        long? currentPoints = GetUserPoints(userId,user,"trovo");
        if(currentPoints != null && amountToAdd != null)
        {
            long? newPoints = currentPoints + amountToAdd;
            CPH.SetTrovoUserVar(user, "points", newPoints, true);
            //Set Args For Output Message
            CPH.SetArgument("newPoints", newPoints);
            CPH.SetArgument("oldPoints", currentPoints);
            CPH.SetArgument("pointsAdded", amountToAdd);
            CPH.SetArgument("addedBy", addedBy);
            CPH.SetArgument("addedTo", user);
            CPH.LogInfo($"[Points Admin] [Add Points] Trovo - Added To {user} by {addedBy} => {currentPoints} + {amountToAdd} = {newPoints}");
        }else{
            return false;
        }
        return true;
    }

    public bool ResetAllUserPoints()
    {
        CPH.UnsetAllUsersVar("points", true);
        CPH.LogInfo("[Points Admin] [Points Resetter] Points have been reset");
        return true;
    }
    public bool AddWatchPoints()
    {
        // Shared with StreamUP's Present Viewers handler: never pay twice.
        bool ok = CPH.ExecuteMethod("Currency System • Events", "VoyagerWatchtime");
        if (!ok) CPH.LogWarn("[Voyager Watchtime] Shared handler unavailable. Compile the updated Currency System • Events code.");
        return ok;
    }
    
    public long? GetUserPoints(string userId,string userName,string platform,string varName = "points")
    {
        long? points = null;
        try{
            switch(platform)
            {
                case "twitch":
                    points = CPH.GetTwitchUserVarById<long?>(userId, "points", true) ?? 0;
                    break;
                case "youtube":
                    points = CPH.GetYouTubeUserVarById<long?>(userId, "points", true) ?? 0;
                    break;
                case "trovo":
                    points = CPH.GetTrovoUserVarById<long?>(userId, "points", true) ?? 0;
                    break;
            }
        }catch(Exception e)
        {
            CPH.LogError($"[Points Admin] [Present Viewers] Error getting points value for {platform} user {userName}({userId})");
        }
        return points;
    }
    
    public void SetUserPoints(string userId, string platform, long? points)
    {
        if(points != null)
        {
            switch(platform)
            {
                case "twitch":
                    AuditStart(userId, "twitch", WatchAmount(), "reward");
            CPH.SetTwitchUserVarById(userId, "points", points, true);
            AuditEnd();
                    break;
                case "youtube":
                    AuditStart(userId, "youtube", WatchAmount(), "reward");
            CPH.SetYouTubeUserVarById(userId, "points", points, true);
            AuditEnd();
                    break;
                case "trovo":
                    CPH.SetTrovoUserVarById(userId, "points", points, true);
                    break;
            }
        }
    }

    public bool SendPlatformMessage()
    {
        CPH.TryGetArg("userType", out string platformString);
        Enum.TryParse(platformString, true, out Platform platform);
        CPH.TryGetArg("bot", out bool bot);
        CPH.TryGetArg("message", out string message);
        switch (platform)
        {
            case Platform.Twitch:
                CPH.SendMessage(message, bot);
                break;
            case Platform.YouTube:
                CPH.SendYouTubeMessage(message, bot);
                break;
            case Platform.Trovo:
                CPH.SendTrovoMessage(message, bot);
                break;
        }

        return true;
    }

    public long? GetPointsFromRawInput(string argName)
    {
        CPH.TryGetArg(argName, out string argOut);
        if(!Int64.TryParse(argOut, out long result))
        {
            CPH.LogError($"[Points Admin] Error parsing {argName} argument into numeric long.");
            return null;
        }
        return result;
    }

    public bool GetYouTubeTarget()
    {
        //Direct check if input0 is numeric at all if not cancel action
        long? input0 = GetPointsFromRawInput("input0");
        if(input0 == null)
        {
            return false;
        }
        //This is pulling in the Info Given
        CPH.TryGetArg("rawInput", out string rawInput);
        CPH.TryGetArg("inputsTaken", out long inputsToRemove);
        //This removes the '@' symbol if one was given
        //string atSignRemoved = rawInput.Replace("@", string.Empty);
        //This Removes Inputs we dont need
        string textRemove = "";
        for (int i = 0; i < inputsToRemove; i++)
        {
            CPH.TryGetArg("input" + i, out string moreInput);
            textRemove += moreInput;
        }

        //This now works out the username we are trying to find
        string youtubeUserName = rawInput.Remove(0, textRemove.Length + ((int)inputsToRemove + 1 - 1));
        if(youtubeUserName[0] == '@')
        {
            youtubeUserName = youtubeUserName.Remove(0,1);
        }
        //Sets the Argument
        CPH.SetArgument("targetUserName", youtubeUserName);
        //Logs the Info
        CPH.LogInfo($"[Points Admin] [Add Points] YouTube - Text Removed: {textRemove} => User To Hande: {youtubeUserName} ");
        //Creates a New List for the found users to go into.
        List<Tuple<string, string>> userList = new List<Tuple<string, string>>();
        //This pulls all the users who have Points
        List<UserVariableValue<string>> userPointsList = CPH.GetYouTubeUsersVar<string>("points", true);
        //This then goes through each one and works out if we have a match.
        foreach (UserVariableValue<string> userValue in userPointsList)
        {
            string username = userValue.UserLogin;
            if (youtubeUserName.ToLower() == username.ToLower())
            {
                //check wether the value is valid for long
                if(Int64.TryParse(userValue.Value, out _))
                {
                    userList.Add(new Tuple<string, string>(username, userValue.UserId));
                    CPH.LogInfo($"[Points Admin] YouTube - {username} with the ID  of {userValue.UserId} has been found");
                }else{
                    CPH.LogError($"[Points Admin] YouTube - {username} with the ID  of {userValue.UserId} has a not numeric points value. Needs to be fixed.");
                }

            }
        }

        //This Goes through list and sets arguments.
        int d = 0;
        foreach (Tuple<string, string> users in userList)
        {
            CPH.SetArgument("targetFoundUserName" + d, users.Item1);
            CPH.SetArgument("targetFoundUserId" + d, users.Item2);
            d+=1;
        }

        //This Just saves the count and logs info!
        CPH.SetArgument("usersFound", userList.Count);
        CPH.LogInfo($"[Points Admin] [Add Points] YouTube - {userList.Count} users have been found!");
        return true;
    }
}