'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TipoOrigemCadastro', {
      tipoOrigemCadastro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoOrigemCadastro: { type: Sequelize.STRING(50), allowNull: false },
    });

    await queryInterface.bulkInsert('TipoOrigemCadastro', [
      {
        tipoOrigemCadastro: 1,
        textoTipoOrigemCadastro: 'Próprio paciente',
      },
      {
        tipoOrigemCadastro: 2,
        textoTipoOrigemCadastro: 'Colaborador',
      }
    ]);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TipoOrigemCadastro');
  },
};
