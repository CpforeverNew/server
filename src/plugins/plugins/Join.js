import Plugin from '../Plugin'
import Igloo from '../../objects/room/Igloo'


export default class Join extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'load_player': this.loadPlayer,
            'join_server': this.joinServer,
            'join_room': this.joinRoom,
            'join_igloo': this.joinIgloo
        }
    }

    // Events

    loadPlayer(args, user) {
        user.room = this.getRandomSpawn()

        user.send('load_player', {
            user: user.string,
            room: user.room.id,

            joinTime: user.data.joinTime,
            stampbookClasp: user.data.stampbookClasp,
            stampbookColor: user.data.stampbookColor,
            stampbookPattern: user.data.stampbookPattern,
            cannonData: user.data.cannon_data,

            buddies: user.buddy.list,
            ignores: user.ignore.list,
            inventory: user.inventory.list,
            igloos: user.iglooInventory.list,
            furniture: user.furnitureInventory.list,
            stamps: user.stamps.list,
            postcards: user.postcards
        })
    }

    joinServer(args, user) {
        user.room.add(user)
    }

    // Limit this to 1/2 uses per second
    joinRoom(args, user) {
        if(user.streamActive) 
            user.streamActive = false; // wow wouldnt it be cool if comfy used event emitter and not this shitty excuse for a event system?

        user.joinRoom(this.rooms[args.room], args.x, args.y)
    }

    async joinIgloo(args, user) {
        if(user.streamActive) 
            user.streamActive = false;

        let igloo = await this.getIgloo(args.igloo)
        user.joinRoom(igloo, args.x, args.y)
    }

    // Functions

    getRandomSpawn() {
        let spawns = Object.values(this.rooms).filter(room => room.spawn && !room.isFull)

        // All spawns full
        if (!spawns.length) {
            spawns = Object.values(this.rooms).filter(room => !room.game && !room.isFull)
        }

        return spawns[Math.floor(Math.random() * spawns.length)]
    }

    async getIgloo(id) {
        let internalId = id + this.config.game.iglooIdOffset // Ensures igloos are above all default rooms

        if (!(internalId in this.rooms)) {
            let igloo = await this.db.getIgloo(id)
            if (!igloo) return null

            this.rooms[internalId] = new Igloo(igloo, this.db, this.config.game.iglooIdOffset)
        }

        return this.rooms[internalId]
    }

}
