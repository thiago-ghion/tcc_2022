const grupoApi = 'paciente';

function registrarMetodos(app) {
  app.get(`/v1/${grupoApi}/listar`, (req, res) => {
    listarTodos(req, res);
  });

  app.get(`/v1/${grupoApi}/consultar`, (req, res) => {
    consultar(req, res);
  });

  app.post(`/v1/${grupoApi}/registrar`, (req, res) => {
    registrar(req, res);
  });

  app.post(`/v1/${grupoApi}/alterar/:idPaciente`, (req, res) => {
    alterar(req, res);
  });
}

function listarVigente(req, res) {
  const resposta = [
    {
      idPaciente: 1,
      nomePaciente: 'Fulano da Silva',
    },
    {
      idPaciente: 2,
      nomePaciente: 'Ciclano da Silva',
    },
  ];

  res.send(resposta);
}

function listarTodos(req, res) {
  const resposta = [
    {
      idPaciente: 1,
      nomePaciente: 'Fulano da Silva',
    },
    {
      idPaciente: 2,
      nomePaciente: 'Ciclano da Silva',
    },
    {
      idPaciente: 3,
      nomePaciente: 'Teste da Silva',
    },
  ];

  res.send(resposta);
}

function consultar(req, res) {
  const resposta = {
    idPaciente: 2443,
    nomePaciente: 'Cliente Teste',
    numeroCPF: 223345233,
    dataNascimento: '01.01.1970',
    numeroTelefone: '9912345678',
    enderecoEmail: 'teste@test.com',
  };

  res.send(resposta);
}

function registrar(req, res) {
  const resposta = {
    idPaciente: 2443,
    nomePaciente: 'Cliente Teste',
    numeroCPF: 223345233,
    dataNascimento: '01.01.1970',
    numeroTelefone: '9912345678',
    enderecoEmail: 'teste@test.com',
  };

  res.status(201).send(resposta);
}

function alterar(req, res) {
  const resposta = {
    idPaciente: 2443,
    nomePaciente: 'Cliente Teste',
    numeroCPF: 223345233,
    dataNascimento: '01.01.1970',
    numeroTelefone: '9912345678',
    enderecoEmail: 'teste@test.com',
  };
  res.send(resposta);
}

module.exports = { registrarMetodos };
