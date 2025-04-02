module.exports = (sequelize, DataTypes) => {
    if (!sequelize) {
        throw new Error("Sequelize instance is not provided to CashFlow model");
    }

    const CashFlow = sequelize.define(
        "CashFlow",
        {
            projectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Projects",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            year: {
                type: DataTypes.INTEGER,
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
        },
        {
            timestamps: false,
            tableName: "CashFlows",
        }
    );

    CashFlow.associate = (models) => {
         CashFlow.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    };

    return CashFlow;
};
