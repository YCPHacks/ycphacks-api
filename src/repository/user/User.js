const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const User = sequelize.define(
    'User',
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
            validate: {
                isEmail: true,
            },
            allowNull: false,
            require: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },
        role: {
            type: DataTypes.ENUM("participant", "staff", "oscar"),
            allowNull: true,
            default: "participant"
        },
        phoneNumber: {
            type: DataTypes.STRING(20), // Matches varchar(20)
            allowNull: false,
            require: true
        },
        age: {
            type: DataTypes.INTEGER,
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
        major: {
            type: DataTypes.STRING
        },
        graduationYear: {
            type: DataTypes.INTEGER
        },
        levelOfStudy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hackathonsAttended: {
            type: DataTypes.INTEGER, // Matches int
            allowNull: false,
            defaultValue: 0
        },
        pronouns: {
            type: DataTypes.STRING,
        },
        linkedInUrl: {
            type: DataTypes.STRING,
        },
        checkIn: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            allowNull: false,
            defaultValue: false
        },
        mlhCodeOfConduct: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            allowNull: false,
        },
        mlhPrivacyPolicy: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            allowNull: false,
        },
        mlhEmails: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            defaultValue: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            defaultValue: false
        }
    },
    {
        tableName: 'User',
        timestamps: false,
    }
);

module.exports = User;