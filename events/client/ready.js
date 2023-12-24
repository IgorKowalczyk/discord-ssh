import { ActivityType } from "discord.js";
import { defaultConfig } from "../../config.js";
import { logger } from "../../utils/logger.js";

/**
 * Handles the ready event.
 *
 * @param {object} client The Discord client.
 * @returns {Promise<void>}
 */
export async function ready(client) {
 try {
  defaultConfig.channel = client.channels.cache.get(defaultConfig.channel);
  if (!defaultConfig.channel) return logger("error", "Channel not found! Please check your CHANNEL_ID .env variable.");

  if (!(await defaultConfig.channel.fetchWebhooks()).size) {
   await defaultConfig.channel.createWebhook({
    name: "SSH",
    avatar: client.user.displayAvatarURL(),
    reason: "SSH Webhook",
   });
  }

  logger("ready", `Logged in as ${client.user.tag}! (ID: ${client.user.id})`);
  client.user.setActivity("all ports!", { type: ActivityType.Watching });
 } catch (error) {
  logger("error", error);
 }
}
