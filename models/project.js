module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opex: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    capex: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usefulLifeYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // ✅ Определение связей
  Project.associate = (models) => {
    Project.hasMany(models.CashFlow, {
      foreignKey: "projectId",
      as: "cashFlows",
      onDelete: "CASCADE",
    });

    Project.hasMany(models.FinancialResult, {
      foreignKey: "projectId",
      as: "financialResults",
      onDelete: "CASCADE",
    });
  };

  return Project;
};
