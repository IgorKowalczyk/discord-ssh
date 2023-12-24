import fs from "node:fs";
import path from "node:path";
import { EmbedBuilder } from "discord.js";
import { defaultConfig } from "../../config.js";
import { execCommand } from "../../utils/execCommand.js";
import { logger } from "../../utils/logger.js";

/**
 * Creates an embed.
 *
 * @param {string} description The embed description.
 * @param {string} color The embed color.
 * @returns {EmbedBuilder} The embed.
 */
function createEmbed(description, color) {
 return new EmbedBuilder() // prettier
  .setDescription(description)
  .setColor(color);
}

/**
 * Handles the messageCreate event.
 *
 * @param {object} client The Discord client.
 * @param {object} message The message object.
 * @returns {Promise<void>}
 */
export async function messageCreate(client, message) {
 try {
  if (message.author.bot) return;
  if (message.channel !== defaultConfig.channel && !defaultConfig.owners.includes(message.author.id)) return;
  if (!message.content) return;

  const [command, ...args] = message.content.split(" ");

  if (command === "cd") {
   const newCWD = args.join(" ");
   if (!newCWD) return;

   const resolvedPath = path.resolve(client.customCWD, newCWD);
   if (!fs.existsSync(resolvedPath)) {
    const error = createEmbed(`${defaultConfig.emojis.error} **Directory does not exist**`, defaultConfig.embedColor);
    return message.reply({ embeds: [error] });
   }

   try {
    process.chdir(resolvedPath);
    defaultConfig.debugger.changeDir && logger("event", `Changed directory from ${client.customCWD} to ${resolvedPath}`);

    const changedDirectory = createEmbed(`${defaultConfig.emojis.change} **Changed directory from \`${client.customCWD}\` to \`${resolvedPath}\`**`, defaultConfig.embedColor);

    client.customCWD = resolvedPath;
    return message.reply({ embeds: [changedDirectory] });
   } catch (err) {
    defaultConfig.debugger.changeDir && logger("error", err);
    const error = createEmbed(`${defaultConfig.emojis.error} **${err.message}**`, defaultConfig.embedColor);

    return message.reply({ embeds: [error] });
   }
  }

  const wait = createEmbed(`${defaultConfig.emojis.loading} **Waiting for server response...**`, defaultConfig.embedColor);

  await message.reply({ embeds: [wait] });

  await execCommand(client, message.content);
 } catch (error) {
  logger("error", error);
 }
}
