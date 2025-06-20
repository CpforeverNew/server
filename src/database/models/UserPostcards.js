import Sequelize from 'sequelize'


export default class UserPostcards extends Sequelize.Model {

    static _init(sequelize, DataTypes) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                sender: {
                    type: DataTypes.STRING(50),
                    allowNull: false
                },
                time_sent: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
                },
                details: {
                    type: DataTypes.STRING(50),
                    allowNull: true
                }
            },
            { sequelize, timestamps: false, tableName: 'user_postcards' }
        )
    }

}
