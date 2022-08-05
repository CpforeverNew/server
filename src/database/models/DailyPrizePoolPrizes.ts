import { DataTypes, Model, Sequelize } from 'sequelize';

export type PrizeType =
  | 'clothingItem'
  | 'furnitureItem'
  | 'coins';

export default class DailyPrizePoolPrizes extends Model {
  declare id: number;
  declare pool_id: number;
  declare probability: number;
  declare value: string;
  declare type: PrizeType;

  static _init(sequelize: Sequelize, _: typeof DataTypes) {
    return DailyPrizePoolPrizes.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER({
          length: 11,
        })
      },
      pool_id: {
        type: DataTypes.INTEGER({
          length: 11,
        }),
        allowNull: false,
        references: {
          model: 'daily_prize_pools',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('clothingItem', 'furnitureItem', 'coins'),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      probability: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      tableName: 'daily_prize_pool_prizes',
    })
  }
}
