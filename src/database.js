//@ts-check
/**
 * @typedef {{
 *  DB_HOST:string
 *  DB_USERNAME:string
 *  DB_DATABASE:string
 *  DB_PORT:string
 *  DB_PASSWORD:string
 *  DB_SAVE_INTERVAL:string
 * }} Env
 */

const env = /**@type {Env} */ (
  require("dotenv").config().parsed ||
    (() => {
      throw new Error("No .env file found");
    })()
);
const mysql = require("mysql2/promise");

async function connect() {
  return await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  });
}

exports.connect = connect;
exports.env = env;
