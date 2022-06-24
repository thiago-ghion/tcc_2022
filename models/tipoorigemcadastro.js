'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoOrigemCadastro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TipoOrigemCadastro.init(
    {
      tipoOrigemCadastro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      textoTipoOrigemCadastro: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'TipoOrigemCadastro',
    }
  );
  return TipoOrigemCadastro;
};
