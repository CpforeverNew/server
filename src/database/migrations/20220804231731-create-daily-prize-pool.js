'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_prize_pools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      starts_at: {
        type: Sequelize.DATE,
      },
      ends_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable('daily_prize_pools');
  }
};