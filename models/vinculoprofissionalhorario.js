'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VinculoProfissionalHorario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VinculoProfissionalHorario.init(
    {
      idProfissional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Profissional', key: 'idProfissional' },
      },
      idHorario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Horario', key: 'idHorario' },
      },
      dataVinculo: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
      indicadorAtivo: { type: DataTypes.STRING(1), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      modelName: 'VinculoProfissionalHorario',
    }
  );
  return VinculoProfissionalHorario;
};
