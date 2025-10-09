const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

<<<<<<< Updated upstream:src/repository/event/Activities.js
const Activities = sequelize.define(
=======
<<<<<<< HEAD:src/repository/event/Activity.js
const Activity = sequelize.define(
=======
const Activities = sequelize.define(
>>>>>>> sponsors:src/repository/event/Activities.js
>>>>>>> Stashed changes:src/repository/event/Activity.js
    'Activity',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        activityName: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        activityDate: {
            type: DataTypes.DATE, // Matches date type
            allowNull: false,
            require: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
    },
    {
        tableName: 'Activity',
<<<<<<< Updated upstream:src/repository/event/Activities.js
        timestamps: false
    }
);

module.export = Activities;
=======
<<<<<<< HEAD:src/repository/event/Activity.js
        timestamps: false,
    }
);

module.exports = Activity;
=======
        timestamps: false
    }
);

module.export = Activities;
>>>>>>> sponsors:src/repository/event/Activities.js
>>>>>>> Stashed changes:src/repository/event/Activity.js
