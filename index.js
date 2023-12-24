import "dotenv/config";
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import path from "node:path";
import chalk from "chalk";
import { EmbedBuilder, Client, GatewayIntentBits, Events, ActivityType, codeBlock } from "discord.js";
import stripAnsi from "strip-ansi";
import { cpuTemperature as checkCpuTemperature, currentLoad, mem } from "systeminformation";
import { defaultConfig } from "./config.js";
console.log(chalk.cyan(chalk.bold("[DISCORD] > Starting SSH...")));

const client = new Client({
 allowedMentions: {
  parse: ["users", "roles"],
  repliedUser: false,
 },
 intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
});

let customCWD = process.env.CUSTOM_CWD || process.cwd();

let monitoringData = {
 cpuTemperature: 0,
 cpuUsage: 0,
 memoryPercentage: 0,
};

EventEmitter.prototype._maxListeners = 100;

const chunkString = (str, n, acc) => {
 if (str.length === 0) return acc;

 acc.push(str.substring(0, n));
 return chunkString(str.substring(n), n, acc);
};

setInterval(async () => {
 const cpuTemp = await checkCpuTemperature();
 const cpuUsageTest = await currentLoad();
 const memory = await mem();

 monitoringData = {
  cpuTemperature: cpuTemp.main,
  cpuUsage: cpuUsageTest.currentLoad.toFixed(2),
  memoryPercentage: ((memory.used / 1048576 / (memory.total / 1048576)) * 100).toFixed(2),
 };
}, 5000);

async function exec(input) {
 let output = "";

 const args = input.split(" ");
 const command = args.shift();

 const cmd = spawn(`${command}`, args, {
  shell: true,
  env: { COLUMNS: 128 },
  cwd: customCWD,
 });

 cmd.stdout.on("data", (data) => (output += data));
 cmd.stderr.on("data", (data) => (output += data));

 cmd.on("exit", async () => {
  const outputDiscord = chunkString(output || "", 3000, []);

  const embed = new EmbedBuilder() // prettier
   .setColor("#4f545c")
   .setTitle(`${defaultConfig.emojis.output} Output`)
   .setTimestamp();

  outputDiscord.map((item, index) => {
   const index2 = index + 1;
   embed.setFooter({ text: `Page ${index2}/${outputDiscord.length}`, icon: client.user.displayAvatarURL() });
   embed.setDescription(codeBlock(stripAnsi(item, true) || "No output!"));

   if (index2 == outputDiscord.length) embed.setDescription(embed.data.description + `\n${codeBlock(`CWD: ${customCWD}\nCPU: ${monitoringData.cpuUsage}% | RAM: ${monitoringData.memoryPercentage}% | Temp: ${monitoringData.cpuTemperature}°C`)}`);

   const finalMessage = defaultConfig.channel.messages.cache.first();
   if (index2 !== 1) defaultConfig.channel.send({ embeds: [embed] });

   finalMessage.reply({ embeds: [embed] });
  });
 });
}

client.on(Events.MessageCreate, async (message) => {
 if (message.author.bot) return;
 if (message.channel !== defaultConfig.channel && !defaultConfig.owners.includes(message.author.id)) return;
 if (!message.content) return;

 if (message.content.startsWith("cd")) {
  const newCWD = message.content.split(" ")[1];
  if (!newCWD) return;

  try {
   process.chdir(path.resolve(customCWD, newCWD));

   const changedDirectory = new EmbedBuilder() // prettier
    .setDescription(`${defaultConfig.emojis.change} **Changed directory from \`${customCWD}\` to \`${path.resolve(customCWD, newCWD)}\`**`)
    .setColor(defaultConfig.embedColor);

   customCWD = path.resolve(customCWD, newCWD);
   return message.reply({ embeds: [changedDirectory] });
  } catch (err) {
   const error = new EmbedBuilder() // prettier
    .setDescription(`${defaultConfig.emojis.error} **${err.message}**`)
    .setColor(defaultConfig.embedColor);

   return message.reply({ embeds: [error] });
  }
 }

 const wait = new EmbedBuilder() // prettier
  .setDescription(`${defaultConfig.emojis.loading} **Waiting for server response...**`)
  .setColor(defaultConfig.embedColor);

 await message.reply({ embeds: [wait] });

 await exec(message.content);
});

client.once(Events.ClientReady, async () => {
 defaultConfig.channel = client.channels.cache.get(defaultConfig.channel);
 if (!defaultConfig.channel) throw new Error("Invalid CHANNEL_ID in .env!");

 if (!(await defaultConfig.channel.fetchWebhooks()).size) {
  await defaultConfig.channel.createWebhook({
   name: "SSH",
   avatar: client.user.displayAvatarURL(),
   reason: "SSH Webhook",
  });
 }
 console.log(chalk.cyan(chalk.bold(`[DISCORD] > Logged in as ${client.user.tag}`)));
 client.user.setActivity("all ports!", { type: ActivityType.Watching });
});

process.stdin.on("data", (data) => exec(data.toString(), { terminal: true }));

client.login(process.env.TOKEN).catch((error) => {
 throw new Error(error);
});

process.on("unhandledRejection", async (reason) => {
 return console.log(chalk.red(chalk.bold(`[ERROR] > Unhandled Rejection: ${reason}`)));
});

process.on("uncaughtException", async (err) => {
 return console.log(chalk.red(chalk.bold(`[ERROR] > Uncaught Exception: ${err}`)));
});
