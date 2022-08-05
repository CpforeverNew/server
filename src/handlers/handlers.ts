import { type Client } from 'discord.js'

/**
 * @todo Finish typing this interface and its implementations
 */
export type Handler = {
  [key: string]: any;

  discord: Client;

  handle(message: string, user: any): any;
}
