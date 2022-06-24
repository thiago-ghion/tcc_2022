'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Colaborador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Colaborador.init(
    {
      idColaborador: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nomeColaborador: { type: DataTypes.STRING(150), allowNull: false },
      nomeUsuario: { type: DataTypes.STRING(15), allowNull: false },
      indicadorAdministrador: { type: DataTypes.STRING(1), allowNull: false },
      indicadorAtivo: { type: DataTypes.STRING(1), allowNull: false },
      indicadorForcarTrocaSenha: { type: DataTypes.STRING(1), allowNull: false },
      textoSenha: { type: DataTypes.STRING(8), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'Colaborador',
    }
  );
  return Colaborador;
};
