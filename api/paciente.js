const grupoApi = 'paciente';
const db = require('.././models/index.js');
const _ = require('underscore');
const Util = require('../util/Util');

const registrarMetodos = (app, incluirNivelAccesso) => {
  const listarURL = `/v1/${grupoApi}/listar`;
  incluirNivelAccesso(listarURL, 2);
  app.get(listarURL, (req, res) => {
    listarTodos(req, res);
  });

  const consultarURL = `/v1/${grupoApi}/consultar`;
  incluirNivelAccesso(consultarURL, 2);
  app.get(consultarURL, (req, res) => {
    consultar(req, res);
  });

  const registrarURL = `/v1/${grupoApi}/registrar`;
  incluirNivelAccesso(registrarURL, 2);
  app.post(registrarURL, (req, res) => {
    registrar(req, res);
  });

  const alterarURL = `/v1/${grupoApi}/alterar/:idPaciente`;
  incluirNivelAccesso(alterarURL, 2);
  app.post(alterarURL, (req, res) => {
    alterar(req, res);
  });
};

const listarTodos = async (req, res) => {
  try {
    const lista = await db.Paciente.findAll();

    const resposta = _(lista).map((item) => ({
      idPaciente: item.idPaciente,
      nomePaciente: item.nomePaciente,
    }));

    res.send(resposta);
  } catch (error) {
    res
      .status(400)
      .send({ mensagem: 'Falha na consulta da lista de pacientes' });
  }
};

const consultar = async (req, res) => {
  try {
    if (req.query.idPaciente === undefined) {
      res.status(400).send({ mensagem: 'Número do paciente não informado' });
      return;
    }

    const paciente = await db.Paciente.findOne({
      where: { idPaciente: req.query.idPaciente },
    });

    if (paciente === null) {
      res.status(400).send({ mensagem: 'Paciente não encontrado' });
      return;
    }

    const resposta = {
      idPaciente: paciente.idPaciente,
      nomePaciente: paciente.nomePaciente,
      numeroCPF: paciente.numeroCPF,
      dataNascimento:
        paciente.dataNascimento !== null
          ? Util.formatarData(paciente.dataNascimento)
          : null,
      numeroTelefone: paciente.numeroTelefone,
      enderecoEmail: paciente.enderecoEmail,
    };

    res.send(resposta);
  } catch (error) {
    console.log(error);
    res.status(400).send({ mensagem: 'Falha na consulta do paciente' });
  }
};

const validarPaciente = (req, res) => {
  try {
    if (req.body.nomePaciente === undefined) {
      res.status(400).send({ mensagem: 'Nome do paciente não informado' });
      return false;
    }

    if (
      req.body.numeroCPF !== undefined &&
      !Util.isCPFValido(req.body.numeroCPF)
    ) {
      res.status(400).send({ mensagem: 'CPF do paciente inválido' });
      return false;
    }

    if (
      req.body.dataNascimento !== undefined &&
      !Util.isDataValida(req.body.dataNascimento)
    ) {
      res.status(400).send({ mensagem: 'CPF do paciente inválido' });
      return false;
    }

    if (
      req.body.numeroTelefone !== undefined &&
      !Util.isTelefoneValido(req.body.numeroTelefone)
    ) {
      res.status(400).send({ mensagem: 'Telefone do paciente inválido' });
      return false;
    }

    if (
      req.body.enderecoEmail !== undefined &&
      !Util.isEmailValido(req.body.enderecoEmail)
    ) {
      res.status(400).send({ mensagem: 'Email do paciente inválido' });
      return false;
    }
  } catch (error) {
    res
      .status(400)
      .send({ mensagem: 'Falha validação do registro do paciente' });
    return false;
  }

  return true;
};

