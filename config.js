export const defaultConfig = {
 channel: process.env.CHANNEL_ID,
 token: process.env.TOKEN,
 embedColor: "#5865f2",
 emojis: {
  loading: "<a:loading:895227261752582154>",
  output: "📤",
  error: "❌",
  change: "↪️",
 },
 owners: [...process.env.OWNERS_IDS.split(",")],
};
