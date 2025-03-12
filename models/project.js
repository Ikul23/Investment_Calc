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
      allowNull: false,
      defaultValue: 5, 
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Project;
};
