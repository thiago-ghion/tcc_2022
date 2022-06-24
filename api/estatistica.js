const grupoApi = 'estatistica';

function registrarMetodos(app) {
  app.get(`/v1/${grupoApi}/listar`, (req, res) => {
    listar(req, res);
  });
}

function listar(req, res) {
  const resposta = [
    {
      item: '08:00',
      valor: 23,
    },
    {
      item: '10:00',
      valor: 12,
    },
    {
      item: '11:00',
      valor: 10,
    },
  ];
  res.send(resposta);
}

module.exports = { registrarMetodos };
