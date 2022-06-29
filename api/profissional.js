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

  const listarConfiguracaoHorarioURL = `/v1/${grupoApi}/listarConfiguracaoHorario`;
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

  const consultarVinculoURL = `/v1/${grupoApi}/consultarVinculo`;
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

const listarConfiguracaoHorario = async (req, res) => {
  try {
    if (req.query.idProfissional === undefined) {
      res.status(400).send({
        mensagem: 'Número do profissional não informado',
      });
    }

    if (req.query.dataPesquisa === undefined) {
      res.status(400).send({
        mensagem: 'Data de pesquisa não informada',
      });
    }

    if (!Util.isDataValida(req.query.dataPesquisa)) {
      res.status(400).send({
        mensagem: 'Data de pesquisa com formato inválido',
      });
    }

    const lista = await db.sequelize.query(
      `
      SELECT H."idHorario", 
             H."textoHorario"
      FROM  "VinculoProfissionalHorario" A, 
             "Horario" H
      WHERE  A."idProfissional" = ${req.query.idProfissional}
      AND    A."dataVinculo"    = '${Util.converterEmDataIso(
        req.query.dataPesquisa
      )}'
      AND    h."idHorario"      = a."idHorario"
      AND    A."indicadorAtivo" = 'S'
      `,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    const resposta = _(lista).map((item) => ({
      idHorario: item.idHorario,
      horario: item.textoHorario,
    }));

    res.send(resposta);
  } catch (error) {
    res.status(400).send({
      mensagem: 'Falha na consulta da configuração de horário do profissional',
    });
  }
};

const validarProfissional = async (req, res, isAlteracao) => {
  try {
    if (isAlteracao) {
      if (req.params.idProfissional === undefined) {
        res
          .status(400)
          .send({ mensagem: 'Número do profissional não foi preenchido' });
        return false;
      }

      const profissional = await db.Profissional.findOne({
        where: { idProfissional: req.params.idProfissional },
      });
      if (profissional === null) {
        res.status(400).send({ mensagem: 'Profissional não foi encontrado' });
        return false;
      }
    }

    if (
      req.body.nomeProfissional === undefined ||
      req.body.nomeProfissional === ''
    ) {
      res
        .status(400)
        .send({ mensagem: 'Nome do profissional não foi preenchido' });
      return false;
    }

    if (req.body.vinculoDataHorario !== undefined) {
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

      if (!isAlteracao) {
        return true;
      }

      const listaPromise = [];
      _(req.body.vinculoDataHorario).each((itemVinculo) => {
        _(itemVinculo.listaHorario).each((itemHorario) => {
          listaPromise.push(
            new Promise(async (success, reject) => {
              const vinculo = await db.VinculoProfissionalHorario.findOne({
                where: {
                  idProfissional: req.params.idProfissional,
                  idHorario: itemHorario.idHorario,
                  dataVinculo: Util.converterEmDataIso(itemVinculo.data),
                },
              });

              // Não tem vinculo registro
              if (vinculo === null) {
                // Se for ativação, incluir no vinculo, caso contrário descartar
                if (itemHorario.acao === 'A') {
                  itemHorario.acaoSQL = 'I';
                } else {
                  itemHorario.acaoSQL = 'N';
                }
              } else {
                itemHorario.acaoSQL = 'N';
                itemHorario.vinculo = vinculo;
                switch (vinculo.indicadorAtivo) {
                  // Se vinculo ativo e acao desativar, atualizar vinculo, caso contrário descartar
                  case 'S':
                    if (itemHorario.acao === 'D') {
                      itemHorario.acaoSQL = 'A';
                    }
                    break;
                  // Se vinculo inativo e acao ativar, atualizar vinculo, caso contrário descartar
                  case 'N':
                    if (itemHorario.acao === 'A') {
                      itemHorario.acaoSQL = 'A';
                    }
                    break;
                  default:
                    break;
                }
              }
              success();
            })
          );
        });
      });

      await Promise.all(listaPromise);
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
    const isValido = await validarProfissional(req, res, false);

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

const alterar = async (req, res) => {
  try {
    const isValido = await validarProfissional(req, res, true);
    if (isValido) {
      const profissional = await db.Profissional.findOne({
        where: {
          idProfissional: req.params.idProfissional,
        },
      });

      if (profissional === null) {
        res.status(400).send({ mensagem: 'Profissional não encontrado' });
        return false;
      }

      await db.sequelize.transaction(async (t) => {
        await profissional.update(
          { nomeProfissional: req.body.nomeProfissional },
          {
            transaction: t,
          }
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

        const listaPromise = [];
        _(req.body.vinculoDataHorario).each((itemVinculo) => {
          _(itemVinculo.listaHorario).each((itemHorario) => {
            switch (itemHorario.acaoSQL) {
              case 'I':
                listaPromise.push(
                  db.VinculoProfissionalHorario.create(
                    {
                      idProfissional: req.params.idProfissional,
                      idHorario: itemHorario.idHorario,
                      dataVinculo: Util.converterEmDataIso(itemVinculo.data),
                      indicadorAtivo: itemHorario.acao === 'A' ? 'S' : 'N',
                    },
                    { transaction: t }
                  )
                );
                break;
              case 'A':
                listaPromise.push(
                  itemHorario.vinculo.update(
                    { indicadorAtivo: itemHorario.acao === 'A' ? 'S' : 'N' },
                    { transaction: t }
                  )
                );
                break;
              default:
                break;
            }
          });
        });

        await Promise.all(listaPromise);
      });

      const resposta = {
        idProfissional: req.params.idProfissional,
      };
      res.send(resposta);
    }
  } catch (err) {
    res.status(400).send({ mensagem: 'Falha na alteração do profissional' });
  }
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

const consultarVinculo = async (req, res) => {
  try {
    if (req.query.idProfissional === undefined) {
      res.status(400).send({
        mensagem: 'Número do profissional não informado',
      });
    }

    if (req.query.dataPesquisa === undefined) {
      res.status(400).send({
        mensagem: 'Data de pesquisa não informada',
      });
    }

    if (!Util.isDataValida(req.query.dataPesquisa)) {
      res.status(400).send({
        mensagem: 'Data de pesquisa com formato inválido',
      });
    }

    const lista = await db.sequelize.query(
      `
      SELECT H."idHorario", 
             H."textoHorario", 
             A."indicadorAtivo" 
      FROM  "VinculoProfissionalHorario" A, 
             "Horario" H
      WHERE  A."idProfissional" = ${req.query.idProfissional}
      AND    A."dataVinculo"    = '${Util.converterEmDataIso(
        req.query.dataPesquisa
      )}'
      AND    h."idHorario"      = a."idHorario"
      `,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    const resposta = _(lista).map((item) => ({
      idHorario: item.idHorario,
      horario: item.textoHorario,
      indicadorAtivo: item.indicadorAtivo,
    }));

    res.send(resposta);
  } catch (error) {
    res.status(400).send({
      mensagem: 'Falha na consulta do vínculo de horário do profissional',
    });
  }
};

module.exports = { registrarMetodos };
