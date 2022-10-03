'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      tickets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_tickets');
  }
};
