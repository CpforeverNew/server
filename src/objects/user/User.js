import Buddy from './Buddy'
import FurnitureInventory from './FurnitureInventory'
import IglooInventory from './IglooInventory'
import Ignore from './Ignore'
import Inventory from './Inventory'
import Stamps from './Stamps'
import PurchaseValidator from './PurchaseValidator'
import fs from 'fs'


export default class User {

    constructor(socket, handler) {
        this.socket = socket
        this.handler = handler
        this.db = handler.db
        this.crumbs = handler.crumbs

        this.address

        this.validatePurchase = new PurchaseValidator(this)

        this.data
        this.room
        this.x = 0
        this.y = 0
        this.frame = 1

        this.messagesSentThisSession = 0
        this.snowballsThrownThisSession = 0
        this.timePlayed = 0

        this.buddy
        this.ignore
        this.inventory

        this.waddle

        // Game server authentication
        this.authenticated = false
        this.token = {}

        setInterval(() => {
            this.timePlayed++
        }, 1000)

        this.partyData = {}

        // Stop Puffles from running away untill we implement the feature
        // for puffle care
        // this.setPuffleDecay()

        this.updateLastLogin()

        this.initChatLogging()
    }

    initChatLogging() {
        if (!this.data) return setTimeout(() => this.initChatLogging(), 1000)

        fs.open(`logs/chat/${this.data.id}.log`, 'a', function (err, fd) {
            if (err) {
                console.log(err)
            }
        });

        this.stream = fs.createWriteStream(`logs/chat/${this.data.id}.log`, {
            flags: 'a'
        });

    }

    logChat(message, filtered = false, filter = "") {
        if (!this.stream) return
        this.stream.write(`${new Date().toISOString()} - ${message} - ${filtered ? 'filtered by ' + filter : 'unfiltered'}\n`)
    }

    get string() {
        return {
            id: this.data.id,
            username: this.data.username,
            color: this.data.color,
            head: this.data.head,
            face: this.data.face,
            neck: this.data.neck,
            body: this.data.body,
            hand: this.data.hand,
            feet: this.data.feet,
            flag: this.data.flag,
            photo: this.data.photo,
            coins: this.data.coins,
            x: this.x,
            y: this.y,
            frame: this.frame,
            rank: this.data.rank,
            stealthMode: this.data.stealthMode,
            username_approved: this.data.username_approved,
            puffle: this.data.walking,
            activation: this.data.activation,
        }
    }

    get inWaddleGame() {
        return this.waddle && this.room.game && this.waddle.id == this.room.id
    }

    get isModerator() {
        return this.data.rank > 3
    }

    get isCommands() {
        return this.data.rank > 2
    }

    async setBuddies(buddies) {
        this.buddy = new Buddy(this)
        await this.buddy.init(buddies)
    }

    async setIgnores(ignores) {
        this.ignore = new Ignore(this)
        await this.ignore.init(ignores)
    }

    setInventory(inventory) {
        this.inventory = new Inventory(this, inventory)
    }

    setIglooInventory(inventory) {
        this.iglooInventory = new IglooInventory(this, inventory)
    }

    setFurnitureInventory(inventory) {
        this.furnitureInventory = new FurnitureInventory(this, inventory)
    }

    setStamps(stamps) {
        this.stamps = new Stamps(this, stamps)
    }

    setPostcards(postcards) {
        this.postcards = postcards
    }

    setItem(slot, item) {
        if (this.data[slot] == item) return

        this.data[slot] = item
        this.room.send(this, 'update_player', {
            id: this.data.id,
            item: item,
            slot: slot
        }, [])

        this.update({
            [slot]: item
        })
    }

    updateCoins(coins) {
        if (!coins) {
            return
        }
        if (!this.data.coins || this.data.coins < 0) {
            this.data.coins = 0
        }

        this.data.coins += parseInt(coins)
        this.update({
            coins: this.data.coins
        })


        if (coins > 0) {
            this.data.coinsEarned += coins
            this.update({
                coinsEarned: this.data.coinsEarned
            })
        } else {
            this.data.coinsSpent += coins
            this.update({
                coinsSpent: this.data.coinsSpent
            })
        }
    }

