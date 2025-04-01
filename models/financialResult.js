module.exports = (sequelize, DataTypes) => {
  const FinancialResult = sequelize.define("FinancialResult", {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    operatingExpenses: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    netProfit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
     npv: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    irr: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    dpbp: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Projects",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return FinancialResult;
};
