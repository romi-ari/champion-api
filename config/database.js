/**
 * @file Manages database connection configuration.
 */

/** Destruct environment variable to get database configuration */
const dotenv = require('dotenv')

dotenv.config();

//============== Deployment Database ==============//

const {
  DB_USERNAME = process.env.DB_USERNAME,
  DB_PASSWORD = process.env.DB_PASSWORD,
  DB_HOST = process.env.DB_HOST,
  DB_NAME = process.env.DB_NAME,
  DB_PORT = process.env.DB_PORT,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
  },
};

//============== Local Database ==============//

// const {
//   DB_USERNAME = process.env.DB_USERNAME,
//   DB_PASSWORD = process.env.DB_PASSWORD,
//   DB_HOST = process.env.DB_HOST,
//   DB_NAME = process.env.DB_NAME,
// } = process.env;

// module.exports = {
//   development: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     host: DB_HOST,
//     dialect: "postgres",
//   },
//   test: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     host: DB_HOST,
//     dialect: "postgres",
//   },
//   production: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     host: DB_HOST,
//     dialect: "postgres",
//   },
// };
