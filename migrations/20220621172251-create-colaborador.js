'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Colaborador', {
      idColaborador: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomeColaborador: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      nomeUsuario: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      indicadorAdministrador: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      indicadorAtivo: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      indicadorForcarTrocaSenha: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      textoSenha: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('Colaborador', ['nomeUsuario'], {
      name: 'iNomeUsuario',
      unique: true,
    });

    await queryInterface.bulkInsert('Colaborador', [
      {
        nomeColaborador: 'Admin',
        nomeUsuario: 'admin',
        indicadorAdministrador: 'S',
        indicadorAtivo: 'S',
        indicadorForcarTrocaSenha: 'N',
        textoSenha: '12345678',
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Colaborador');
  },
};
