'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoAcesso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TipoAcesso.init(
    {
      tipoAcesso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      textoTipoAcesso: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'TipoAcesso',
    }
  );
  return TipoAcesso;
};
