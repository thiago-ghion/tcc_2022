const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

var passport = require('passport');

const seguranca = require('./api/seguranca');
const profissional = require('./api/profissional');
const consulta = require('./api/consulta');
const paciente = require('./api/paciente');
const horario = require('./api/horario');
const usuario = require('./api/usuario');
const estatistica = require('./api/estatistica');

app.use(function (req, res, next) {
  if (req.url.match('seguranca') || req.url.match('api-docs')) {
    next();
  } else {
    req.nivelUsuarioEndpoint = 99;
    listaAcesso.forEach((item) => {
      if (req.url.match(item.rota)) {
        req.nivelUsuarioEndpoint = item.nivel;
      }
    });

    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        if (err !== null && err.message !== null) {
          return res.status(401).json({
            message: err.message,
          });
        }
        return res.status(401).json({
          message: 'Token de acesso inválido',
        });
      } else {
        next();
      }
    })(req, res);
  }
}); 

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(cors());

const listaAcesso = [];

const incluirNivelAccesso = (_rota, nivel) => {
  const posicao = _rota.indexOf(':');
  let rota = _rota;
  if (posicao != -1) {
    rota = _rota.substring(0, posicao - 1);
  }

  listaAcesso.push({ rota, nivel });
};

seguranca.registrarMetodos(app, incluirNivelAccesso, passport);
profissional.registrarMetodos(app, incluirNivelAccesso);
consulta.registrarMetodos(app, incluirNivelAccesso);
paciente.registrarMetodos(app, incluirNivelAccesso);
horario.registrarMetodos(app, incluirNivelAccesso);
usuario.registrarMetodos(app, incluirNivelAccesso);
estatistica.registrarMetodos(app, incluirNivelAccesso);

app.listen(port, () => {});
