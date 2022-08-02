const gerarRes = (objetoRetorno) => {
  return {
    status: () => {
      return {
        send: (resposta) => {
          if (
            objetoRetorno !== undefined &&
            objetoRetorno.setResposta !== undefined
          ) {
            objetoRetorno.setResposta(resposta);
          }
        },
      };
    },
    send: (resposta) => {
      objetoRetorno.setResposta(resposta);
    },
  };
};

const gerarResposta = () => {
  let resposta;

  const setResposta = (_resposta) => {
    resposta = _resposta;
  };

  const getResposta = () => {
    return resposta;
  };

  return { getResposta, setResposta };
};

const gerarApp = () => ({
  get: (url, funcao) => {
    funcao({}, {});
  },
  post: (url, funcao) => {
    funcao({}, {});
  },
});

module.exports = { gerarRes, gerarResposta, gerarApp };
