import { basename } from "node:path";
import { performance } from "node:perf_hooks";
import { globby } from "globby";
import { defaultConfig } from "../config.js";
import { logger } from "./logger.js";

/**
 * Loads all events from the /events folder
 *
 * @param {object} client - The Discord client
 * @returns {Promise<void>} Promise that resolves when all events are loaded
 * @throws {Error} Error that is thrown if an event could not be loaded
 */
export default async function loadEvents(client) {
 try {
  const loadTime = performance.now();

  const events = await globby(`${process.cwd()}/events/*/*.js`);
  for (const file of events) {
   await import(file).then((e) => {
    const eventName = basename(file, ".js");
    defaultConfig.debugger.displayEventList && logger("event", `Loaded event ${eventName} from ${file.replace(process.cwd(), "")}`);
    client.on(eventName, e[eventName].bind(null, client));
   });
  }

  logger("event", `Loaded ${events.length} events from /events in ${Math.round(performance.now() - loadTime)}ms`);
 } catch (error) {
  logger("error", `Error loading events: ${error.message}`);
 }
}
