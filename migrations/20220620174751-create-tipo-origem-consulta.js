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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TipoOrigemConsulta');
  },
};
