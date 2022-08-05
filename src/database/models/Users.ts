import {
  Model,
  Sequelize,
  DataTypes,
} from 'sequelize'

/**
 * @todo Break some of these attributes out into other models - it's too damn big
 * @todo Finish typing this class
 */
export default class Users extends Model {
  declare coins: number;

  canAfford(cost: number) {
    return this.coins >= cost;
  }

  static _init(sequelize: Sequelize, _: typeof DataTypes) {
    return Users.init({
      id: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      username: {
          type: DataTypes.STRING(12),
          allowNull: false
      },
      password: {
          type: DataTypes.STRING(60),
          allowNull: false
      },
      loginKey: {
          type: DataTypes.TEXT,
          allowNull: true
      },
      rank: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      stealthMode: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      permaBan: {
          type: DataTypes.BOOLEAN,
          allowNull: false
      },
      joinTime: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      coins: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      head: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      face: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      neck: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      body: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      hand: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      feet: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      color: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      photo: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      flag: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      username_approved: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      username_rejected: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      ip: {
          type: DataTypes.TEXT,
          allowNull: true
      },
      messagesSent: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      snowballsThrown: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      timePlayed: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      sledRacesWon: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      findFourWon: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      coinsEarned: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      coinsSpent: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      partyTasksCompleted: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      hasBeenPOTW: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      stampbookColor: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      stampbookClasp: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      stampbookPattern: {
          type: DataTypes.INTEGER({
            length: 1,
          }),
          allowNull: false
      },
      cannon_data: {
          type: DataTypes.STRING(1000),
      },
      walking: {
          type: DataTypes.INTEGER({
            length: 11,
          }),
          allowNull: false
      },
      last_login: {
          type: DataTypes.DATE,
          allowNull: false,
      }, 
      lastReport: {
          type: DataTypes.INTEGER({
            length: 20,
          }),
          allowNull: false
      },
    }, {
      sequelize,
      timestamps: false,
      tableName: 'users',
    })
  }
}
