const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), '..', '.env'),
});

/**
 * Returns an object containing the database config for the current environment
 * 
 * We fall back to development defaults if the environment variables aren't populated
 * 
 * @param {{[key: string]: any}} options Config options you want to add or override for an environment
 */
function getDbConfig(options = {}) {
  return {
    username: process.env.DB_USER ?? 'user',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME ?? 'cpforever',
    host: process.env.DB_HOST ?? 'db',
    port: process.env.DB_PORT ?? 3306,
    dialect: process.env.DB_DIALECT ?? 'mysql',
    ...options,
  }
}

module.exports = {
  development: getDbConfig(),
  production: getDbConfig(),
}