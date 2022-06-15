CREATE TABLE "Horario" (
  "idHorario" int PRIMARY KEY,
  "textoHorario" char(5) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL
);

CREATE TABLE "HistoricoHorario" (
  "timestampHistorico" timestamp,
  "idHorario" int,
  "textoTipoAcao" char(1) NOT NULL,
  "textoHorario" char(5) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL,
  PRIMARY KEY ("timestampHistorico", "idHorario")
);

CREATE TABLE "Profissional" (
  "idProfissional" int PRIMARY KEY,
  "nomeProfissional" char(150) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL
);

CREATE TABLE "HistoricoProfissional" (
  "timestampHistorico" timestamp,
  "idProfissional" int,
  "textoTipoAcao" char(1) NOT NULL,
  "nomeProfissional" char(150) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL,
  PRIMARY KEY ("timestampHistorico", "idProfissional")
);

CREATE TABLE "Paciente" (
  "idPaciente" int PRIMARY KEY,
  "nomePaciente" char(150) NOT NULL,
  "numeroCPF" bigint,
  "dataNascimento" date,
  "numeroTelefone" bigint,
  "enderecoEmail" char(255),
  "tipoOrigemCadastro" int NOT NULL,
  "textoSenha" char(8)
);

CREATE TABLE "HistoricoPaciente" (
  "timestampHistorico" timestamp,
  "idPaciente" int,
  "textoTipoAcao" char(1) NOT NULL,
  "nomePaciente" char(150) NOT NULL,
  "numeroCPF" bigint,
  "dataNascimento" date,
  "numeroTelefone" bigint,
  "enderecoEmail" char(255),
  "tipoOrigemCadastro" int NOT NULL,
  "textoSenha" char(8),
  PRIMARY KEY ("timestampHistorico", "idPaciente")
);

CREATE TABLE "TipoOrigemCadastro" (
  "tipoOrigemCadastro" int PRIMARY KEY,
  "textoTipoOrigemCadastro" char(50) NOT NULL
);

CREATE TABLE "Colaborador" (
  "idColaborador" int PRIMARY KEY,
  "nomeColaborador" char(150) NOT NULL,
  "nomeUsuario" char(15) NOT NULL,
  "indicadorAdministrador" char(1) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL,
  "indicadorForcarTrocaSenha" char(1) NOT NULL,
  "textoSenha" char(8) NOT NULL
);

CREATE TABLE "HistoricoColaborador" (
  "timestampHistorico" timestamp,
  "idColaborador" int,
  "textoTipoAcao" char(1) NOT NULL,
  "nomeColaborador" char(150) NOT NULL,
  "nomeUsuario" char(15) NOT NULL,
  "indicadorAdministrador" char(1) NOT NULL,
  "indicadorAtivo" char(1) NOT NULL,
  "indicadorForcarTrocaSenha" char(1) NOT NULL,
  "textoSenha" char(8) NOT NULL,
  PRIMARY KEY ("timestampHistorico", "idColaborador")
);

CREATE TABLE "VinculoProfissionalHorario" (
  "idProfissional" int,
  "idHorario" int,
  "dataVinculo" date,
  "indicadorAtivo" char(1) NOT NULL,
  PRIMARY KEY ("idProfissional", "idHorario", "dataVinculo")
);

CREATE TABLE "Consulta" (
  "idProfissional" int,
  "idHorario" int,
  "dataVinculo" date,
  "idPaciente" int,
  "indicadorConsultaCancelada" char(1) NOT NULL,
  "tipoOrigemConsulta" int NOT NULL,
  "idColaborador" int,
  PRIMARY KEY ("idProfissional", "idHorario", "dataVinculo", "idPaciente")
);

CREATE TABLE "HistoricoConsulta" (
  "timestampHistorico" timestamp,
  "idProfissional" int,
  "idHorario" int,
  "dataVinculo" date,
  "idPaciente" int,
  "textoTipoAcao" char(1) NOT NULL,
  "indicadorConsultaCancelada" char(1) NOT NULL,
  "idTipoOrigemConsulta" int NOT NULL,
  "idColaborador" int,
  PRIMARY KEY ("timestampHistorico", "idProfissional", "idHorario", "dataVinculo", "idPaciente")
);

CREATE TABLE "TipoOrigemConsulta" (
  "tipoOrigemConsulta" int PRIMARY KEY,
  "textoTipoOrigemConsulta" char(50) NOT NULL
);

CREATE TABLE "TipoAcesso" (
  "tipoAcesso" int PRIMARY KEY,
  "textoTipoAcesso" char(50) NOT NULL
);

CREATE TABLE "RegistroAcesso" (
  "timestampAcesso" timestamp,
  "tipoAcesso" int,
  "credencialAcesso" char(255) NOT NULL,
  PRIMARY KEY ("timestampAcesso", "tipoAcesso")
);

ALTER TABLE "VinculoProfissionalHorario" ADD FOREIGN KEY ("idProfissional") REFERENCES "Profissional" ("idProfissional");

ALTER TABLE "VinculoProfissionalHorario" ADD FOREIGN KEY ("idHorario") REFERENCES "Horario" ("idHorario");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("idProfissional") REFERENCES "VinculoProfissionalHorario" ("idProfissional");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("idHorario") REFERENCES "VinculoProfissionalHorario" ("idHorario");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("dataVinculo") REFERENCES "VinculoProfissionalHorario" ("dataVinculo");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("idColaborador") REFERENCES "Colaborador" ("idColaborador");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("tipoOrigemConsulta") REFERENCES "TipoOrigemConsulta" ("tipoOrigemConsulta");

ALTER TABLE "Consulta" ADD FOREIGN KEY ("idPaciente") REFERENCES "Paciente" ("idPaciente");

ALTER TABLE "RegistroAcesso" ADD FOREIGN KEY ("tipoAcesso") REFERENCES "TipoAcesso" ("tipoAcesso");

ALTER TABLE "HistoricoHorario" ADD FOREIGN KEY ("idHorario") REFERENCES "Horario" ("idHorario");

ALTER TABLE "HistoricoProfissional" ADD FOREIGN KEY ("idProfissional") REFERENCES "Profissional" ("idProfissional");

ALTER TABLE "HistoricoPaciente" ADD FOREIGN KEY ("timestampHistorico") REFERENCES "Paciente" ("idPaciente");

ALTER TABLE "HistoricoColaborador" ADD FOREIGN KEY ("idColaborador") REFERENCES "Colaborador" ("idColaborador");

ALTER TABLE "HistoricoConsulta" ADD FOREIGN KEY ("idProfissional") REFERENCES "Consulta" ("idProfissional");

ALTER TABLE "HistoricoConsulta" ADD FOREIGN KEY ("idHorario") REFERENCES "Consulta" ("idHorario");

ALTER TABLE "HistoricoConsulta" ADD FOREIGN KEY ("dataVinculo") REFERENCES "Consulta" ("dataVinculo");

ALTER TABLE "HistoricoConsulta" ADD FOREIGN KEY ("idPaciente") REFERENCES "Consulta" ("idPaciente");

ALTER TABLE "Paciente" ADD FOREIGN KEY ("tipoOrigemCadastro") REFERENCES "TipoOrigemCadastro" ("tipoOrigemCadastro");
