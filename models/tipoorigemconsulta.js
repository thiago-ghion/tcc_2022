'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoOrigemConsulta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TipoOrigemConsulta.init(
    {
      tipoOrigemConsulta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoOrigemConsulta: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'TipoOrigemConsulta',
    }
  );
  return TipoOrigemConsulta;
};
