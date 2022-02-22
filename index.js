const Discord = require("discord.js");
const { spawn } = require("child_process");
const strip = require("strip-ansi");
const chalk = require("chalk");
const si = require("systeminformation");
console.log(chalk.cyan(chalk.bold(`[MAIN] > Starting SSH...`)));
const client = new Discord.Client({
 allowedMentions: {
  parse: ["users", "roles"],
  repliedUser: false,
 },
 presence: {
  status: "online",
  afk: false,
 },
 intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS],
});
require("dotenv").config();
require("events").EventEmitter.prototype._maxListeners = 100;
require("events").defaultMaxListeners = 100;
require("./utilities/anti_crash")(client);
require("./utilities/env_check")(client);
const sudo_text = `[sudo] password for ${client.config.sudo.user}: `;
const fmt = {
 bold: "\x1b[1m",
 green: "\x1b[32m",
 reset: "\x1b[0m",
};
// Cache stats to eliminate "lag" on command
setInterval(() => {
 si.cpuTemperature().then((data) => {
  client.cpu_temperature = data.main;
 });

 si.currentLoad().then((data) => {
  client.cpu_usage = data.currentLoad.toFixed(2);
 });

 si.mem().then((data) => {
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
 let cmd = spawn(`echo ${client.config.sudo.password} | sudo -S -k ${command}`, args, {
  shell: true,
  env: { COLUMNS: 128 },
  cwd: custom_cwd || client.config.cwd,
 });

 cmd.stdout.on("data", (data) => {
  //process.stdout.write(data);
  output += data;
 });
 cmd.stderr.on("data", (data) => {
  //process.stderr.write(data);
  output += data;
 });
 cmd.on("exit", async () => {
  //process.stdout.write(`\n${fmt.bold}${fmt.green}>${fmt.reset} `);
  if (output) {
   await client.config.channel.bulkDelete(1);
   const chunkStr = (str, n, acc) => {
    if (str.length === 0) {
     return acc;
    } else {
     acc.push(str.substring(0, n));
     return chunkStr(str.substring(n), n, acc);
    }
   };
   const output_discord = chunkStr(output, 4000, []);

   const embed = new Discord.MessageEmbed().setColor("#4f545c").setTitle("📤 Output").setTimestamp();
   let i = 0;
   output_discord.forEach((item) => {
    i++;
    embed.setFooter({ text: `Page ${i}/${output_discord.length}`, icon: client.user.displayAvatarURL() });
    embed.setDescription(`\`\`\`${Discord.Util.cleanCodeBlockContent(strip(item.replace(sudo_text, ""), true)) || "No output!"}\`\`\``);
    if (i == output_discord.length) embed.addField(`\u200B`, `\`\`\`CWD: ${custom_cwd}\nCPU: ${client.cpu_usage}% | RAM: ${client.memory_percentage}% | Temp: ${client.cpu_temperature}°C\`\`\``);
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

client.on("messageCreate", (msg) => {
 if (msg.channel === client.config.channel && msg.author === client.config.owner) {
  const regex = /^cwd=["][/].*["]/i;
  const wait = new Discord.MessageEmbed().setDescription("<a:loading:895227261752582154> Waiting for server response...").setColor("#5865f2");
  msg.reply({ embeds: [wait] });
  if (regex.test(msg.content)) {
   const regex_string_replaced = msg.content.replace(regex.exec(msg.content)[0], "");
   const regex_string = regex.exec(msg.content)[0].replace("cwd=", "").replaceAll('"', "");
   exec(regex_string_replaced, null, regex_string.toString());
  } else {
   exec(msg.content, null, client.config.cwd);
  }
 }
});

client.on("ready", async () => {
 client.config.channel = client.channels.cache.get(client.config.channel);
 if (!client.config.channel) {
  throw new Error("Invalid CHANNEL_ID in .env!");
 }
 client.config.owner = await client.users.fetch(client.config.owner);
 if (!client.config.owner) {
  throw new Error("Invalid OWNER_ID in .env!");
 }
 if (!client.config.channel.guild.me.permissionsIn(client.config.channel).has("VIEW_CHANNEL")) {
  throw new Error("Missing required permission VIEW_CHANNEL for channel specified in .env");
 }
 if (!client.config.channel.guild.me.permissionsIn(client.config.channel).has("SEND_MESSAGES")) {
  throw new Error("Missing required permission SEND_MESSAGES for channel specified in .env");
 }
 if (!client.config.channel.guild.me.permissionsIn(client.config.channel).has("MANAGE_WEBHOOKS")) {
  throw new Error("Missing required permission MANAGE_WEBHOOKS for channel specified in .env");
 }
 if (!(await client.config.channel.fetchWebhooks()).size) await client.config.channel.createWebhook(client.config.owner.tag, { avatar: client.config.owner.displayAvatarURL({ format: "png" }) });
 console.log(chalk.cyan(chalk.bold(`[DISCORD] > Logged in as ${client.user.tag}`)));
 client.user.setActivity("all ports!", {
  type: "WATCHING",
 });
});
process.stdin.on("data", (data) => exec(data.toString(), { terminal: true }));

client.login(client.config.token).catch(() => {
 throw new Error("Invalid TOKEN in .env");
});
