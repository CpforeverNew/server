import Sequelize from 'sequelize'


export default class Items extends Sequelize.Model {

    static _init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false
                },
                type: {
                    type: DataTypes.INTEGER(6),
                    allowNull: false
                },
                cost: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                member: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                bait: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                patched: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                treasure: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                obtainable: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                firstRelease: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                latestRelease: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            },
            { sequelize, timestamps: false, tableName: 'items' }
        )
    }

}
