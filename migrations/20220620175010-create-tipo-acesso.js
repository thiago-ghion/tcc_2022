'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TipoAcesso', {
      tipoAcesso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      textoTipoAcesso: { type: Sequelize.STRING(50), allowNull: false },
    });

    await queryInterface.bulkInsert('TipoAcesso', [
      {
        tipoAcesso: 1,
        textoTipoAcesso: 'Colaborador',
      },
      {
        tipoAcesso: 2,
        textoTipoAcesso: 'Paciente - Interno',
      },
      {
        tipoAcesso: 3,
        textoTipoAcesso: 'Paciente - Externo',
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TipoAcesso');
  },
};
