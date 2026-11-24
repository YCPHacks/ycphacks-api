'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable("TeamingRequests", {
            teamId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Team',
                    key: 'id',
                }
            },
            participantId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'EventParticipant',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addConstraint('TeamingRequests', {
            fields: ['teamId', 'participantId'],
            type: 'primary key',
            name: 'PRIMARY'
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('TeamingRequests');
    }
};
