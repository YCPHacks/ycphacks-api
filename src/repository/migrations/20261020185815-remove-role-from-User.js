'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'role');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'role', {
      type: Sequelize.ENUM('participant', 'staff', 'oscar'),
      allowNull: true,
      defaultValue: 'participant'
    });
  }
};
