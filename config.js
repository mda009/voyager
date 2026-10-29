// Edit in Notepad, save, then refresh the OBS browser source.
// This is Streamer.bot's WebSocket server, NOT the OBS WebSocket server.
window.VOYAGER_CONFIG = {
  host: "127.0.0.1",
  port: 8080,
  password: "",
  // Recommended: turn on Authentication in Streamer.bot (Servers/Clients >
  // WebSocket Server), put the same password above, then set this to true.
  // When true, Voyager pages refuse to connect to an unprotected Streamer.bot.
  // While false, control pages show a warning instead (never in OBS sources).
  requireAuthentication: false,
  path: "/",
  secure: false,
  actionName: "Voyager - Broadcast Members",
  actionId: "",
  refreshSeconds: 15,
  scrollSpeed: 22,
  layout: "columns", // columns, grid, or strip
  panelHeight: 550,
  // For Voyager_Callable_Panels.html: how long each called panel stays up.
  // 0 = stays visible until another group is called or !hidemembers is used.
  displaySeconds: 30,
  panelPosition: "right", // right, left, or center
  showHeader: true,
  showStatus: true,
  // Display each membership exactly as stored. Set true to show only the
  // highest tier for accounts that belong to more than one group.
  highestTierOnly: false
};
