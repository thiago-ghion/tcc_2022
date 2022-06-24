'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricoHorario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoricoHorario.init(
    {
      timestampHistorico: {
        primaryKey: true,
        type: DataTypes.DATE,
        allowNull: false,
      },
      idHorario: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      textoTipoAcao: { type: DataTypes.STRING(1), allowNull: false },
      textoHorario: { type: DataTypes.STRING(5), allowNull: false },
      indicadorAtivo: { type: DataTypes.STRING(1), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'HistoricoHorario',
    }
  );
  return HistoricoHorario;
};
