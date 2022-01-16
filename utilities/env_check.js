module.exports = function (client) {
 if (!process.env.CHANNEL_ID) throw new Error("Invaild CHANNEL_ID in .env!");
 if (!process.env.OWNER_ID) throw new Error("Invaild OWNER_ID in .env!");
 if (!process.env.TOKEN) throw new Error("Invaild TOKEN in .env!");
 if (!process.env.SUDO_USER) throw new Error("Invaild SUDO_USER in .env!");
 if (!process.env.SUDO_PASSWORD) throw new Error("Invaild SUDO_PASSWORD in .env!");
 if (!process.env.CUSTOM_CWD) throw new Error("Invaild CUSTOM_CWD in .env!");
 client.config = {
  channel: process.env.CHANNEL_ID,
  owner: process.env.OWNER_ID,
  token: process.env.TOKEN,
  sudo: {
   user: process.env.SUDO_USER,
   password: process.env.SUDO_PASSWORD,
  },
  cwd: process.env.CUSTOM_CWD,
 };
};
