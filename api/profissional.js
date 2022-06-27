const grupoApi = 'profissional';
const db = require('.././models/index.js');
const _ = require('underscore');
const Util = require('../util/Util');

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
    ativar(req, res);
  });

  const desativarURL = `/v1/${grupoApi}/desativar/:idProfissional`;
  incluirNivelAccesso(desativarURL, 3);
  app.post(desativarURL, (req, res) => {
    desativar(req, res);
  });

  const consultarVinculoURL = `/v1/${grupoApi}/consultarVinculo/:idProfissional/:dataPesquisa`;
  incluirNivelAccesso(consultarVinculoURL, 3);
  app.get(consultarVinculoURL, (req, res) => {
    consultarVinculo(req, res);
  });
};

const listarVigente = async (req, res) => {
  try {
    const listaProfissional = await db.Profissional.findAll({
      where: { indicadorAtivo: 'S' },
    });

    const resposta = _(listaProfissional).each((item) => {
      return {
        idProfissional: item.idProfissional,
        nomeProfissional: item.nomeProfissional,
      };
    });

    res.send(resposta);
  } catch {
    res
      .status(400)
      .send({ mensagem: 'Falha na consulta da lista de profisssionais' });
  }
};

const listarTodos = async (req, res) => {
  try {
    const listaProfissional = await db.Profissional.findAll();

    const resposta = _(listaProfissional).each((item) => {
      return {
        idProfissional: item.idProfissional,
        nomeProfissional: item.nomeProfissional,
      };
    });

    res.send(resposta);
  } catch {
    res
      .status(400)
      .send({ mensagem: 'Falha na consulta da lista de profisssionais' });
  }
};

