const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_SCHEMA, 
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 2000,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  }
);

const db = {
  Sequelize,
  sequelize,
  User: require('./user')(sequelize, Sequelize)
};

module.exports = db;
