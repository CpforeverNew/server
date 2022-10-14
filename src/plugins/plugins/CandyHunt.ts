import UserCandyHunt from "../../database/models/UserCandyHunt";
import Plugin from "../Plugin";

export default class CandyHunt extends Plugin {
    events = {
        collected_candy: this.collectedCandy,
        user_candy_current_collected: this.userCandyCurrentCollected,
    }

    async collectedCandy(args: any, user: any) {
        const candy = args.candy;

        const userCandy = await UserCandyHunt.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        if (userCandy) {
            switch (candy) {
                case 'candy_stick':
                    userCandy.candy_stick_collected = true;
                    break;
                case 'candy_cube':
                    userCandy.candy_cube_collected = true;
                    break;
                case 'candy_corn':
                    userCandy.candy_corn_collected = true;
                    break;
                case 'candy_borbon':
                    userCandy.candy_borbon_collected = true;
                    break;
                case 'pumkin':
                    userCandy.pumkin_collected = true;
                    break;
                case 'candy_apple':
                    userCandy.candy_apple_collected = true;
                    break;
                case 'candy_bar':
                    userCandy.candy_bar_collected = true;
                    break;
                case 'lollipop':
                    userCandy.lollipop_collected = true;
                    break;
            }
        } else {
            switch (candy) {
                case 'candy_stick':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_stick_collected: true,
                    });
                    break;
                case 'candy_cube':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_cube_collected: true,
                    });
                    break;
                case 'candy_corn':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_corn_collected: true,
                    });
                    break;
                case 'candy_borbon':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_borbon_collected: true,
                    });
                    break;
                case 'pumkin':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        pumkin_collected: true,
                    });
                    break;
                case 'candy_apple':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_apple_collected: true,
                    });
                    break;
                case 'candy_bar':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        candy_bar_collected: true,
                    });
                    break;
                case 'lollipop':
                    await UserCandyHunt.create({
                        user_id: user.data.id,
                        lollipop_collected: true,
                    });
                    break;
            }
        }

        userCandy?.save().finally(() => {
        
             user.send('user_candy_hunt', {
                candy_stick_collected: userCandy?.candy_stick_collected || false,
                candy_cube_collected: userCandy?.candy_cube_collected || false,
                candy_corn_collected: userCandy?.candy_corn_collected || false,
                candy_borbon_collected: userCandy?.candy_borbon_collected || false,
                pumkin_collected: userCandy?.pumkin_collected || false,
                candy_apple_collected: userCandy?.candy_apple_collected || false,
                candy_bar_collected: userCandy?.candy_bar_collected || false,
                lollipop_collected: userCandy?.lollipop_collected || false,
                candies_collected: this.countCandyCollected(userCandy),
            });
    
            // check if all candies are collected
            if (userCandy?.candy_stick_collected && userCandy?.candy_cube_collected && userCandy?.candy_corn_collected && userCandy?.candy_borbon_collected && userCandy?.pumkin_collected && userCandy?.candy_apple_collected && userCandy?.candy_bar_collected && userCandy?.lollipop_collected) {
                userCandy.completed = true;
                userCandy.save();
                 user.send('candy_hunt_completed', { completed: true });
            }
        
        });

    }

    async userCandyCurrentCollected(_: any, user: any) {

        const userCandy = await UserCandyHunt.findOne({
            where: {
                user_id: user.data.id,
            },
        });

        await user.send('user_candy_hunt', {
            candy_stick_collected: userCandy?.candy_stick_collected || false,
            candy_cube_collected: userCandy?.candy_cube_collected || false,
            candy_corn_collected: userCandy?.candy_corn_collected || false,
            candy_borbon_collected: userCandy?.candy_borbon_collected || false,
            pumkin_collected: userCandy?.pumkin_collected || false,
            candy_apple_collected: userCandy?.candy_apple_collected || false,
            candy_bar_collected: userCandy?.candy_bar_collected || false,
            lollipop_collected: userCandy?.lollipop_collected || false,
            candies_collected: this.countCandyCollected(userCandy),
        });

        if (userCandy?.candy_stick_collected && userCandy?.candy_cube_collected && userCandy?.candy_corn_collected && userCandy?.candy_borbon_collected && userCandy?.pumkin_collected && userCandy?.candy_apple_collected && userCandy?.candy_bar_collected && userCandy?.lollipop_collected) {
            await user.send('candy_hunt_completed', { completed: true });
        }

    }

    countCandyCollected(userCandy: any) {
        let candiesCollected = 0;
        if (userCandy?.candy_stick_collected) candiesCollected++;
        if (userCandy?.candy_cube_collected) candiesCollected++;
        if (userCandy?.candy_corn_collected) candiesCollected++;
        if (userCandy?.candy_borbon_collected) candiesCollected++;
        if (userCandy?.pumkin_collected) candiesCollected++;
        if (userCandy?.candy_apple_collected) candiesCollected++;
        if (userCandy?.candy_bar_collected) candiesCollected++;
        if (userCandy?.lollipop_collected) candiesCollected++;

        return candiesCollected;
    }

}