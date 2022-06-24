'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoricoColaborador', {
      timestampHistorico: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false,
      },
      idColaborador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      textoTipoAcao: { type: Sequelize.STRING(1), allowNull: false },
      nomeColaborador: { type: Sequelize.STRING(150), allowNull: false },
      nomeUsuario: { type: Sequelize.STRING(15), allowNull: false },
      indicadorAdministrador: { type: Sequelize.STRING(1), allowNull: false },
      indicadorAtivo: { type: Sequelize.STRING(1), allowNull: false },
      indicadorForcarTrocaSenha: { type: Sequelize.STRING(1), allowNull: false },
      textoSenha: { type: Sequelize.STRING(8), allowNull: false },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HistoricoColaborador')
  },
}
