const apoioTeste = require('./apoioTeste');
let mockListaPaciente = null;
let mockPaciente = null;

jest.mock('../models/index.js', () => ({
  sequelize: {
    transaction: async (funcao) => {
      return funcao();
    },
    literal: () => '',
  },
  Paciente: {
    findAll: () => {
      return mockListaPaciente;
    },
    findOne: () => {
      return mockPaciente;
    },
    create: () => {
      return new Promise((resolve, reject) => {
        resolve({ idPaciente: 1 });
      });
    },
  },
  HistoricoPaciente: {
    create: () => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
  },
}));

beforeEach(() => {
  mockListaPaciente = null;
  mockPaciente = null;
});

test('Listar Todos - lista vazia', async () => {
  const paciente = require('../api/paciente.js');

  mockListaPaciente = [];

  const req = {};
  const resposta = apoioTeste.gerarResposta();
  const res = apoioTeste.gerarRes(resposta);

  await paciente.listarTodos(req, res);

  expect(resposta.getResposta().length).toBe(0);
});

test('Listar Todos - Erro', async () => {
  const paciente = require('../api/paciente.js');

  mockListaPaciente = new Promise((resolve, reject) => {
    reject();
  });

  const req = {};
  const resposta = apoioTeste.gerarResposta();
  const res = apoioTeste.gerarRes(resposta);
  jest.spyOn(res, 'status');

  await paciente.listarTodos(req, res);

  expect(res.status).toHaveBeenLastCalledWith(400);
});

test('Consultar paciente - ID paciente não informado', async () => {
  const paciente = require('../api/paciente.js');

  const req = { query: {} };
  const resposta = apoioTeste.gerarResposta();
  const res = apoioTeste.gerarRes(resposta);
  jest.spyOn(res, 'status');

  await paciente.consultar(req, res);

  expect(res.status).toHaveBeenLastCalledWith(400);
});

test('Consultar paciente - não encontrou o paciente', async () => {
  const paciente = require('../api/paciente.js');

  const req = { query: { idPaciente: 1 } };
  const resposta = apoioTeste.gerarResposta();
  const res = apoioTeste.gerarRes(resposta);
  jest.spyOn(res, 'status');

  await paciente.consultar(req, res);

  expect(res.status).toHaveBeenLastCalledWith(400);
});
