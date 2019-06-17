const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'sctzeumi',
    host: 'raja.db.elephantsql.com',
    database: 'sctzeumi',
    password: 'EDKbpcvBvMQqDf1Bca2bFIoDMSDgJpr4',
    port: 5432
});

module.exports = {
    pool
};