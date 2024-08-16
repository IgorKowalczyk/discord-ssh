import { readdirSync } from "node:fs";
import { basename } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { defaultConfig } from "../config";
import { logger } from "./logger";
import { Client } from "discord.js";

export default async function loadEvents(client: Client): Promise<void> {
 try {
  const loadTime = performance.now();

  const directories = readdirSync(`${process.cwd()}/events/`);
  const events: string[] = [];

  for (const directory of directories) {
   const files = readdirSync(`${process.cwd()}/events/${directory}`).filter((file) => file.endsWith(".ts"));
   for (const file of files) {
    events.push(`${process.cwd()}/events/${directory}/${file}`);
   }
  }

  for (const file of events) {
   const fileURL = pathToFileURL(file);
   await import(fileURL.toString()).then((e) => {
    const eventName = basename(file, ".ts");
    defaultConfig.debugger.displayEventList && logger("event", `Loaded event ${eventName} from ${file.replace(process.cwd(), "")}`);
    client.on(eventName, e[eventName].bind(null, client));
   });
  }

  logger("event", `Loaded ${events.length} events from /events in ${Math.round(performance.now() - loadTime)}ms`);
 } catch (error) {
  logger("error", `Error loading events: ${error}`);
 }
}
