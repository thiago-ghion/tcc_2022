const grupoApi = 'horario';
const db = require('.././models/index.js');

const registrarMetodos = (app, incluirNivelAccesso) => {
  const registroURL = `/v1/${grupoApi}/registrar/:horario`;
  incluirNivelAccesso(registroURL, 3);
  app.post(registroURL, (req, res) => {
    registrar(req, res);
  });

  const listarURL = `/v1/${grupoApi}/listar`;
  incluirNivelAccesso(listarURL, 2);
  app.get(listarURL, (req, res) => {
    listar(req, res);
  });

  const ativarURL = `/v1/${grupoApi}/ativar/:idHorario`;
  incluirNivelAccesso(ativarURL, 3);
  app.post(ativarURL, (req, res) => {
    ativar(req, res);
  });

  const desativarURL = `/v1/${grupoApi}/desativar/:idHorario`;
  incluirNivelAccesso(desativarURL, 3);
  app.post(desativarURL, (req, res) => {
    desativar(req, res);
  });
};

const registrar = async (req, res) => {
  if (isHorarioValido(req, res)) {
    try {
      const horario = await db.Horario.findOne({
        where: { textoHorario: req.params.horario },
      });

      if (horario) {
        res.status(400).send({ mensagem: 'Horário já está parametrizado' });
        return;
      }

      await db.sequelize.transaction(async (t) => {
        const resultado = await db.Horario.create(
          {
            textoHorario: req.params.horario,
            indicadorAtivo: 'S',
          },
          { transaction: t }
        );

        const resposta = {
          idHorario: resultado.idHorario,
        };

        await db.HistoricoHorario.create(
          {
            timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
            textoTipoAcao: 'I',
            idHorario: resultado.idHorario,
            textoHorario: req.params.horario,
            indicadorAtivo: 'S',
          },
          { transaction: t }
        );

        res.status(201).send(resposta);
      });
    } catch (err) {
      res.status(400).send({ mensagem: 'Falha na inclusão do horário' });
    }
  }
};

const listar = async (req, res) => {
  try {
    const horarios = await db.Horario.findAll({
      order: [['textoHorario', 'ASC']],
    });

    if (horarios !== null) {
      res.send(
        horarios.map((item) => {
          return {
            idHorario: item.idHorario,
            horario: item.textoHorario,
            indicadorAtivo: item.indicadorAtivo,
          };
        })
      );
    } else {
      res.send([]);
    }
  } catch (err) {
    res.status(400).send({ mensagem: 'Falha na consulta do horário' });
  }
};

const manutencaoSituacao = async (situacao, req, res) => {
  try {
    const registro = await db.Horario.findOne({
      where: { idHorario: req.params.idHorario },
    });
    if (registro === null) {
      res.status(400).send({ mensagem: 'Registro de horário não encontrado' });
    } else {
      if (registro.indicadorAtivo === situacao) {
        const mensagem = `Horário já está na situação ${
          situacao === 'S' ? 'ativado' : 'desativado'
        }`;
        res.status(400).send({ mensagem });
        return;
      }

      const vinculo = await db.sequelize.query(
        `
        SELECT 1 
        FROM   "VinculoProfissionalHorario" 
        WHERE  "idHorario" = ${req.params.idHorario}
        AND    "indicadorAtivo" = 'S'
        AND    "dataVinculo" >= current_date 
      `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      if (vinculo.length !== 0) {
        res.status(400).send({
          mensagem:
            'Horário possui profissional vinculado, desative o vínculo antes de prosseguir',
        });
        return;
      }

      await db.sequelize.transaction(async (t) => {
        await registro.update({ indicadorAtivo: situacao }, { transaction: t });
        await db.HistoricoHorario.create(
          {
            timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
            textoTipoAcao: 'A',
            idHorario: registro.idHorario,
            textoHorario: registro.textoHorario,
            indicadorAtivo: situacao,
          },
          { transaction: t }
        );

        res.send({ idHorario: registro.idHorario });
      });
    }
  } catch (err) {
    res.status(400).send({ mensagem: 'Falha na ativação do horário' });
  }
};

const ativar = async (req, res) => {
  manutencaoSituacao('S', req, res);
};

const desativar = async (req, res) => {
  manutencaoSituacao('N', req, res);
};

const isHorarioValido = (req, res) => {
  const pattern = '^([01][0-9]|2[0-3]):[0-5][0-9]$';
  const horario = req.params.horario;

  if (horario === undefined) {
    res.status(400).send({ mensagem: 'O horário não foi informado' });
    return false;
  }

  if (!horario.match(pattern)) {
    res.status(400).send({ mensagem: 'Horário fora do padrão - HH:MM' });
    return false;
  }

  return true;
};

module.exports = {
  registrarMetodos,
  registrar,
  listar,
  manutencaoSituacao,
  ativar,
  desativar,
  isHorarioValido,
};
