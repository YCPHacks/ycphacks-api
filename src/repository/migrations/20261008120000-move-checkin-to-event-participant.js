'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('EventParticipant', 'checkIn', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.removeColumn('User', 'checkIn');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'checkIn', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.sequelize.query(`
      UPDATE User u
      JOIN EventParticipant ep ON ep.userId = u.id
      JOIN Event e ON e.id = ep.eventId AND e.isActive = 1
      SET u.checkIn = ep.checkIn
    `);

    await queryInterface.removeColumn('EventParticipant', 'checkIn');
  }
};
