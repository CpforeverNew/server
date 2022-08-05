import { Client } from 'discord.js';
import { Handler } from '../handlers/handlers';

/**
 * @todo Finish typing this class after `Handler` et. al are typed
 */
export default class Plugin {
  db: any;
  users: any;
  usersById: any;
  config: any;
  crumbs: any;
  rooms: any;
  openIgloos: any;
  discord: Client;

  constructor(public handler: Handler) {
      this.db = handler.db
      this.users = handler.users
      this.usersById = handler.usersById
      this.config = handler.config
      this.crumbs = handler.crumbs
      this.rooms = handler.rooms
      this.openIgloos = handler.openIgloos
      this.discord = handler.discord
  }

  get plugins() {
      return this.handler.plugins.plugins
  }
}
