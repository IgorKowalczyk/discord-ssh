import { once } from "events";
import { spawn } from "node:child_process";
import { EmbedBuilder, codeBlock } from "discord.js";
import stripAnsi from "strip-ansi";
import { cpuTemperature as checkCpuTemperature, currentLoad, mem } from "systeminformation";
import { defaultConfig } from "../config.js";
import { chunkString } from "./chunkString.js";
import { logger } from "./logger.js";

/**
 * Executes a command in the terminal.
 *
 * @param {object} client The Discord client.
 * @param {string} input The command to execute.
 * @returns {Promise<void>}
 */
export async function execCommand(client, input) {
 try {
  defaultConfig.debugger.showCommand && logger("event", `Executing command: ${input} in ${client.customCWD}`);
  const output = [];

  const { main: cpuTemperature } = await checkCpuTemperature();
  const { currentLoad: cpuUsage } = await currentLoad();
  const memoryTest = await mem();

  const memoryPercentage = ((memoryTest.used / 1048576 / (memoryTest.total / 1048576)) * 100).toFixed(2);

  const args = input.split(" ");
  const command = args.shift();

  const cmd = spawn(`${command}`, args, {
   shell: true,
   env: { COLUMNS: 128 },
   cwd: client.customCWD,
  });

  cmd.stdout.on("data", (data) => output.push(data));
  cmd.stderr.on("data", (data) => output.push(data));

  await once(cmd, "exit");

  const outputDiscord = chunkString(output.join("") || "", 3000, []);

  outputDiscord.forEach((item, index) => {
   const index2 = index + 1;

   const embed = new EmbedBuilder() // prettier
    .setColor("#4f545c")
    .setTitle(`${defaultConfig.emojis.output} Output`)
    .setTimestamp()
    .setFooter({ text: `Page ${index2}/${outputDiscord.length}`, icon: client.user.displayAvatarURL() })
    .setDescription(codeBlock(stripAnsi(item, true) || "No output!"));

   if (index2 == outputDiscord.length) embed.setDescription(`${embed.data.description}\n${codeBlock(`CWD: ${client.customCWD}\nCPU: ${cpuUsage}% | RAM: ${memoryPercentage}% | Temp: ${cpuTemperature}°C`)}`);

   const finalMessage = defaultConfig.channel.messages.cache.first();
   if (index2 !== 1) defaultConfig.channel.send({ embeds: [embed] });

   finalMessage.reply({ embeds: [embed] });
  });
 } catch (error) {
  console.error(error);
 }
}
