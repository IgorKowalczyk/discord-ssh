![Discord.ssh](https://github.com/IgorKowalczyk/discord-ssh/assets/49127376/2c5d3d33-0b5f-4f1d-b1c6-a78360d5a129)

<div align="center">
  <a aria-label="Discord" href="https://igorkowalczyk.dev/r/discord">
    <img src="https://img.shields.io/discord/666599184844980224?color=6005D2&logo=discord&label=Discord&style=flat-square&logoColor=fff">
  </a>
  <a aria-label="Discord.js" href="https://www.npmjs.com/package/discord.js">
    <img src="https://img.shields.io/badge/Discord.js-v14-%2334d058?style=flat-square&color=6005D2&logo=npm&logoColor=fff">
  </a>
  <a aria-label="CodeQL Checks" href="https://igorkowalczyk.dev/">
    <img src="https://img.shields.io/github/actions/workflow/status/igorkowalczyk/discord-ssh/codeql-analysis.yml?branch=main&style=flat-square&label=CodeQL&logo=github&color=6005D2">
  </a>
  <a aria-label="GitHub License" href="https://github.com/igorkowalczyk/discord-ssh">
    <img src="https://img.shields.io/github/license/igorkowalczyk/discord-ssh?style=flat-square&logo=github&label=License&color=6005D2">
  </a>
</div>

---

## 💡 Why I made this?

My ISP won't let me open some ports on my router so I can't use SSH to connect to my server.  
I created this bot to run shell commands on my server remotely through Discord.

I can also use it to run commands on my local machine.

> ~**Modern problems require modern solutions**

## 📦 Installation

1. Clone the repo (`git clone https://github.com/igorkowalczyk/discord-ssh.git`)
2. Install dependencies (`npm install` / `pnpm install`)
3. Create `.env` file and fill it with your data (see [`.env` config](#-env-config))
4. Run the bot (`npm run start` / `pnpm run start`)
5. Invite the bot to your server
6. Send command in channel which you set in `.env` file
7. Wait for the response, that's it!

> [!NOTE]
> You have to enable `Message Content` intent in your [Discord Developer Portal](https://discord.com/developers/applications) to use this bot!  
> Bot will not respond to messages in other channels or other members than you (bot owner)

## 🔦 How to use

- Go to channel where you want to run commands _(you can change it in `.env`)_
- Type your command and wait for the response _(it may take a while)_

## 🔩 Limitations

- `sudo` commands are not supported
- Text inputs are not supported (e.g. `nano`)
- `cd` command is partially supported (you can change default directory in `.env`)
- Colored output is not supported and can be broken

> [!NOTE]
> Changing directory (`cd`) is supported when it's at the beginning of a command

## 🔐 `.env` config

```
CHANNEL_ID=CHANNEL_ID_TO_RUN_SSH_COMMANDS
OWNER_ID=BOT_OWNER_ID
TOKEN=DISCORD_BOT_TOKEN
CUSTOM_CWD=DEFAULT_SSH_DIR_PATH
```

## ⁉️ Issues

If you have any issues with the page please create [new issue here](https://github.com/igorkowalczyk/discord-ssh/issues)

## 📥 Pull Requests

When submitting a pull request:

- Clone the repo.
- Create a branch off of master and give it a meaningful name (e.g. my-awesome-new-feature).
- Open a [pull request](https://github.com/igorkowalczyk/discord-ssh/pulls) on [GitHub](https://github.com) and describe the feature or fix.

## 📋 License

This project is licensed under the MIT. See the [LICENSE](https://github.com/igorkowalczyk/discord-ssh/blob/master/license.md) file for details
