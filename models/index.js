const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const sequelize = require('../config/database'); // ✅ Загружаем экземпляр Sequelize

const db = {};

// Проверяем, что sequelize загружен
if (!sequelize) {
    throw new Error("❌ Ошибка: экземпляр Sequelize не инициализирован!");
}

// Динамическая загрузка всех моделей из текущей директории
fs.readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Настройка ассоциаций
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Экспортируем объект db с sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
