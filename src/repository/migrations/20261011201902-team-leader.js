'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn('Team', 'teamLeaderId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'EventParticipant',
                key: 'id'
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn('Team', 'teamLeaderId');
    }
};
