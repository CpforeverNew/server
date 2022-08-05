import {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  DataTypes,
} from 'sequelize'

export default class Puffles extends Model<InferAttributes<Puffles>, InferCreationAttributes<Puffles>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare cost: number;

  /**
   * @todo Come back to this when we get rid of the dynamic model loading functionality
   * and move the `init()` call into the module scope
   */
  static _init(sequelize: Sequelize, _: typeof DataTypes) {
    return Puffles.init({
      id: {
        type: DataTypes.INTEGER({
          length: 11,
        }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER({
          length: 11,
        }),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      tableName: 'puffles',
    })
  }
}
