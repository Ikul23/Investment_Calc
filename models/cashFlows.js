module.exports = (sequelize, DataTypes) => {
  const CashFlow = sequelize.define("CashFlow", {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operationalCashFlow: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    investmentCashFlow: {
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

  return CashFlow;
};
