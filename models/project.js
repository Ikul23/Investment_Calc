module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    years: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    discountRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.25
    },
    opex: DataTypes.FLOAT,
    capex: DataTypes.FLOAT,
    revenue: DataTypes.FLOAT
  }, {});

  Project.associate = function(models) {
    Project.hasMany(models.CashFlow, {
      foreignKey: 'projectId',
      as: 'cashFlows'
    });
  };

  return Project;
};