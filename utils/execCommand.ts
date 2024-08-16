import { exec } from "node:child_process";
import { Client, EmbedBuilder, TextChannel, codeBlock } from "discord.js";
import stripAnsi from "strip-ansi";
import { cpuTemperature as checkCpuTemperature, currentLoad, mem } from "systeminformation";
import { defaultConfig } from "../config";
import { chunkString } from "./chunkString";
import { logger } from "./logger";
import { promisify } from "util";

const execPromise = promisify(exec);

async function getSystemInfo() {
 const { main: cpuTemperature } = await checkCpuTemperature();
 const { currentLoad: cpuUsage } = await currentLoad();
 const memoryTest = await mem();
 const memoryPercentage = Number(((memoryTest.used / 1048576 / (memoryTest.total / 1048576)) * 100).toFixed(2));
 return { cpuTemperature, cpuUsage, memoryPercentage };
}

async function executeCommand(command: string) {
 try {
  const { stdout, stderr } = await execPromise(command, {
   cwd: defaultConfig.cwd,
   env: { COLUMNS: "128" },
  });
  return stdout + stderr;
 } catch (error) {
  return error;
 }
}

export async function execCommand(client: Client, input: string): Promise<void> {
 try {
  defaultConfig.debugger.showCommand && logger("event", `Executing command: ${input} in ${defaultConfig.cwd}`);

  const { cpuTemperature, cpuUsage, memoryPercentage } = await getSystemInfo();
  const output = (await executeCommand(input)) || "No output!";
  const outputDiscord = chunkString(output.toString() || "", 3000, []);

  outputDiscord.forEach((item, index) => {
   const index2 = index + 1;

   const embed = new EmbedBuilder()
    .setColor("#4f545c")
    .setTitle(`${defaultConfig.emojis.output} Output`)
    .setTimestamp()
    .setFooter({ text: `Page ${index2}/${outputDiscord.length}`, iconURL: client.user?.displayAvatarURL() })
    .setDescription(codeBlock(stripAnsi(item) || "No output!"));

   if (index2 == outputDiscord.length) {
    embed.setDescription(`${embed.data.description}\n${codeBlock(`CWD: ${defaultConfig.cwd}\nCPU: ${Math.round(cpuUsage)}% | RAM: ${Math.round(memoryPercentage)}% | Temp: ${Math.round(cpuTemperature)}°C`)}`);
   }

   if (!defaultConfig.channel) return logger("error", "Channel not found! Please check your CHANNEL_ID .env variable.");
   const channel = client.channels.cache.get(defaultConfig.channel) as TextChannel;
   if (!channel) return logger("error", "Channel not found! Please check your CHANNEL_ID .env variable.");

   const finalMessage = channel.messages.cache.first();
   if (index2 !== 1) channel.send({ embeds: [embed] });

   if (!finalMessage) return channel.send({ embeds: [embed] });
   finalMessage.reply({ embeds: [embed] });
  });
 } catch (error) {
  console.error(error);
 }
}
