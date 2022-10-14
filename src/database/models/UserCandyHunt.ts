import { DataTypes, Model } from "sequelize";

export default class UserCandyHunt extends Model {

    declare id: number;
    declare user_id: number;
    declare candy_stick_collected: boolean;
    declare candy_cube_collected: boolean;
    declare candy_corn_collected: boolean;
    declare candy_borbon_collected: boolean;
    declare pumkin_collected: boolean;
    declare candy_apple_collected: boolean;
    declare candy_bar_collected: boolean;
    declare lollipop_collected: boolean;
    declare completed: boolean;

    static _init(sequelize: any, _: any) {

        return UserCandyHunt.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            candy_stick_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            candy_cube_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            candy_corn_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            candy_borbon_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            pumkin_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            candy_apple_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            candy_bar_collected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            lollipop_collected: {

                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            timestamps: false,
            tableName: 'user_candy_hunt',
        });
    }



}