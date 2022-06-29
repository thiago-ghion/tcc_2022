'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TipoOrigemConsulta', {
      tipoOrigemConsulta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoOrigemConsulta: { type: Sequelize.STRING(50), allowNull: false },
    });

    await queryInterface.bulkInsert('TipoOrigemConsulta', [
      {
        tipoOrigemConsulta: 1,
        textoTipoOrigemConsulta: 'Próprio paciente - Interno',
      },
      {
        tipoOrigemConsulta: 2,
        textoTipoOrigemConsulta: 'Próprio paciente - OAuth',
      },
      {
        tipoOrigemConsulta: 3,
        textoTipoOrigemConsulta: 'Colaborador',
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TipoOrigemConsulta');
  },
};
