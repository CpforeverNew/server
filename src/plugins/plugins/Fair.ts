import UserTickets from "../../database/models/UserTickets";
import Plugin from "../Plugin";

export default class Fair extends Plugin {
    events = {
        end_midway_game: this.endMidwayGame,
        get_user_tickets: this.getUserTickets,
        spend_tickets: this.spendTickets,
    }

    async endMidwayGame(args: any, user: any) {

        const tickets = args.tickets;

        const userTickets = await UserTickets.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        if (userTickets) {
            userTickets.tickets += tickets;
            userTickets.updated_at = new Date();
            await userTickets.save();
        } else {
            await UserTickets.create({
                user_id: user.data.id,
                tickets,
            });
        }

        user.send('user_tickets', {tickets: userTickets?.tickets || 0});

    }

    async getUserTickets(_: any, user: any) {

        const userTickets = await UserTickets.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        user.send('user_tickets', {tickets: userTickets?.tickets || 0});
    }

    async spendTickets(args: any, user: any) {

        let tickets = 0;

        switch (args.item) {
            case 35016:
                tickets = 25000;
                break;
            case 36104:
                tickets = 5000;
                break;
            case 36102:
                tickets = 12000;
                break;
            case 36101:
                tickets = 5000;
                break;
            case 36100:
                tickets = 7500;
                break;
            case 1191:
                tickets = 500;
                break;
            case 1083:
                tickets = 700;
                break;
            case 4119:
                tickets = 1000;
                break;
            case 326:
                tickets = 110;
                break;
            case 9041:
                tickets = 500;
                break;
            case 5005:
                tickets = 200;
                break;
            case 1096:
                tickets = 500;
                break;
            case 1080:
                tickets = 700;
                break;
        }

        if (tickets === 0) { // fixes an issue with players being able to get items for free if sending a valid itemid to this func 
            user.send('error', {error: 'Item cannot be bought using tickets.'});
            return;
        }

        const userTickets = await UserTickets.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        if (userTickets) {

            if (userTickets.tickets < tickets) {
                user.send('error', {error: 'You do not have enough tickets to do that.'});
                return;
            }

            userTickets.tickets -= tickets;
            userTickets.updated_at = new Date();
            await userTickets.save();
        } else {
            user.send('error', {error: 'You do not have any tickets.'});
            return;
        }

        let item = user.validatePurchase.item(args.item)
        if (!item) {
            return
        }

        let slot = this.crumbs.items.slots[item.type - 1]
        user.inventory.add(args.item)

        user.send('add_item', { item: args.item, name: item.name, slot: slot, coins: user.data.coins })
        user.send('user_tickets', {tickets: userTickets?.tickets || 0});
    }
}