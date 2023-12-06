import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import chalk from "chalk";
import { EmbedBuilder, Client, GatewayIntentBits, Events, ActivityType } from "discord.js";
import stripAnsi from "strip-ansi";
import { cpuTemperature, currentLoad, mem } from "systeminformation";
import "dotenv/config";
console.log(chalk.cyan(chalk.bold("[DISCORD] > Starting SSH...")));

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
 cpuTemperature().then((data) => {
  client.cpuTemperature = data.main;
 });

 currentLoad().then((data) => {
  client.cpuUsage = data.currentLoad.toFixed(2);
 });

 mem().then((data) => {
  const total = (data.total / 1048576).toFixed(2);
  const used = (data.used / 1048576).toFixed(2);
  client.memoryPercentage = ((used * 100) / total).toFixed(2);
 });
}, 5000);

async function exec(input, options, customCWD) {
 if (options?.terminal)
  await (await client.config.channel.fetchWebhooks()).first().send(input, {
   username: client.config.channel.guild.members.cache.get(client.config.owner.id)?.nickname || client.config.owner.username,
   avatarURL: client.config.owner.displayAvatarURL({ format: "png" }),
  });
 let output = "";
 const args = input.split(" ");
 const command = args.shift();
 const cmd = spawn(`${command}`, args, {
  shell: true,
  env: { COLUMNS: 128 },
  cwd: customCWD || client.config.cwd || process.cwd(),
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
   const outputDiscord = chunkStr(output, 4000, []);

   const embed = new EmbedBuilder().setColor("#4f545c").setTitle("📤 Output").setTimestamp();
   let i = 0;
   outputDiscord.forEach((item) => {
    i++;
    embed.setFooter({ text: `Page ${i}/${outputDiscord.length}`, icon: client.user.displayAvatarURL() });
    embed.setDescription(`\`\`\`${stripAnsi(item, true) || "No output!"}\`\`\``);
    if (i == outputDiscord.length) embed.addFields([{ name: "\u200B", value: `\`\`\`CWD: ${customCWD}\nCPU: ${client.cpuUsage}% | RAM: ${client.memoryPercentage}% | Temp: ${client.cpuTemperature}°C\`\`\`` }]);
    const finalMessage = client.config.channel.messages.cache.first();
    if (i !== 1) {
     client.config.channel.send({ embeds: [embed] });
    } else {
     finalMessage.reply({ embeds: [embed] });
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

process.on("unhandledRejection", async (reason) => {
 return console.log(chalk.red(chalk.bold(`[ERROR] > Unhandled Rejection: ${reason}`)));
});
process.on("uncaughtException", async (err) => {
 return console.log(chalk.red(chalk.bold(`[ERROR] > Uncaught Exception: ${err}`)));
});
process.on("uncaughtExceptionMonitor", async (err) => {
 return console.log(chalk.red(chalk.bold(`[ERROR] > Uncaught Exception Monitor: ${err}`)));
});
