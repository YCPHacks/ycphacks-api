const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100), // Matches varchar(100)
                validate: {
                    isEmail: true,
                },
                allowNull: false,
                require: true
            },
            firstName: {
                type: DataTypes.STRING(100), // Matches varchar(100)
                allowNull: false,
                require: true
            },
            lastName: {
                type: DataTypes.STRING(100), // Matches varchar(100)
                allowNull: false,
                require: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                require: true
            },
            role: {
                type: DataTypes.INTEGER,
                allowNull: true,
                default: 1
            },
            phoneNumber: {
                type: DataTypes.STRING(20), // Matches varchar(20)
                allowNull: false,
                require: true
            },
            gender: {
                type: DataTypes.STRING(50), // Matches varchar(50)
                allowNull: false,
                require: true
            },
            pronouns: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.STRING(100), // Matches varchar(100)
                allowNull: false,
                require: true
            },
            tShirtSize: {
                type: DataTypes.STRING(5), // Matches varchar(5)
                allowNull: false,
                require: true
            },
            dietaryRestrictions: {
                type: DataTypes.STRING(255), // Matches varchar(255)
                allowNull: true,
            },
            school: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            hackathonsAttended: {
                type: DataTypes.INTEGER, // Matches int
                allowNull: false,
            },
            mlhCodeOfConduct: {
                type: DataTypes.TINYINT(1), // Matches tinyint(1)
                allowNull: false,
                require: true
            },
            mlhPrivacyPolicy: {
                type: DataTypes.TINYINT(1), // Matches tinyint(1)
                allowNull: false,
                require: true
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,  // This ensures the field can't be null
                defaultValue: false  // Sets the default value to false if not provided
            },
            mlhEmails: {
                type: DataTypes.TINYINT(1), // Matches tinyint(1)
                allowNull: true,
            },
        },
        {
            tableName: 'User',
            timestamps: false,
        }
    );
};
