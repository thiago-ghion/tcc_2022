const apoioTeste = require('./apoioTeste');
let mockListaColaborador = null;
let mockColaborador = null;

jest.mock('../models/index.js', () => ({
  sequelize: {
    transaction: async (funcao) => {
      return funcao();
    },
    literal: () => '',
  },
  Colaborador: {
    findAll: () => {
      return mockListaColaborador;
    },
    findOne: () => {
      return mockColaborador;
    },
    create: () => {
      return new Promise((resolve, reject) => {
        resolve({ idColaborador: 1 });
      });
    },
  },
  HistoricoColaborador: {
    create: () => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
  },
}));

beforeEach(() => {
  mockListaColaborador = null;
  mockColaborador = null;
});

describe('Parte comum', () => {
  test('Registrar método', () => {
    const profissional = require('../api/profissional.js');

    const app = apoioTeste.gerarApp();
    jest.spyOn(app, 'get');
    jest.spyOn(app, 'post');

    try {
      profissional.registrarMetodos(app, jest.fn());
    } catch {}

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
  });
});
