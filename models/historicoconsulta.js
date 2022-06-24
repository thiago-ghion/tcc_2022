'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricoConsulta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoricoConsulta.init(
    {
      timestampHistorico: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false,
      },
      idProfissional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      idHorario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      dataVinculo: { type: DataTypes.DATEONLY, primaryKey: true, allowNull: false },
      idPaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoAcao: { type: DataTypes.STRING(1), allowNull: false },
      indicadorConsultaCancelada: { type: DataTypes.STRING(1), allowNull: false },
      tipoOrigemConsulta: { type: DataTypes.INTEGER, allowNull: false },
      idColaborador: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'HistoricoConsulta',
    }
  );
  return HistoricoConsulta;
};
