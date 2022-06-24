'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoricoPaciente', {
      timestampHistorico: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false,
      },
      idPaciente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoAcao: { type: Sequelize.STRING(1), allowNull: false },
      nomePaciente: { type: Sequelize.STRING(150), allowNull: false },
      numeroCPF: { type: Sequelize.BIGINT, allowNull: true },
      dataNascimento: { type: Sequelize.DATEONLY, allowNull: true },
      numeroTelefone: { type: Sequelize.BIGINT, allowNull: true },
      enderecoEmail: { type: Sequelize.STRING(255), allowNull: true },
      tipoOrigemCadastro: { type: Sequelize.INTEGER, allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HistoricoPaciente');
  },
};
