'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Permissions', {
      participantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'EventParticipant',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission: {
        type: Sequelize.ENUM(
            'participant',
            'staff',
            'staff-view',
            'staff-user-management-edit',
            'staff-team-registration-edit',
            'staff-hardware-edit',
            'oscar'
        ),
        defaultValue: 'participant',
        allowNull: false,
        primaryKey: true
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Permissions');
  }
};
