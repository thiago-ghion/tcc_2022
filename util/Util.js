const moment = require('moment');

const isDataValida = (data) => {
  if (data === null) {
    return false;
  }

  if (data === '') {
    return false;
  }

  return moment(data, 'DD.MM.YYYY').isValid();
};

const quantidadeDias = (_dataInicio, _dataFim) => {
  if (!isDataValida(_dataInicio)) {
    throw Error('Data início inválida');
  }

  if (!isDataValida(_dataFim)) {
    throw Error('Data fim inválida');
  }

  const dataInicio = moment(_dataInicio, 'DD.MM.YYYY').startOf('day');
  const dataFim = moment(_dataFim, 'DD.MM.YYYY').startOf('day');

  if (dataFim.isBefore(dataInicio)) {
    throw Error('Data fim anterior a data início');
  }

  return dataFim.diff(dataInicio, 'days');
};

const converterEmDataIso = (data) => moment(data, 'DD.MM.YYYY').toISOString();

const formatarData = (data) => moment(data).format('DD.MM.YYYY');

module.exports = {
  isDataValida,
  quantidadeDias,
  converterEmDataIso,
  formatarData,
};
