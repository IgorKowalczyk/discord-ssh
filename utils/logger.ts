import chalk from "chalk";

type LogType = "info" | "event" | "error" | "warn" | "ready" | "cron";

const colors: Record<LogType, keyof typeof chalk> = {
 info: "cyan",
 event: "magenta",
 error: "red",
 warn: "yellow",
 ready: "green",
 cron: "blue",
};

const longest = Math.max(...Object.keys(colors).map((type) => type.length));

export function logger(type: LogType, ...args: string[]): void {
 console.log(`${(chalk[colors[type]] as Function)(type.padEnd(longest))} - ${chalk.white(args.join(" "))}`);
}
