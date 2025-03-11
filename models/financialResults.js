module.exports = (sequelize, DataTypes) => {
  const FinancialResults = sequelize.define("FinancialResults", {
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
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Projects",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return FinancialResults;
};
