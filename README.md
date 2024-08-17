![Discord.ssh](https://github.com/IgorKowalczyk/discord-ssh/assets/49127376/2c5d3d33-0b5f-4f1d-b1c6-a78360d5a129)

<div align="center">
  <a aria-label="Discord" href="https://igorkowalczyk.dev/discord">
    <img src="https://img.shields.io/discord/695282860399001640?color=5865F2&logo=discord&label=Discord&logoColor=fff">
  </a>
  <a aria-label="Discord.js" href="https://www.npmjs.com/package/discord.js">
    <img src="https://img.shields.io/badge/Discord.js-v14-%2334d058?color=5865F2&logo=npm&logoColor=fff">
  </a>
  <a aria-label="CodeQL Checks" href="https://igorkowalczyk.dev/">
    <img src="https://img.shields.io/github/actions/workflow/status/igorkowalczyk/discord-ssh/codeql-analysis.yml?branch=main&label=CodeQL&logo=github&color=5865F2">
  </a>
  <a aria-label="GitHub License" href="https://github.com/igorkowalczyk/discord-ssh">
    <img src="https://img.shields.io/github/license/igorkowalczyk/discord-ssh?logo=github&label=License&color=5865F2">
  </a>
</div>

---

## 💡 Why I made this?

My ISP won't let me open some ports on my router so I can't use SSH to connect to my server.  
I created this bot to run shell commands on my server remotely through Discord.

I can also use it to run commands on my local machine.

> ~**Modern problems require modern solutions**

## 📦 Installation

1. Clone the repo `git clone https://github.com/igorkowalczyk/discord-ssh.git`
2. Install dependencies `pnpm install` or `npm install`
3. Create `.env` file in the root directory
4. Copy the content from [`.env` config](#-env-config)
5. Fill the `.env` file with your data
6. Run the bot `pnpm run start` or `npm run start` (or `pnpm run dev` or `npm run dev` for development)
7. Invite the bot to your server (see [Discord Developer Portal](https://discord.com/developers/applications))
8. Send command in channel which you set in `.env` file
9. Wait for the response, that's it!

> [!IMPORTANT]
> You have to enable `Message Content` intent in your [Discord Developer Portal](https://discord.com/developers/applications) to use this bot!

> [!NOTE]
> Bot will not respond to messages in other channels or other members than you (bot owner) unless you change it in the `.env` file or in the code

## 🔩 Limitations

- `sudo` / `su` commands are not supported, and probably never will be (for security reasons).
- Text inputs are not supported (e.g. `nano`), but you can use `echo` to create/edit files.
- Dynamic output is not supported (e.g. `top`, `htop`).
- Colored output is not supported and will be stripped. Some commands may not work as expected.

> [!NOTE]
> Changing directory (`cd`) is supported when it's at the beginning of a command (e.g. `cd /var/www && ls`)

## 🌌 Future plans

- [ ] Add support for ssh connection
- [ ] Add support for dynamic output
- [ ] Add support for text inputs

## 🔐 `.env` config

```sh
# Copy this file to .env and fill in the values.

CHANNEL_ID="Discord channel ID"
OWNERS_IDS="ID 1,ID 2,ID 3"
TOKEN="Discord bot token"
CUSTOM_CWD="Default path to the bot's working directory (optional - remove this line if you don't need it)"

```

| Variable     | Description                                       | Required |
| ------------ | ------------------------------------------------- | -------- |
| `CHANNEL_ID` | Channel ID where bot will listen for commands     | `✅ Yes` |
| `OWNERS_IDS` | Users IDs who can use the bot (separated by `,`)  | `✅ Yes` |
| `TOKEN`      | Discord bot token                                 | `✅ Yes` |
| `CUSTOM_CWD` | Default directory for SSH commands (Default: `/`) | `❌ No`  |

> [!NOTE]
> You can get your Discord user ID/Cannel ID by enabling `Developer Mode` in Discord settings and right-clicking on your profile or channel

## ⁉️ Issues

If you come across any errors or have suggestions for improvements, please create a [new issue here](https://github.com/igorkowalczyk/discord-ssh/issues) and describe it clearly.

## 📥 Pull Requests

When submitting a pull request, please follow these steps:

- Clone [this repository](https://github.com/igorkowalczyk/discord-ssh) `https://github.com/IgorKowalczyk/discord-ssh.git`
- Create a branch from `main` and give it a meaningful name (e.g. `my-awesome-new-feature`).
- Open a [pull request](https://github.com/igorkowalczyk/discord-ssh/pulls) on [GitHub](https://github.com/) and clearly describe the feature or fix you are proposing.

## 📋 License

This project is licensed under the MIT. See the [LICENSE](https://github.com/igorkowalczyk/discord-ssh/blob/master/license.md) file for details
