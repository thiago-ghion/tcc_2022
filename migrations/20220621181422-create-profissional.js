'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profissional', {
      idProfissional: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    await queryInterface.dropTable('Profissional');
  }
};