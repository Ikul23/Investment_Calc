require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

console.log("DB_PORT:", process.env.DB_PORT); // Для отладки, должен быть 5432

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
      
  : new Sequelize({
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), // Преобразуем в число
      dialect: "postgres",
    });

module.exports = sequelize;
