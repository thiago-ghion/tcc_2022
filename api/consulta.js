const grupoApi = 'consulta';

function registrarMetodos(app) {
  app.post(`/v1/${grupoApi}/agendar`, (req, res) => {
    agendar(req, res);
  });

  app.post(`/v1/${grupoApi}/cancelar`, (req, res) => {
    cancelar(req, res);
  });

  app.get(`/v1/${grupoApi}/listarConsulta`, (req, res) => {
    listarConsulta(req, res);
  });

  app.get(`/v1/${grupoApi}/listarConsultaTodasPaciente`, (req, res) => {
    listarConsultaTodasPaciente(req, res);
  });

  app.get(`/v1/${grupoApi}/listarConsultaTodasProfissional`, (req, res) => {
    listarConsultaTodasProfissional(req, res);
  });
}

function agendar(req, res) {
  const resposta = {
    idPaciente: 1,
    idProfissional: 1,
    dataConsulta: '01.05.2022',
    idHorario: 1,
  };
  res.status(201).send(resposta);
}

function cancelar(req, res) {
  const resposta = {
    idPaciente: 1,
    idProfissional: 1,
    dataConsulta: '01.05.2022',
    idHorario: 1,
  };
  res.send(resposta);
}

function listarConsulta(req, res) {
  const resposta = [
    {
      idProfissional: 1,
      nomeProfissional: 'Médico da Silva',
      dataConsulta: '02.05.2022',
      idHorario: 1,
      horario: '08:00',
      indicadorPermissaoCancelar: 'S',
    },
  ];
  res.send(resposta);
}

function listarConsultaTodasPaciente(req, res) {
  const resposta = [
    {
      idProfissional: 1,
      nomeProfissional: 'Médico da Silva',
      dataConsulta: '02.05.2022',
      idHorario: 1,
      horario: '08:00',
      indicadorPermissaoCancelar: 'S',
    },
    {
      idProfissional: 1,
      nomeProfissional: 'Médico da Silva',
      dataConsulta: '03.05.2022',
      idHorario: 1,
      horario: '09:30',
      indicadorPermissaoCancelar: 'N',
    },
  ];
  res.send(resposta);
}

function listarConsultaTodasProfissional(req, res) {
  const resposta = [
    {
      idProfissional: 1,
      nomeProfissional: 'Médico da Silva',
      idPaciente: 1,
      nomePaciente: 'Fulano da Silva',
      dataConsulta: '02.05.2022',
      idHorario: 1,
      horario: '08:00',
      indicadorPermissaoCancelar: 'S',
    },
    {
      idProfissional: 1,
      nomeProfissional: 'Médico da Silva',
      idPaciente: 1,
      nomePaciente: 'Fulano da Silva',
      dataConsulta: '03.05.2022',
      idHorario: 1,
      horario: '10:30',
      indicadorPermissaoCancelar: 'N',
    },
  ];
  res.send(resposta);
}

module.exports = { registrarMetodos };
