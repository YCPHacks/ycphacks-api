const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const StaffRoles = sequelize.define(
    'StaffRoles',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'staff_roles',
        timestamps: false
    }
);

StaffRoles.sync({ force: true }).then(() => {
    return StaffRoles.bulkCreate([
        { role: 'user' },
        { role: 'staff' },
        { role: 'oscar' }
        // Add more roles here if needed
    ]);
});

module.exports = StaffRoles;