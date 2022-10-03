import UserTickets from "../../database/models/UserTickets";
import Plugin from "../Plugin";

export default class Fair extends Plugin {
    events = {
        end_midway_game: this.endMidwayGame,
        get_user_tickets: this.getUserTickets,
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

        user.send('user_tickets', { tickets: userTickets?.tickets || 0 });

    }

    async getUserTickets(_: any, user: any) {

        const userTickets = await UserTickets.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        user.send('user_tickets', { tickets: userTickets?.tickets || 0 });
    }
}