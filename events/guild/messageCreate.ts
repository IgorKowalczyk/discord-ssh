import fs from "node:fs";
import path from "node:path";
import { Client, EmbedBuilder, Message, TextChannel } from "discord.js";
import { defaultConfig } from "@/config";
import { execCommand } from "@/utils/execCommand";
import { Logger } from "@/utils/logger";

export async function messageCreate(client: Client, message: Message): Promise<void | Message<boolean>> {
 try {
  if (message.author.bot) return;
  if (!(message.channel instanceof TextChannel)) return;
  if (message.channel.id !== defaultConfig.channel && !defaultConfig.owners.includes(message.author.id)) return;
  if (!message.content) return;

  const [command, ...args] = message.content.split(" ");

  if (command === "cd") {
   const newCWD = args.join(" ");
   if (!newCWD) return;

   const resolvedPath = path.resolve(defaultConfig.cwd, newCWD);
   if (!fs.existsSync(resolvedPath)) {
    const error = new EmbedBuilder() // prettier
     .setDescription(`${defaultConfig.emojis.error} **Directory does not exist**`)
     .setColor(defaultConfig.embedColor);
    return message.reply({ embeds: [error] });
   }

   try {
    process.chdir(resolvedPath);
    if (defaultConfig.debugger.changeDir) Logger("event", `Changed directory from ${defaultConfig.cwd} to ${resolvedPath}`);

    const changedDirectory = new EmbedBuilder() // prettier
     .setDescription(`${defaultConfig.emojis.change} **Changed directory from \`${defaultConfig.cwd}\` to \`${resolvedPath}\`**`)
     .setColor(defaultConfig.embedColor);

    defaultConfig.cwd = resolvedPath;
    return message.reply({ embeds: [changedDirectory] });
   } catch (error) {
    if (defaultConfig.debugger.changeDir) Logger("error", `Error changing directory: ${error}`);
    const errorEmbed = new EmbedBuilder() // prettier
     .setDescription(`${defaultConfig.emojis.error} **Error changing directory**`)
     .setColor(defaultConfig.embedColor);

    return message.reply({ embeds: [errorEmbed] });
   }
  }

  const wait = new EmbedBuilder() // prettier
   .setDescription(`${defaultConfig.emojis.loading} **Waiting for server response...**`)
   .setColor(defaultConfig.embedColor);

  await message.reply({ embeds: [wait] });

  await execCommand(client, message.content);
 } catch (error) {
  Logger("error", `Error executing command: ${error}`);
 }
}
