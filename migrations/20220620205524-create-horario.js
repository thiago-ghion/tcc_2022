'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Horario', {
      idHorario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      textoHorario: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      indicadorAtivo: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Horario');
  },
};
