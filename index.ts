import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import loadEvents from "./utils/loadEvents";
import { logger } from "./utils/logger";

logger("event", "Starting SSH Bot session...");
logger("info", `Running version v${process.env.npm_package_version} on Node.js ${process.version} on ${process.platform} ${process.arch}`);
logger("info", "Check out the source code at https://github.com/igorkowalczyk/discord-ssh!");
logger("info", "Don't forget to star the repository, it helps a lot!");

try {
 const client = new Client({
  allowedMentions: {
   parse: ["users", "roles"],
   repliedUser: false,
  },
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
 });

 logger("info", "Loading events...");
 await loadEvents(client);

 logger("info", "Logging in...");

 await client.login(process.env.TOKEN);
} catch (error) {
 logger("error", `Error starting the bot: ${error}`);
 process.exit(1);
}

process.on("unhandledRejection", async (reason) => {
 return logger("error", `Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", async (err) => {
 return logger("error", `Uncaught Exception: ${err}`);
});
