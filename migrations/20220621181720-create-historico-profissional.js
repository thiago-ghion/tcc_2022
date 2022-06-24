'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoricoProfissional', {
      timestampHistorico: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      },
      idProfissional: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      textoTipoAcao: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      nomeProfissional: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      indicadorAtivo: {
        type: Sequelize.STRING(1),
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HistoricoProfissional');
  }
};