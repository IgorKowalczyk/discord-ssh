import { ActivityType, Client, TextChannel } from "discord.js";
import { defaultConfig } from "@/config";
import { Logger } from "@/utils/logger";

export function ready(client: Client): void {
 try {
  Logger("ready", `Logged in as ${client.user?.tag}! (ID: ${client.user?.id})`);
  if (!defaultConfig.channel) return Logger("error", "Channel not found! Please check your CHANNEL_ID .env variable.");
  const channel = client.channels.cache.get(defaultConfig.channel) as TextChannel;
  Logger("ready", `Watching for commands in ${channel.guild.name}#${channel.name}`);
  client.user?.setActivity("👀 Watching all ports!", { type: ActivityType.Custom });
 } catch (error) {
  Logger("error", `Error setting activity: ${error}`);
 }
}
