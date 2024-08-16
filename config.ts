import type { ColorResolvable } from "discord.js";

export const defaultConfig = {
 channel: process.env.CHANNEL_ID, // Channel ID
 token: process.env.TOKEN, // Discord bot token
 cwd: process.env.CUSTOM_CWD || process.cwd(), // Custom working directory
 owners: [...(process.env.OWNERS_IDS?.split(",") ?? [])], // Array of owners IDs (separated by commas)
 embedColor: [88, 101, 242] as ColorResolvable, // Discord's blurple
 emojis: {
  loading: "<a:loading:895227261752582154>", // https://cdn.discordapp.com/emojis/895227261752582154.gif?v=1
  output: "📤",
  error: "❌",
  change: "↪️",
 },
 debugger: {
  changeDir: true, // Displays the directory change in the terminal
  showCommand: true, // Displays the command run in the terminal
  moritoringUpdates: false, // Displays the monitoring updates in the terminal (every 5 seconds)
  displayEventList: false, // Displays the event list in the terminal
 },
};
