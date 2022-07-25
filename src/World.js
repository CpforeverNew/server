import Database from './database/Database'
import DataHandler from './handlers/DataHandler'
import LoginHandler from './handlers/LoginHandler'
import Server from './server/Server'
import Discord from './logging/Discord'

import config from '../config/config.json'


class World extends Server {

    constructor(id) {
        let users = {}
        let db = new Database(config.database)
        let discord = new Discord(config)

        let handler = (id == 'Login') ? LoginHandler : DataHandler
        handler = new handler(id, users, db, config, discord)

        super(id, users, db, handler, config)
    }

}

let args = process.argv.slice(2)

if(args.includes('dev_mode')) {
    process.mode = 'dev';
}

for (let world of args) {
    if (world in config.worlds) {
        world !== 'dev_mode' && new World(world)
    }
}
