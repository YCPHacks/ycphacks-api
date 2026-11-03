'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ImportedRegistration', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            firstName: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            lastName: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            age: Sequelize.INTEGER,
            phoneNumber: Sequelize.STRING(20),
            school: Sequelize.STRING(255),
            tShirtSize: Sequelize.STRING(5),
            dietaryRestrictions: Sequelize.STRING(255),
            checkIn: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            formData: {
                type: Sequelize.JSON,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex(
            'ImportedRegistration',
            ['email'],
            {
                unique: true,
                name: 'unique_imported_registration_event_email'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('ImportedRegistration');
    }
};