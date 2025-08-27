CREATE DATABASE Monitora;

USE Monitora;

CREATE TABLE Empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    ativo TINYINT NOT NULL,
);

CREATE TABLE Usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT NOT NULL,
    fkEmpresa INT NOT NULL,
CONSTRAINT fkUsuarioEmpresa
	FOREIGN KEY(fkEmpresa)
    REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Servidor (
	uuid VARCHAR(100) PRIMARY KEY,
    modeloCPU VARCHAR(100) NOT NULL,
    qtdRam INT NOT NULL,
    qtdDisco INT NOT NULL,
    fkEmpresa INT NOT NULL,
CONSTRAINT fkServidorEmpresa
	FOREIGN KEY(fkEmpresa)
    REFERENCES Empresa(idEmpresa)
);

INSERT INTO Empresa(nome, cnpj, ativo) VALUES
	('Netflix', '12.345.789/0001-10', 1);

INSERT INTO Usuario(nome, email, senha, ativo, fkEmpresa) VALUES
	('João', 'joao@gmail.com', '1234', 1, 1);