const listarDataDisponivel = async (req, res) => {
  try {
    if (req.query.idProfissional === undefined) {
      res
        .status(400)
        .send({ mensagem: 'Número do profissional não foi informado' });
      return;
    }

    const profissional = await db.Profissional.findOne({
      where: { idProfissional: req.query.idProfissional },
    });

    if (profissional === null) {
      res.status(400).send({ mensagem: 'Profissional não foi encontrado' });
      return;
    }

    if (req.query.dataInicio === undefined) {
      res
        .status(400)
        .send({ mensagem: 'Data início da pesquisa não foi informada' });
      return;
    }

    if (!Util.isDataValida(req.query.dataInicio)) {
      res.status(400).send({
        mensagem: 'Data início da pesquisa está com formato incorreto',
      });
      return;
    }

    if (req.query.dataFim === undefined) {
      res
        .status(400)
        .send({ mensagem: 'Data fim da pesquisa não foi informada' });
      return;
    }

    if (!Util.isDataValida(req.query.dataFim)) {
      res.status(400).send({
        mensagem: 'Data fim da pesquisa está com formato incorreto',
      });
      return;
    }

    if (Util.quantidadeDias(req.query.dataInicio, req.query.dataFim) > 60) {
      res.status(400).send({
        mensagem: 'Intervalo superior a 60 dias corridos',
      });
      return;
    }

    const dataInicio = Util.converterEmDataIso(req.query.dataInicio);
    const dataFim = Util.converterEmDataIso(req.query.dataFim);

    const listaData = await db.sequelize.query(
      `
         SELECT DISTINCT "dataVinculo"  
         FROM  "VinculoProfissionalHorario" A
         WHERE  A."idProfissional"  = ${req.query.idProfissional}
         AND    A."indicadorAtivo"  = 'S'
         AND    A."dataVinculo" BETWEEN '${dataInicio}' AND '${dataFim}' 
         AND NOT EXISTS 
              (SELECT 1 
               FROM "Consulta" B 
               WHERE A."idProfissional" = B."idProfissional" 
               AND   A."idHorario"      = B."idHorario" 
               AND   A."dataVinculo"    = B."dataVinculo" 
               AND   B."indicadorConsultaCancelada" = 'N')
    `,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    const resposta = _(listaData).map((item) => ({
      data: Util.formatarData(item.dataVinculo),
    }));

    res.send(resposta);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send({ mensagem: 'Falha na recuperação da lista de datas disponíveis' });
  }
};

const listarHorarioDisponivel = async (req, res) => {
  try {
    if (req.query.idProfissional === undefined) {
      res
        .status(400)
        .send({ mensagem: 'Número do profissional não foi informado' });
      return;
    }

    const profissional = await db.Profissional.findOne({
      where: { idProfissional: req.query.idProfissional },
    });

    if (profissional === null) {
      res.status(400).send({ mensagem: 'Profissional não foi encontrado' });
      return;
    }

    if (req.query.dataPesquisa === undefined) {
      res.status(400).send({ mensagem: 'Data da pesquisa não foi informada' });
      return;
    }

    if (!Util.isDataValida(req.query.dataPesquisa)) {
      res.status(400).send({
        mensagem: 'Data da pesquisa está com formato incorreto',
      });
      return;
    }

    const data = Util.converterEmDataIso(req.query.dataPesquisa);
    const listaData = await db.sequelize.query(
      `
      SELECT H."idHorario", H."textoHorario"  
      FROM "VinculoProfissionalHorario" A, 
           "Horario" H
      WHERE A."idProfissional"  =  ${req.query.idProfissional}
      AND   A."indicadorAtivo"  =  'S'
      AND   A."dataVinculo"     =  '${data}'
      AND   H."idHorario"       =  A."idHorario"
      AND NOT EXISTS 
            (SELECT 1 
             FROM "Consulta" B 
             WHERE A."idProfissional"             = B."idProfissional" 
             AND   A."idHorario"                  = B."idHorario" 
             AND   A."dataVinculo"                = B."dataVinculo" 
             AND   B."indicadorConsultaCancelada" = 'N')
    `,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    const resposta = _(listaData).map((item) => ({
      idHorario: item.idHorario,
      horario: item.textoHorario,
    }));

    res.send(resposta);
  } catch (err) {
    res.status(400).send({
      mensagem: 'Falha na recuperação da lista de horários disponíveis',
    });
  }
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
        if (item.data === null || !Util.isDataValida(item.data)) {
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
                  dataVinculo: Util.converterEmDataIso(itemVinculo.data),
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

const habilitacao = async (
  situacaoAtivacao,
  mensagemErroAtivacao,
  req,
  res
) => {
  if (req.params.idProfissional === null) {
    res.status(400).send({
      mensagem: 'Número do profissional não foi informado',
    });
    return false;
  }

  try {
    const profissional = await db.Profissional.findOne({
      where: { idProfissional: req.params.idProfissional },
    });

    if (profissional === null) {
      res.status(400).send({
        mensagem: 'Profissional não foi encontrado',
      });
      return false;
    }

    if (profissional.indicadorAtivo === situacaoAtivacao) {
      res.status(400).send({
        mensagem: mensagemErroAtivacao,
      });
      return false;
    }

    await db.sequelize.transaction(async (t) => {
      await profissional.update(
        { indicadorAtivo: situacaoAtivacao },
        { transaction: t }
      );

      await db.HistoricoProfissional.create(
        {
          timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
          textoTipoAcao: 'A',
          idProfissional: profissional.idProfissional,
          nomeProfissional: profissional.nomeProfissional,
          indicadorAtivo: profissional.indicadorAtivo,
        },
        { transaction: t }
      );

      const resposta = {
        idProfissional: profissional.idProfissional,
      };
      res.send(resposta);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      mensagem: 'Falha na ativação do profissional',
    });
  }
};

const ativar = async (req, res) => {
  habilitacao('S', 'Profissional já está ativo', req, res);
};

const desativar = (req, res) => {
  habilitacao('N', 'Profissional já está desativado', req, res);
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
