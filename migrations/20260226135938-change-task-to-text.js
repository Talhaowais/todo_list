'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change the task column type to TEXT
    await queryInterface.changeColumn('Todos', 'task', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to STRING (length 255)
    await queryInterface.changeColumn('Todos', 'task', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};