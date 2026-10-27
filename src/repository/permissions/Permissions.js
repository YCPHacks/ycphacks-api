const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/index');


const Permissions = sequelize.define(
    'Permissions',
{
    participantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    permission: {
        type: DataTypes.ENUM(
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
    }
},
    {
        tableName: 'Permissions',
        timestamps: false
    }
);

module.exports = Permissions;