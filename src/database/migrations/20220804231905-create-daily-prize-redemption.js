'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_prize_redemptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      prize_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'daily_prize_pool_prizes',
          key: 'id',
        },
      },
      redeemed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable('daily_prize_redemptions');
  }
};