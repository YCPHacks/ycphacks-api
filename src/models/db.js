const pool = require('../utils/dbPool');

function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                reject(err);
                return;
            }

            connection.query(query, params, (err, results) => {
                connection.release();

                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });
}

module.exports = { queryDatabase };
