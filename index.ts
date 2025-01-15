import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import loadEvents from "@/utils/loadEvents";
import { Logger } from "@/utils/logger";

Logger("event", "Starting SSH Bot session...");
Logger("info", `Running version v${process.env.npm_package_version} on Node.js ${process.version} on ${process.platform} ${process.arch}`);
Logger("info", "Check out the source code at https://github.com/igorkowalczyk/discord-ssh!");
Logger("info", "Don't forget to star the repository, it helps a lot!");

try {
 const client = new Client({
  allowedMentions: {
   parse: ["users", "roles"],
   repliedUser: false,
  },
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
 });

 Logger("info", "Loading events...");
 await loadEvents(client);

 Logger("info", "Logging in...");

 await client.login(process.env.TOKEN);
} catch (error) {
 Logger("error", `Error starting the bot: ${error}`);
 throw error;
}

process.on("unhandledRejection", (reason) => {
 return Logger("error", `Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
 return Logger("error", `Uncaught Exception: ${err}`);
});
