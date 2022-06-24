const grupoApi = 'profissional';
const db = require('.././models/index.js');
const _ = require('underscore');
const moment = require('moment');

const registrarMetodos = (app, incluirNivelAccesso) => {
  const listarVigenteURL = `/v1/${grupoApi}/listarVigente`;
  incluirNivelAccesso(listarVigenteURL, 3);
  app.get(listarVigenteURL, (req, res) => {
    listarVigente(req, res);
  });

  const listarTodosURL = `/v1/${grupoApi}/listarTodos`;
  incluirNivelAccesso(listarTodosURL, 3);
  app.get(listarTodosURL, (req, res) => {
    listarTodos(req, res);
  });

  const listarDataDisponivelURL = `/v1/${grupoApi}/listarDataDisponivel`;
  incluirNivelAccesso(listarDataDisponivelURL, 3);
  app.get(listarDataDisponivelURL, (req, res) => {
    listarDataDisponivel(req, res);
  });

  const listarHorarioDisponivelURL = `/v1/${grupoApi}/listarHorarioDisponivel`;
  incluirNivelAccesso(listarHorarioDisponivelURL, 3);
  app.get(listarHorarioDisponivelURL, (req, res) => {
    listarHorarioDisponivel(req, res);
  });

  const listarConfiguracaoHorarioURL = `/v1/${grupoApi}/listarConfiguracaoHorario/:idProfissional/:data`;
  incluirNivelAccesso(listarConfiguracaoHorarioURL, 3);
  app.get(listarConfiguracaoHorarioURL, (req, res) => {
    listarConfiguracaoHorario(req, res);
  });

  const registrarURL = `/v1/${grupoApi}/registrar`;
  incluirNivelAccesso(registrarURL, 3);
  app.post(registrarURL, (req, res) => {
    registrar(req, res);
  });

  const alterarURL = `/v1/${grupoApi}/alterar/:idProfissional`;
  incluirNivelAccesso(alterarURL, 3);
  app.post(alterarURL, (req, res) => {
    alterar(req, res);
  });

  const ativarURL = `/v1/${grupoApi}/ativar/:idProfissional`;
  incluirNivelAccesso(ativarURL, 3);
  app.post(ativarURL, (req, res) => {
    desativar(req, res);
  });

  const desativarURL = `/v1/${grupoApi}/desativar/:idProfissional`;
  incluirNivelAccesso(desativarURL, 3);
  app.post(desativarURL, (req, res) => {
    desativar(req, res);
  });

  const consultarVinculo = `/v1/${grupoApi}/consultarVinculo/:idProfissional/:dataPesquisa`;
  incluirNivelAccesso(consultarVinculo, 3);
  app.get(consultarVinculo, (req, res) => {
    consultarVinculo(req, res);
  });
};

const listarVigente = (req, res) => {
  const resposta = [
    { idProfissional: 1, nomeProfissional: 'Fulano da Silva' },
    { idProfissional: 2, nomeProfissional: 'Ciclano da Silva' },
  ];

  res.send(resposta);
};

const listarTodos = (req, res) => {
  const resposta = [
    { idProfissional: 1, nomeProfissional: 'Fulano da Silva' },
    { idProfissional: 2, nomeProfissional: 'Ciclano da Silva' },
    { idProfissional: 3, nomeProfissional: 'Teste da Silva' },
  ];
  res.send(resposta);
};

const listarDataDisponivel = (req, res) => {
  const resposta = [{ data: '01.05.2022' }, { data: '02.05.2022' }];
  res.send(resposta);
};

const listarHorarioDisponivel = (req, res) => {
  const resposta = [
    { idHorario: 1, horario: '08:00' },
    { idHorario: 2, horario: '08:30' },
  ];
  res.send(resposta);
};

const listarConfiguracaoHorario = (req, res) => {
  const resposta = {
    data: [
      { idHorario: 1, horario: '08:00' },
      { idHorario: 2, horario: '08:30' },
    ],
  };
  res.send(resposta);
};

