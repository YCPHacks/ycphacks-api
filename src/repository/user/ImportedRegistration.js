const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/index');

const ImportedRegistration = sequelize.define(
    'ImportedRegistration',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        age: DataTypes.INTEGER,
        phoneNumber: DataTypes.STRING(20),
        school: DataTypes.STRING(255),
        tShirtSize: DataTypes.STRING(5),
        dietaryRestrictions: DataTypes.STRING(255),
        checkIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        formData: DataTypes.JSON
    },
    {
        tableName: 'ImportedRegistration',
        timestamps: true
    }
);

module.exports = ImportedRegistration;