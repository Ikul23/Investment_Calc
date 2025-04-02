'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FinancialResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      revenue: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      operatingExpenses: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      netProfit: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      npv: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      irr: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      dpbp: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FinancialResults');
  }
};