import { DataTypes, Model, Sequelize } from 'sequelize';

const MS_PER_DAY = 1000 * 60 * 60 * 24

export default class DailyPrizeRedemptions extends Model {
  declare id: number;
  declare user_id: number;
  declare prize_id: number | null;
  declare redeemed_at: Date;

  getDaysSinceRedemption() {
    const now = new Date()

    const nowAsUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    const redemptionAsUtc = Date.UTC(this.redeemed_at.getFullYear(), this.redeemed_at.getMonth(), this.redeemed_at.getDate())

    return Math.floor((nowAsUtc - redemptionAsUtc) / MS_PER_DAY)
  }
  
  static _init(sequelize: Sequelize, _: typeof DataTypes) {
    return DailyPrizeRedemptions.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      prize_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'daily_prize_pool_prizes',
          key: 'id',
        },
      },
      redeemed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    }, {
      sequelize,
      timestamps: false,
      tableName: 'daily_prize_redemptions',
    })
  }
}