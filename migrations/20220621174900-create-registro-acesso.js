'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RegistroAcesso', {
      timestampAcesso: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false,
      },
      tipoAcesso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'TipoAcesso', key: 'tipoAcesso' }
      },
      credencialAcesso: { type: Sequelize.STRING(255), allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RegistroAcesso');
  },
};
