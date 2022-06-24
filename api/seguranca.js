const grupoApi = 'seguranca';
const jwt = require('jsonwebtoken');
const db = require('.././models/index.js');

const SECRET = '38DNDJBB#@3JNEJNDJ3ECDL3dekwJI8hl@#';
const TEMPO_EXPIRACAO = 3000;
const TIPO_ACESSO_COLABORADOR = 1;
const TIPO_ACESSO_PACIENTE_INTERNO = 2;
const TIPO_ACESSO_PACIENTE_EXTERNO = 3;

function registrarMetodos(app, incluirNivelAccesso, passport) {
  const LocalStrategy = require('passport-local').Strategy;
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'usuario',
        passwordField: 'senha',
        passReqToCallback: true,
      },
      async (req, _usuario, senha, done) => {
        const usuario = _usuario.toLocaleLowerCase();

        if (req.body.tipoLogin !== 1 && req.body.tipoLogin !== 2) {
          return done(
            { message: 'Tipo de autenticação não esperado' },
            null,
            {}
          );
        }

        if (req.body.tipoLogin === 2) {
          try {
            const colaborador = await db.Colaborador.findOne({
              where: { nomeUsuario: usuario },
            });

            if (colaborador === null) {
              return done({ message: 'Usuário/Senha inválido' }, null, {});
            }

            if (
              colaborador.textoSenha === senha &&
              colaborador.indicadorAtivo === 'S'
            ) {
              await db.RegistroAcesso.create({
                timestampAcesso: db.sequelize.literal('CURRENT_TIMESTAMP'),
                tipoAcesso: TIPO_ACESSO_COLABORADOR,
                credencialAcesso: usuario,
              });

              return done(
                null,
                {
                  id: colaborador.idColaborador,
                  usuario: colaborador.nomeUsuario,
                  nome: colaborador.nomeColaborador,
                  nivelUsuario:
                    colaborador.indicadorAdministrador === 'S' ? 3 : 2,
                },
                {}
              );
            } else {
              return done({ message: 'Usuário/Senha inválido' }, null, {});
            }
          } catch {
            return done(
              { message: 'Falha na consulta da autenticação' },
              null,
              {}
            );
          }
        }
      }
    )
  );

  const passportJWT = require('passport-jwt');
  const JWTStrategy = passportJWT.Strategy;
  const ExtractJWT = passportJWT.ExtractJwt;

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET,
        passReqToCallback: true,
      },
      function (req, jwtPayload, done) {
        try {
          const nivelUsuarioEndpoint = req.nivelUsuarioEndpoint || 99;

          if (jwtPayload.nivelUsuario < nivelUsuarioEndpoint) {
            return done(
              { message: 'Usuário não possui acesso a funcionalidade' },
              null
            );
          }
          return done(null, {});
        } catch {}
      }
    )
  );

  app.post(`/v1/${grupoApi}/login`, (req, res) => {
    req.body.tipoLogin = 1;
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: err.message,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = gerarJWT(user, res);
        return res.json(token);
      });
    })(req, res);
  });

  app.post(`/v1/${grupoApi}/loginColaborador`, (req, res) => {
    req.body.tipoLogin = 2;
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: err.message,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = gerarJWT(user, res);
        return res.json(token);
      });
    })(req, res);
  });

  app.post(`/v1/${grupoApi}/trocarSenhaPaciente`, (req, res) => {
    trocarSenhaPaciente(req, res);
  });

  app.post(`/v1/${grupoApi}/trocarSenhaColaborador`, (req, res) => {
    trocarSenhaColaborador(req, res);
  });

  app.post(`/v1/${grupoApi}/oauth/facebook/login`, (req, res) => {
    loginFacebook(req, res);
  });

  app.get(`/v1/${grupoApi}/oauth/facebook/callback`, (req, res) => {
    callbackFacebook(req, res);
  });

  app.post(`/v1/${grupoApi}/oauth/google/login`, (req, res) => {
    loginGoogle(req, res);
  });

  app.get(`/v1/${grupoApi}/oauth/google/callback`, (req, res) => {
    callbackGoogle(req, res);
  });
}

function gerarJWT(user) {
  const token = jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      nome: user.nome,
      nivelUsuario: user.nivelUsuario,
    },
    SECRET,
    {
      expiresIn: TEMPO_EXPIRACAO,
    }
  );
  return {
    id: user.id,
    nome: user.nome,
    nivelUsuario: user.nivelUsuario,
    access_token: token,
  };
}

function trocarSenhaPaciente(req, res) {
  const resposta = { id: 234, nome: 'Fulano da Silva' };
  res.send(resposta);
}

function trocarSenhaColaborador(req, res) {
  const resposta = { id: 234, nome: 'Fulano da Silva' };
  res.send(resposta);
}

function loginFacebook(req, res) {
  res.redirect('https://www.facebook.com/login');
}

function callbackFacebook(req, res) {
  const token = gerarJWT(req, res);
  return res.json(token);
}

function loginGoogle(req, res) {
  res.redirect('https://apis.google.com/js/platform.js');
}

function callbackGoogle(req, res) {
  const token = gerarJWT(req, res);
  return res.json(token);
}

module.exports = { registrarMetodos };
