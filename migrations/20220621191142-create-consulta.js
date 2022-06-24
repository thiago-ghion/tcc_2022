'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Consulta', {
      idProfissional: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      idHorario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      dataVinculo: {
        type: Sequelize.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
      idPaciente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Paciente', key: 'idPaciente' },
      },
      indicadorConsultaCancelada: { type: Sequelize.STRING(1), allowNull: false },
      tipoOrigemConsulta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'TipoOrigemConsulta', key: 'tipoOrigemConsulta' },
      },
      idColaborador: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Colaborador', key: 'idColaborador' },
      },
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE "Consulta" ADD FOREIGN KEY ("idProfissional", "idHorario", "dataVinculo") REFERENCES "VinculoProfissionalHorario"("idProfissional", "idHorario", "dataVinculo")'
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Consulta');
  },
};
