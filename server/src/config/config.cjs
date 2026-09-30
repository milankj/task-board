require('dotenv').config();

const config = {
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
