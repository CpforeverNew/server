import Plugin from '../Plugin'
import { getFilterResultByText } from '../../services/filter/filter'
import { PerspectiveAPIClientError } from 'perspective-api-client'

export default class Chat extends Plugin {
    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'send_message': this.sendMessage,
            'send_safe': this.sendSafe,
            'send_emote': this.sendEmote
        }

        this.commands = {
            'users': this.userPopulation,
            'broadcast': this.broadcast,
            'swat': this.swat,
            'jr': this.joinRoom
        }

        this.bindCommands()
    }

    // Events

    async sendMessage(args, user) {
        // Todo: message validation
        if (args.message.startsWith('!')) {
            return this.processCommand(args.message.substring(1), user)
        }

        if (args.message.length < 1) {
            return
        }

        try {
            const result = await getFilterResultByText(args.message)

            if (result.shouldTextBeLogged()) {
                this.discord.logChatMessage(
                    user.data.username,
                    args.message,
                    user.room.name,
                    result
                )
            }

            if (result.shouldBeFiltered()) {
                user.send('error', {
                    error: "Your message was not sent because our chat filter deems it unsuitable for the safe environment of CPF."
                })

                user.room.send(user, 'filtered_message', {
                    id: user.data.id,
                    message: args.message,
                    filter: result.filter,
                }, [], true)

                return user.logChat(args.message, true, result.filter)
            }

            user.messagesSentThisSession++

            user.room.send(user, 'send_message', {
                id: user.data.id,
                message: args.message,
            }, [], true)

            user.logChat(args.message)
        } catch (e) {
            if (e instanceof PerspectiveAPIClientError) {
                this.discord.errorAlert("Perspective API Error")
            }
        }
    }

    sendSafe(args, user) {
        user.room.send(user, 'send_safe', {
            id: user.data.id,
            safe: args.safe
        }, [], true)
    }

    sendEmote(args, user) {
        user.room.send(user, 'send_emote', {
            id: user.data.id,
            emote: args.emote
        }, [], true)
    }

    // Commands

    bindCommands() {
        for (let command in this.commands) {
            this.commands[command] = this.commands[command].bind(this)
        }
    }

    processCommand(message, user) {
        let args = message.split(' ')
        let command = args.shift()

        if (command in this.commands) {
            user.room.send(user, 'filtered_message', {
                id: user.data.id,
                message: message,
                filter: 'manual'
            }, [user], true)
            return this.commands[command](args, user)
        }
    }

    userPopulation(args, user) {
        user.send('error', {
            error: `Users online: ${this.handler.population}`
        })
    }

    broadcast(args, user) {
        if (user.data.rank < 5) return
        this.handler.broadcast(args.join(" "))
    }

    joinRoom(args, user) {
        if (user.data.rank < 4) return;
        if(isNaN(args[0])) return;
        
        user.joinRoom(this.rooms[args[0]]);
    }

    swat(args, user) {
        let snowboardHelment = this.crumbs.items[464]
        let darkVisionGoggle = this.crumbs.items[102]
        let scubaTanks = this.crumbs.items[308]
        let tacticalGear = this.crumbs.items[4258]
        let blackElectricGuitar = this.crumbs.items[338]
        let greenSneakers = this.crumbs.items[6037]

        user.inventory.add(464)
        user.inventory.add(102)
        user.inventory.add(308)
        user.inventory.add(4258)
        user.inventory.add(338)
        user.inventory.add(6037)

        user.send('add_item', { item: 464, name: snowboardHelment.itemName, slot: this.crumbs.items.slots[snowboardHelment.type - 1], coins: user.data.coins })
        user.send('add_item', { item: 102, name: darkVisionGoggle.itemName, slot: this.crumbs.items.slots[darkVisionGoggle.type - 1], coins: user.data.coins })
        user.send('add_item', { item: 308, name: scubaTanks.itemName, slot: this.crumbs.items.slots[scubaTanks.type - 1], coins: user.data.coins })
        user.send('add_item', { item: 4258, name: tacticalGear.itemName, slot: this.crumbs.items.slots[tacticalGear.type - 1], coins: user.data.coins })
        user.send('add_item', { item: 338, name: blackElectricGuitar.itemName, slot: this.crumbs.items.slots[blackElectricGuitar.type - 1], coins: user.data.coins })
        setTimeout(() => {user.send('add_item', { item: 6037, name: "SWAT GEAR", slot: this.crumbs.items.slots[greenSneakers.type - 1], coins: user.data.coins })}, 100)
    }

}