const registrar = async (req, res) => {
  try {
    if (!validarPaciente(req, res)) {
      return false;
    }

    if (req.body.enderecoEmail !== undefined) {
      const paciente = await db.Paciente.findOne({
        where: {
          enderecoEmail: Util.formatarMinusculo(req.body.enderecoEmail),
        },
      });
      if (paciente !== null) {
        res.status(400).send({
          mensagem: 'Email informado já está registrado para outro paciente',
        });
        return;
      }
    }

    await db.sequelize.transaction(async (t) => {
      const paciente = await db.Paciente.create(
        {
          nomePaciente: req.body.nomePaciente,
          numeroCPF:
            req.body.numeroCPF !== undefined ? req.body.numeroCPF : null,
          dataNascimento:
            req.body.dataNascimento !== undefined
              ? Util.converterEmDataIso(req.body.dataNascimento)
              : null,
          numeroTelefone:
            req.body.numeroTelefone !== undefined
              ? req.body.numeroTelefone
              : null,
          enderecoEmail:
            req.body.enderecoEmail !== undefined
              ? Util.formatarMinusculo(req.body.enderecoEmail)
              : null,
          tipoOrigemCadastro: 1,
        },
        { transaction: t }
      );

      await db.HistoricoPaciente.create(
        {
          timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
          textoTipoAcao: 'I',
          idPaciente: paciente.idPaciente,
          numeroPaciente: paciente.numeroPaciente,
          nomePaciente: paciente.nomePaciente,
          numeroCPF: paciente.numeroCPF,
          dataNascimento: paciente.dataNascimento,
          numeroTelefone: paciente.numeroTelefone,
          enderecoEmail: Util.formatarMinusculo(paciente.enderecoEmail),
          tipoOrigemCadastro: paciente.tipoOrigemCadastro,
        },
        { transaction: t }
      );

      const resposta = {
        idPaciente: paciente.idPaciente,
        nomePaciente: paciente.nomePaciente,
        numeroCPF: paciente.numeroCPF,
        dataNascimento:
          paciente.dataNascimento !== null
            ? Util.formatarData(paciente.dataNascimento)
            : null,
        numeroTelefone: paciente.numeroTelefone,
        enderecoEmail: paciente.enderecoEmail,
      };

      res.status(201).send(resposta);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ mensagem: 'Falha no registro do paciente' });
  }
};

const alterar = async (req, res) => {
  try {
    if (req.params.idPaciente === undefined) {
      res
        .status(400)
        .send({ mensagem: 'Número do paciente não foi informado' });
      return;
    }

    if (!validarPaciente(req, res)) {
      return false;
    }

    const paciente = await db.Paciente.findOne({
      where: { idPaciente: req.params.idPaciente },
    });

    if (paciente === null) {
      res.status(400).send({ mensagem: 'Paciente não encontrado' });
      return;
    }

    await db.sequelize.transaction(async (t) => {
      paciente.update(
        {
          nomePaciente: req.body.nomePaciente,
          numeroCPF:
            req.body.numeroCPF !== undefined ? req.body.numeroCPF : null,
          dataNascimento:
            req.body.dataNascimento !== undefined
              ? Util.converterEmDataIso(req.body.dataNascimento)
              : null,
          numeroTelefone:
            req.body.numeroTelefone !== undefined
              ? req.body.numeroTelefone
              : null,
          enderecoEmail:
            req.body.enderecoEmail !== undefined
              ? Util.formatarMinusculo(req.body.enderecoEmail)
              : null,
          tipoOrigemCadastro: 1,
        },
        { transaction: t }
      );

      await db.HistoricoPaciente.create(
        {
          timestampHistorico: db.sequelize.literal('CURRENT_TIMESTAMP'),
          textoTipoAcao: 'A',
          idPaciente: paciente.idPaciente,
          numeroPaciente: paciente.numeroPaciente,
          nomePaciente: paciente.nomePaciente,
          numeroCPF: paciente.numeroCPF,
          dataNascimento: paciente.dataNascimento,
          numeroTelefone: paciente.numeroTelefone,
          enderecoEmail: Util.formatarMinusculo(paciente.enderecoEmail),
          tipoOrigemCadastro: paciente.tipoOrigemCadastro,
        },
        { transaction: t }
      );

      const resposta = {
        idPaciente: paciente.idPaciente,
        nomePaciente: paciente.nomePaciente,
        numeroCPF: paciente.numeroCPF,
        dataNascimento:
          paciente.dataNascimento !== null
            ? Util.formatarData(paciente.dataNascimento)
            : null,
        numeroTelefone: paciente.numeroTelefone,
        enderecoEmail: paciente.enderecoEmail,
      };

      res.send(resposta);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ mensagem: 'Falha na alteração do paciente' });
  }
};

module.exports = { registrarMetodos };
