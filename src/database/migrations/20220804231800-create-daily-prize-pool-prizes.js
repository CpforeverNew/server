'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_prize_pool_prizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pool_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'daily_prize_pools',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM('clothingItem', 'furnitureItem', 'coins'),
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      probability: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable('daily_prize_pool_prizes');
  }
};