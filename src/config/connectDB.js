require("dotenv").config();
import mysqlpromise from "mysql2/promise";

const pool = mysqlpromise.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
})

module.exports = pool;
