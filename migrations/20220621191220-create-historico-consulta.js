'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoricoConsulta', {
      timestampHistorico: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false,
      },
      idProfissional: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      idHorario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      dataVinculo: { type: Sequelize.DATEONLY, primaryKey: true, allowNull: false },
      idPaciente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoAcao: { type: Sequelize.STRING(1), allowNull: false },
      indicadorConsultaCancelada: { type: Sequelize.STRING(1), allowNull: false },
      tipoOrigemConsulta: { type: Sequelize.INTEGER, allowNull: false },
      idColaborador: { type: Sequelize.INTEGER, allowNull: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HistoricoConsulta');
  },
};
