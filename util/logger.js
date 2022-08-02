const winston = require('winston');
const { format, transports } = winston;
const logform = require('logform');
const tripleBeam = require('triple-beam');
const path = require('path');
const _ = require('underscore');

const errorHunter = logform.format((info) => {
  if (info.error) return info;

  const splat = info[tripleBeam.SPLAT] || [];
  info.error = splat.find((obj) => obj instanceof Error);

  return info;
});

const errorPrinter = logform.format((info) => {
  if (!info.error) return info;

  // Handle case where Error has no stack.
  const errorMsg = info.error.stack || info.error.toString();
  info.message += `\n${errorMsg}`;

  return info;
});

const metaHunter = logform.format((info) => {
  if (info.meta) return info;

  const splat = info[tripleBeam.SPLAT] || [];
  info.meta = splat;

  return info;
});

const metaPrinter = logform.format((info) => {
  if (!info.meta) return info;

  _(info.meta).each((item) => {
    info.message += `\n${JSON.stringify(item)}`;
  });

  return info;
});

const winstonConsoleFormat = logform.format.combine(
  metaHunter(),
  metaPrinter(),
  errorHunter(),
  errorPrinter(),
  logform.format.printf(
    (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
  )
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
        format.label({ label: path.basename(require.main.filename) }),
        format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winstonConsoleFormat
      ),
    }),
  ],
});

module.exports = logger;
