<img width="170" height="170" align="left" style="float: left; margin: 0 10px 0 0; border-radius: 50%;" alt="Discord.ssh" src="https://user-images.githubusercontent.com/49127376/202896528-83f39b85-d67c-4163-a613-80ea8ddad4ec.png">

# Discord.ssh

> 🚀 Discord bot for using shell commands remotely through Discord
> <br><br>[![Discord](https://img.shields.io/discord/666599184844980224?color=6005D2&logo=discord&label=Discord&style=flat-square&logoColor=fff)](https://igorkowalczyk.dev/r/discord) [![Discord.js](https://img.shields.io/badge/Discord.js-v14-%2334d058?style=flat-square&color=6005D2&logo=npm&logoColor=fff)](https://www.npmjs.com/package/discord.js) [![CodeQL Checks](https://img.shields.io/github/actions/workflow/status/igorkowalczyk/discord-ssh/codeql-analysis.yml?branch=main&style=flat-square&label=CodeQL&logo=github&color=6005D2)](https://igorkowalczyk.dev/) [![GitHub License](https://img.shields.io/github/license/igorkowalczyk/discord-ssh?style=flat-square&logo=github&label=License&color=6005D2)](https://github.com/igorkowalczyk/discord-ssh) <br>

---

## 💡 Why I made this?

My ISP won't let me open some ports on my router so I can't use SSH to connect to my server.<br/>
I created this bot to run shell commands on my server remotely through Discord.
<br/>I can also use it to run commands on my local machine.

> ~**Modern problems require modern solutions**

## 🔦 How to use

- Go to channel where you want to run commands _(you can change it in `.env`)_
- Type your command and wait for the response

## 🔩 Limitations

- `sudo` commands are not supported
- Text inputs are not supported (e.g. `nano`)
- `cd` command is partially supported (you can change default directory in `.env`)
- Colored output is not supported and can be broken
  > **Note** `cd` is supported when it's at the beginning of a command

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