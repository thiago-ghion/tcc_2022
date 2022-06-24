'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VinculoProfissionalHorario', {
      idProfissional: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Profissional', key: 'idProfissional' }
      },
      idHorario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Horario', key: 'idHorario' }
      },
      dataVinculo: { type: Sequelize.DATEONLY, primaryKey: true, allowNull: false },
      indicadorAtivo: { type: Sequelize.STRING(1), allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VinculoProfissionalHorario');
  },
};
