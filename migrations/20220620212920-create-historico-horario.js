'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoricoHorario', {
      timestampHistorico: {
        primaryKey: true,
        type: Sequelize.DATE,
        allowNull: false,
      },
      idHorario: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      textoTipoAcao: { type: Sequelize.STRING(1), allowNull: false },
      textoHorario: { type: Sequelize.STRING(5), allowNull: false },
      indicadorAtivo: { type: Sequelize.STRING(1), allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HistoricoHorario');
  },
};
