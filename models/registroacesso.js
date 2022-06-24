'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegistroAcesso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegistroAcesso.init(
    {
      timestampAcesso: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false,
      },
      tipoAcesso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'TipoAcesso', key: 'tipoAcesso' },
      },
      credencialAcesso: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'RegistroAcesso',
    }
  );
  return RegistroAcesso;
};