const validarProfissional = async (req, res) => {
  try {
    if (
      req.body.nomeProfissional === null ||
      req.body.nomeProfissional === ''
    ) {
      res
        .status(400)
        .send({ mensagem: 'Nome do profissional não foi preenchido' });
      return false;
    }

    if (req.body.vinculoDataHorario !== null) {
      // Validação se os campos estão preenchidos e com domínio válidos

      let temErro = false;
      _(req.body.vinculoDataHorario).each((item) => {
        if (item.data === null || !moment(item.data, 'DD.MM.YYYY').isValid()) {
          temErro = true;
        }
        if (item.listaHorario === null || item.listaHorario.length === 0) {
          temErro = true;
        } else {
          _(item.listaHorario).each((itemHorario) => {
            if (itemHorario.idHorario === null || itemHorario.idHorario === 0) {
              temErro = true;
            }
            if (
              itemHorario.acao === null ||
              (itemHorario.acao != 'A' && itemHorario.acao != 'D')
            ) {
              temErro = true;
            }
          });
        }
      });

      if (temErro) {
        res.status(400).send({
          mensagem: 'A lista de vinculos de horários está inconsistente',
        });
        return false;
      }

      // Validação se tem datas repetidas na lista

      const listaData = _.groupBy(
        req.body.vinculoDataHorario,
        (itemGroup) => itemGroup.data
      );

      const listaDataSumarizada = _(listaData).filter(
        (itemFilter) => itemFilter.length > 1
      );

      if (listaDataSumarizada.length !== 0) {
        res.status(400).send({
          mensagem: 'A lista de vinculos tem datas repetidas',
        });
        return false;
      }

      // Validar se existem idHorario repetidos dentro da data

      _(req.body.vinculoDataHorario).each((itemVinculo) => {
        const grupoHorario = _(itemVinculo.listaHorario).groupBy(
          (itemGroup) => itemGroup.idHorario
        );

        const grupoHorarioSumarizado = _(grupoHorario).filter(
          (itemFilter) => itemFilter.length > 1
        );

        if (grupoHorarioSumarizado.length !== 0) {
          temErro = true;
        }
      });

      if (temErro) {
        res.status(400).send({
          mensagem: 'A lista de vinculos tem horários repetidos',
        });
        return false;
      }
    }

    return true;
  } catch (e) {
    res.status(400).send({
      mensagem: 'Falha na validação do profissional',
    });
    return false;
  }
};

const registrar = async (req, res) => {
  try {
    const isValido = await validarProfissional(req, res);

    if (!isValido) {
      return;
    }

    await db.sequelize.transaction(async (t) => {
      const resultado = await db.Profissional.create(
        {
          nomeProfissional: req.body.nomeProfissional,
          indicadorAtivo: 'S',
        },
        { transaction: t }
      );

      const resposta = {
        idProfissional: resultado.idProfissional,
      };

      await db.HistoricoProfissional.create(
        {
          timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
          textoTipoAcao: 'I',
          idProfissional: resultado.idProfissional,
          nomeProfissional: resultado.nomeProfissional,
          indicadorAtivo: resultado.indicadorAtivo,
        },
        { transaction: t }
      );

      const listaPromise = [];

      if (req.body.vinculoDataHorario !== null) {
        _(req.body.vinculoDataHorario).each((itemVinculo) => {
          _(itemVinculo.listaHorario).each((itemHorario) => {
            listaPromise.push(
              db.VinculoProfissionalHorario.create(
                {
                  idProfissional: resultado.idProfissional,
                  idHorario: itemHorario.idHorario,
                  dataVinculo: moment(
                    itemVinculo.data,
                    'DD.MM.YYYY'
                  ).toISOString(),
                  indicadorAtivo: itemHorario.acao === 'A' ? 'S' : 'N',
                },
                { transaction: t }
              )
            );
          });
        });
      }

      await Promise.all(listaPromise);

      res.status(201).send(resposta);
    });
  } catch (err) {
    res.status(400).send({ mensagem: 'Falha na inclusão do profissional' });
  }
};

const alterar = (req, res) => {
  const resposta = {
    idProfissional: 1,
  };
  res.send(resposta);
};

const ativar = (req, res) => {
  const resposta = {
    idProfissional: 1,
  };
  res.send(resposta);
};

const desativar = (req, res) => {
  const resposta = {
    idProfissional: 1,
  };
  res.send(resposta);
};

const consultarVinculo = (req, res) => {
  const resposta = {
    data: {
      listaHorario: [
        {
          idHorario: 1,
          horario: '08:00',
          indicadorAtivo: 'S',
        },
        {
          idHorario: 2,
          horario: '08:30',
          indicadorAtivo: 'N',
        },
      ],
    },
  };
  res.send(resposta);
};

module.exports = { registrarMetodos };
