'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinancialResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FinancialResult.init({
    year: DataTypes.INTEGER,
    revenue: DataTypes.FLOAT,
    operatingExpenses: DataTypes.FLOAT,
    netProfit: DataTypes.FLOAT,
    npv: DataTypes.FLOAT,
    irr: DataTypes.FLOAT,
    dpbp: DataTypes.FLOAT,
    projectId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FinancialResult',
  });
  return FinancialResult;
};