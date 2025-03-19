module.exports = (sequelize, DataTypes) => {
  const YearlyData = sequelize.define("YearlyData", {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expenses: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  YearlyData.associate = (models) => {
    YearlyData.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return YearlyData;
};
