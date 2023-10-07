const mysql = require('mysql2');

// Create a connection pool
const dbPool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "blog",
  waitForConnections: true, // Set to true to enable pooling
  connectionLimit: 10, // Adjust the limit based on your needs
  queueLimit: 0, // Unlimited queueing
});

module.exports = dbPool;

