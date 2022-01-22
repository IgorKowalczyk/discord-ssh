module.exports = (client) => {
 process.on("unhandledRejection", (reason, p) => {
  return;
 });
 process.on("uncaughtException", (err, origin) => {
  return;
 });
 process.on("uncaughtExceptionMonitor", (err, origin) => {
  return;
 });
 process.on("multipleResolves", (type, promise, reason) => {
  return;
 });
};
