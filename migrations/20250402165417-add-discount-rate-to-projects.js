'use strict';

/** @type {import('sequelize-cli').Migration} */
// в файле миграции
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'discountRate', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.25 // значение по умолчанию как в вашей логике
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Projects', 'discountRate');
  }
};