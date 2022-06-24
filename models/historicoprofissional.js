'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricoProfissional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoricoProfissional.init(
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
      textoTipoAcao: { type: DataTypes.STRING, allowNull: false },
      nomeProfissional: { type: DataTypes.STRING, allowNull: false },
      indicadorAtivo: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: 'HistoricoProfissional',
    }
  );
  return HistoricoProfissional;
};
