const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Registration = sequelize.define(
    'Registration',
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending',
        },
    },
    {
        tableName: 'registrations',
        timestamps: false,
    }
);

module.exports = Registration;
