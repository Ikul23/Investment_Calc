module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
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

  
  Project.associate = (models) => {
    Project.hasMany(models.CashFlow, { foreignKey: "projectId", onDelete: "CASCADE" });
    Project.hasMany(models.FinancialResult, { foreignKey: "projectId", onDelete: "CASCADE" });
  };

  return Project;
};