    joinRoom(room, x = 0, y = 0) {
        if (!room || room === this.room) {
            return
        }

        if (room.isFull) {
            return this.send('error', {
                error: 'Sorry this room is currently full'
            })
        }

        this.room.remove(this)

        this.room = room
        this.x = x
        this.y = y
        this.frame = 1

        this.room.add(this)
    }

    update(query) {
        this.db.users.update(query, {
            where: {
                id: this.data.id
            }
        })
    }

    send(action, args = {}) {
        //if (this.data) console.log(`[User] Sent: ${action} ${JSON.stringify(args)} to ${this.data.username}`)
        this.socket.emit('message', JSON.stringify({
            action: action,
            args: args
        }))
    }

    close() {
        this.socket.disconnect(true)
    }

    updateStats() {
        if (!this.data) return
        this.data.messagesSent += this.messagesSentThisSession
        this.data.snowballsThrown += this.snowballsThrownThisSession
        this.data.timePlayed += this.timePlayed

        this.update({
            messagesSent: this.data.messagesSent,
            snowballsThrown: this.data.snowballsThrown,
            timePlayed: this.data.timePlayed
        })
    }

    onPacketSent() {
        clearTimeout(this.closeInactive)
        this.closeInactive = setTimeout(() => {
            this.close()
        }, 3600000)
    }

    async updateLastLogin() {
        if(!this.data) return setTimeout(() => this.updateLastLogin(), 1000)
        this.data.last_login = new Date()
        this.update({
            last_login: this.data.last_login
        })
    }

    async setPuffleDecay() {
        if (!this.data) return setTimeout(() => this.setPuffleDecay(), 1000)
        let puffles = await this.db.userPuffles.findAll({
            where: {
                userId: this.data.id
            }
        })
        let loginLength = (new Date()).getTime() - (new Date(this.data.last_login)).getTime()
        let decay = Math.floor(Math.floor(loginLength / 1000 / 60 / 60 / 24) * 3.5)
        for (let puffle of puffles) {
            let food = puffle.dataValues.food - decay
            let play = puffle.dataValues.play - decay
            let rest = puffle.dataValues.rest - decay
            let clean = puffle.dataValues.clean - decay
            if (play < 0) play = 0
            if (rest < 0) rest = 0
            if (clean < 0) clean = 0
            if (food < 0 || (play + rest + clean) < 0) {
                await this.db.userPuffles.destroy({
                    where: {
                        id: puffle.dataValues.id
                    }
                })
                let postcard;
                switch (puffle.dataValues.color) {
                    case '0':
                        postcard = 100
                        break
                    case '1':
                        postcard = 101
                        break
                    case '2':
                        postcard = 102
                        break
                    case '3':
                        postcard = 103
                        break
                    case '4':
                        postcard = 104
                        break
                    case '5':
                        postcard = 105
                        break
                    case '6':
                        postcard = 106
                        break
                    case '7':
                        postcard = 107
                        break
                    case '8':
                        postcard = 108
                        break
                    case '9':
                        postcard = 109
                        break
                    case '10':
                        postcard = 185
                        break
                    case '11':
                        postcard = 238
                        break
                    default:
                        postcard = 100
                        break
                }
                let postcardEntry = await this.db.userPostcards.create({
                    userId: user.data.id,
                    id: postcard,
                    sender: "Club Penguin Forever",
                    details: puffle.dataValues.name
                })
                if (postcardEntry) {
                    this.postcards = await this.db.getPostcards(this.data.id)
                    this.send('update_postcards', {
                        postcards: this.postcards
                    })
                }
                continue
            }
            this.db.userPuffles.update({
                food: food,
                play: play,
                rest: rest,
                clean: clean
            }, {
                where: {
                    id: puffle.dataValues.id
                }
            })
        }
        this.data.last_login = new Date()
        this.update({
            last_login: this.data.last_login
        })
    }

}