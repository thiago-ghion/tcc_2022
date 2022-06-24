'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consulta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Consulta.init(
    {
      idProfissional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'VinculoProfissionalHorario',
          key: 'idProfissional',
        },
      },
      idHorario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'VinculoProfissionalHorario', key: 'idHorario' },
      },
      dataVinculo: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        allowNull: false,
        references: { model: 'VinculoProfissionalHorario', key: 'dataVinculo' },
      },
      idPaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Paciente', key: 'idPaciente' },
      },
      indicadorConsultaCancelada: { type: DataTypes.STRING(1), allowNull: false },
      tipoOrigemConsulta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'TipoOrigemConsulta', key: 'tipoOrigemConsulta' },
      },
      idColaborador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Colaborador', key: 'idColaborador' },
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'Consulta',
    }
  );
  return Consulta;
};
