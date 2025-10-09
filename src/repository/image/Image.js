const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Image = sequelize.define(
    'Image',
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        url : {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
<<<<<<< Updated upstream
    {
        tableName: 'Image',
=======
<<<<<<< HEAD

    {
        tableName: 'Image'
=======
    {
        tableName: 'Image',
>>>>>>> sponsors
>>>>>>> Stashed changes
    }

);

module.exports = Image;