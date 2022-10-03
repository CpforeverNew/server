import { DataTypes, Model, Sequelize } from "sequelize";


export default class UserTickets extends Model {
    declare id: number;
    declare user_id: number;
    declare tickets: number;
    declare created_at: Date;
    declare updated_at: Date;

    static _init(sequelize: any, _: any) {
        return UserTickets.init({
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
            tickets: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
            },
        }, {
            sequelize,
            timestamps: false,
            tableName: 'user_tickets',
        })
    }

}