"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_candy_hunt", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      candy_stick_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      candy_cube_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      candy_corn_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      candy_borbon_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pumkin_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      candy_apple_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      candy_bar_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lollipop_collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_candy_hunt");
  },
};
