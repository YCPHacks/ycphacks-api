const app = require('./app');
const sequelize = require('./repository/config');

const port = process.env.APP_PORT || 3000;

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log('Server running at http://localhost:${port}');
        });
    })
    .catch((err) => {
        console.error('Error syncing the database: ', err);
    });