const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Registration = sequelize.define(
    'Registration',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
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
        email: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            unique: true,
            validate: {
                isEmail: true,
            },
            allowNull: false,
            require: true
        },
        phoneNumber: {
            type: DataTypes.STRING(20), // Matches varchar(20)
            allowNull: false,
            require: true
        },
        dob: {
            type: DataTypes.DATE, // Matches date type
            allowNull: false,
            require: true
        },
        gender: {
            type: DataTypes.STRING(50), // Matches varchar(50)
            allowNull: false,
            require: true
        },
        country: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        tshirtSize: {
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
        mlhEmails: {
            type: DataTypes.TINYINT(1), // Matches tinyint(1)
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('checked in', 'approved', 'denied', 'pending'), // Matches enum
            defaultValue: 'pending',
            allowNull: false,
            require: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Matches timestamp with default
            allowNull: false,
        },
    },
    {
        tableName: 'registrations',
        timestamps: false,
    }
);

module.exports = Registration;
