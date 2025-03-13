const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { sequelize } = require('../config/database');
const db = {};

// Динамическая загрузка всех моделей из текущей директории
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Настройка ассоциаций между моделями, если они определены
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Определение ассоциаций между моделями
if (db.Project && db.CashFlow) {
  db.Project.hasMany(db.CashFlow, { foreignKey: 'projectId' });
  db.CashFlow.belongsTo(db.Project, { foreignKey: 'projectId' });
}

if (db.Project && db.FinancialResult) {
  db.Project.hasMany(db.FinancialResult, { foreignKey: 'projectId' });
  db.FinancialResult.belongsTo(db.Project, { foreignKey: 'projectId' });
}

// Добавляем sequelize в объект db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;