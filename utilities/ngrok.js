module.exports = function() {
(async () => {
const config = require("../config");
const ngrok = require("ngrok");
const chalk = require("chalk");
const user = config.ngrok.user;
  console.log(chalk.cyan(chalk.bold("[NGROK] > Starting")))
  await ngrok.authtoken(config.ngrok.token);
  console.log(chalk.cyan(chalk.bold("[NGROK] > Connected...")))
  const url = await ngrok.connect({
   proto: config.ngrok.proto,
   authtoken: config.ngrok.token,
   addr: config.ngrok.port,
   region: config.ngrok.region, 
   onStatusChange: status => {console.info(chalk.bold(chalk.cyan(`[NGROK] > Status: `) + (status == "online" ? chalk.red(status) : chalk.green(status))))},
 });
 if(config.ngrok.proto == "tcp") {
 const port = url.split(":")[2];
 const protocol = url.split(":")[0];
 const adress = url.split(":")[1].toString().replace("//", "");
 console.log(chalk.bold(chalk.cyan("[NGROK] > Command: ") + chalk.whiteBright.bgBlackBright(`ssh -p ${port} ${user}@${adress}`)))
 } else {
  console.log(chalk.bold(chalk.cyan("[NGROK] > URL: ") + chalk.whiteBright.bgBlackBright(url)))
 }
})()
}