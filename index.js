import { EmbedBuilder, Client, GatewayIntentBits, Events, ActivityType } from "discord.js";
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import stripAnsi from "strip-ansi";
import chalk from "chalk";
import systeminformation from "systeminformation";
import * as dotenv from "dotenv";
dotenv.config();
console.log(chalk.cyan(chalk.bold(`[DISCORD] > Starting SSH...`)));

const client = new Client({
 allowedMentions: {
  parse: ["users", "roles"],
  repliedUser: false,
 },
 presence: {
  status: "online",
  afk: false,
 },
 intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
});

client.config = {
 channel: process.env.CHANNEL_ID,
 owner: process.env.OWNER_ID,
 token: process.env.TOKEN,
 cwd: process.env.CUSTOM_CWD,
};

EventEmitter.prototype._maxListeners = 100;

// Cache stats to eliminate "lag" on command
setInterval(() => {
 systeminformation.cpuTemperature().then((data) => {
  client.cpu_temperature = data.main;
 });

 systeminformation.currentLoad().then((data) => {
  client.cpu_usage = data.currentLoad.toFixed(2);
 });

 systeminformation.mem().then((data) => {
  const total = (data.total / 1048576).toFixed(2);
  const used = (data.used / 1048576).toFixed(2);
  client.memory_percentage = ((used * 100) / total).toFixed(2);
 });
}, 5000);

async function exec(input, options, custom_cwd) {
 if (options?.terminal)
  await (await client.config.channel.fetchWebhooks()).first().send(input, {
   username: client.config.channel.guild.members.cache.get(client.config.owner.id)?.nickname || client.config.owner.username,
   avatarURL: client.config.owner.displayAvatarURL({ format: "png" }),
  });
 let output = "";
 let args = input.split(" ");
 let command = args.shift();
 let cmd = spawn(`${command}`, args, {
  shell: true,
  env: { COLUMNS: 128 },
  cwd: custom_cwd || client.config.cwd,
 });

 cmd.stdout.on("data", (data) => {
  output += data;
 });
 cmd.stderr.on("data", (data) => {
  output += data;
 });
 cmd.on("exit", async () => {
  if (output) {
   //await client.config.channel.bulkDelete(1);
   const chunkStr = (str, n, acc) => {
    if (str.length === 0) {
     return acc;
    } else {
     acc.push(str.substring(0, n));
     return chunkStr(str.substring(n), n, acc);
    }
   };
   const output_discord = chunkStr(output, 4000, []);

   const embed = new EmbedBuilder().setColor("#4f545c").setTitle("📤 Output").setTimestamp();
   let i = 0;
   output_discord.forEach((item) => {
    i++;
    embed.setFooter({ text: `Page ${i}/${output_discord.length}`, icon: client.user.displayAvatarURL() });
    embed.setDescription(`\`\`\`${stripAnsi(item, true) || "No output!"}\`\`\``);
    if (i == output_discord.length) embed.addFields([{ name: `\u200B`, value: `\`\`\`CWD: ${custom_cwd}\nCPU: ${client.cpu_usage}% | RAM: ${client.memory_percentage}% | Temp: ${client.cpu_temperature}°C\`\`\`` }]);
    const final_message = client.config.channel.messages.cache.first();
    if (i !== 1) {
     client.config.channel.send({ embeds: [embed] });
    } else {
     final_message.reply({ embeds: [embed] });
    }
   });
  }
 });
}

client.on(Events.MessageCreate, (msg) => {
 if (msg.author.bot) return;
 if (msg.channel === client.config.channel && msg.author === client.config.owner) {
  if (msg.content.startsWith("cd")) {
   const cd = new EmbedBuilder().setDescription("↪️ **Changed directory from `" + client.config.cwd + "` to `" + msg.content.split(" ")[1] + "`**\n\n<a:loading:895227261752582154> **Waiting for server response...**").setColor("#5865f2");
   msg.reply({ embeds: [cd] });
   exec(msg.content.split(" ").slice(2).join(" "), null, msg.content.split(" ")[1].toString());
  } else {
   const wait = new EmbedBuilder().setDescription("<a:loading:895227261752582154> **Waiting for server response...**").setColor("#5865f2");
   msg.reply({ embeds: [wait] });
   exec(msg.content, null, client.config.cwd);
  }
 }
});

client.once(Events.ClientReady, async () => {
 client.config.channel = client.channels.cache.get(client.config.channel);
 if (!client.config.channel) {
  throw new Error("Invalid CHANNEL_ID in .env!");
 }
 client.config.owner = await client.users.fetch(client.config.owner);
 if (!client.config.owner) {
  throw new Error("Invalid OWNER_ID in .env!");
 }

 if (!(await client.config.channel.fetchWebhooks()).size) await client.config.channel.createWebhook(client.config.owner.tag, { avatar: client.config.owner.displayAvatarURL({ format: "png" }) });
 console.log(chalk.cyan(chalk.bold(`[DISCORD] > Logged in as ${client.user.tag}`)));
 client.user.setActivity("all ports!", { type: ActivityType.Watching });
});

process.stdin.on("data", (data) => exec(data.toString(), { terminal: true }));

client.login(client.config.token).catch(() => {
 throw new Error("Invalid TOKEN in .env");
});

process.on("unhandledRejection", (reason, p) => {
 client.channels.fetch(client.config.channel).then((channel) => {
  const embed = new EmbedBuilder().setColor("#ff0000").setTitle("❌ Unhandled Rejection").setDescription(`\`\`\`${reason}\`\`\``).setTimestamp();
  channel.send({ embeds: [embed] });
 });
 return;
});
process.on("uncaughtException", (err, origin) => {
 client.channels.fetch(client.config.channel).then((channel) => {
  const embed = new EmbedBuilder().setColor("#ff0000").setTitle("❌ Uncaught Exception").setDescription(`\`\`\`${err}\`\`\``).setTimestamp();
  channel.send({ embeds: [embed] });
 });
 return;
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
 client.channels.fetch(client.config.channel).then((channel) => {
  const embed = new EmbedBuilder().setColor("#ff0000").setTitle("❌ Uncaught Exception Monitor").setDescription(`\`\`\`${err}\`\`\``).setTimestamp();
  channel.send({ embeds: [embed] });
 });
 return;
});
process.on("multipleResolves", (type, promise, reason) => {
 client.channels.fetch(client.config.channel).then((channel) => {
  const embed = new EmbedBuilder().setColor("#ff0000").setTitle("❌ Multiple Resolves").setDescription(`\`\`\`${reason}\`\`\``).setTimestamp();
  channel.send({ embeds: [embed] });
 });
 return;
});
