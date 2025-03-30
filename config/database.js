require("dotenv").config();
const { Sequelize } = require("sequelize");
const { URL } = require("url");

const isProduction = process.env.NODE_ENV === "production";

let productionConfig = {};
if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  productionConfig = {
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false, // Отключаем логи для тестов
  },
  production: productionConfig,
};

// Выбираем конфигурацию в зависимости от среды
const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]); // ✅ Теперь sequelize создаётся корректно

module.exports = sequelize; // ✅ Правильный экспорт для работы `.sync()`
module.exports.config = config; // ✅ Экспортируем `config` отдельно
