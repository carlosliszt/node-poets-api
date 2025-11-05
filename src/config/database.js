const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

pool.getConnection() //teste conexão.
    .then(connection => {
        console.log('✅ Conexão com MySQL estabelecida com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao MySQL:', err.message);
    });

module.exports = pool;

