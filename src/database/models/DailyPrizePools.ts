import { DataTypes, Model, Sequelize } from 'sequelize';

export default class DailyPrizePools extends Model {
  declare id: number;
  declare name: string | null;
  declare starts_at: Date | null;
  declare ends_at: Date | null;

  static _init(sequelize: Sequelize, _: typeof DataTypes) {
    return DailyPrizePools.init({
      id: {
        type: DataTypes.INTEGER({
          length: 11,
        }),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      starts_at: {
        type: DataTypes.DATE,
      },
      ends_at: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      timestamps: false,
      tableName: 'daily_prize_pools',
    })
  }
}
