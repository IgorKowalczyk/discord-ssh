import { ActivityType, Client, TextChannel } from "discord.js";
import { logger } from "../../utils/logger.js";
import { defaultConfig } from "../../config.js";

export async function ready(client: Client): Promise<void> {
 try {
  logger("ready", `Logged in as ${client.user?.tag}! (ID: ${client.user?.id})`);
  if (!defaultConfig.channel) return logger("error", "Channel not found! Please check your CHANNEL_ID .env variable.");
  const channel = client.channels.cache.get(defaultConfig.channel) as TextChannel;
  logger("ready", `Watching for commands in ${channel.guild.name}#${channel.name}`);
  client.user?.setActivity("👀 Watching all ports!", { type: ActivityType.Custom });
 } catch (error) {
  logger("error", `Error setting activity: ${error}`);
 }
}
