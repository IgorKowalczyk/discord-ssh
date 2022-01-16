require("dotenv").config();

module.exports = {
 ngrok: {
  enabled: true,
  port: 22,
  proto: "tcp",
  region: "eu",
  token: process.env.NGROK_TOKEN,
  user: process.env.NGROK_USER,
 }
};
