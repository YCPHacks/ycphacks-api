'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {

        // remove foreign key constraints for unique compound PK
        await queryInterface.removeConstraint('EventParticipant', 'EventParticipant_ibfk_2');
        await queryInterface.removeConstraint('EventParticipant', 'EventParticipant_ibfk_1');


        // remove primary constraint, now that foreign key constraints are gone
        await queryInterface.removeConstraint('EventParticipant', 'PRIMARY');


        // insert the new primary key
        await queryInterface.addColumn('EventParticipant', 'id', {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        });

        // reinsert the unique constraint
        await queryInterface.addConstraint('EventParticipant', {
            fields: ['eventId', 'userId'],
            type: 'unique'
        })

        // reinsert the foreign key constraints
        await queryInterface.addConstraint('EventParticipant', {
            fields: ['eventId'],
            type: 'foreign key',
            references: {
                table: 'Event',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })

        await queryInterface.addConstraint('EventParticipant', {
            fields: ['userId'],
            type: 'foreign key',
            references: {
                table: 'User',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    },

    async down (queryInterface, Sequelize) {

        // remove auto-increment attribute before removing primary key constraint
        await queryInterface.changeColumn('EventParticipant', 'id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: false
        });

        // remove primary key constraint (powered by index)
        await queryInterface.sequelize.query(
            'ALTER TABLE `EventParticipant` DROP PRIMARY KEY;'
        );

        // remove participant id
        await queryInterface.removeColumn('EventParticipant', 'id');// change to just id after testing

        // remove foreign key constraints
        await queryInterface.removeConstraint('EventParticipant', 'EventParticipant_eventId_Event_fk');
        await queryInterface.removeConstraint('EventParticipant', 'EventParticipant_userId_User_fk');

        // remove unique constraint
        await queryInterface.removeIndex('EventParticipant', 'EventParticipant_eventId_userId_uk');

        // reinsert primary key with unique constraint
        await queryInterface.addConstraint('EventParticipant', {
            fields: ['eventId', 'userId'],
            type: 'primary key',
            name: 'PRIMARY'
        })

        // reinsert foreign keys
        await queryInterface.addConstraint('EventParticipant', {
            fields: ['eventId'],
            type: 'foreign key',
            references: {
                table: 'Event',
                field: 'id'
            },
            name: 'EventParticipant_ibfk_1'
        })

        await queryInterface.addConstraint('EventParticipant', {
            fields: ['userId'],
            type: 'foreign key',
            references: {
                table: 'User',
                field: 'id'
            },
            name: 'EventParticipant_ibfk_2'
        })
    }
};
