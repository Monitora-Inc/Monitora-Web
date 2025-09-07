CREATE DATABASE Monitora;

USE Monitora;

CREATE TABLE Empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    ativo TINYINT NOT NULL,
    aprovada TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE Cargo (
	idCargo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    fkEmpresa INT NOT NULL,
CONSTRAINT fkCargoEmpresa
	FOREIGN KEY(fkEmpresa)
    REFERENCES Empresa(idEmpresa)
);

CREATE TABLE Usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT NOT NULL,
    fkEmpresa INT NOT NULL,
    fkCargo INT NOT NULL,
    isAdmin TINYINT NOT NULL,
CONSTRAINT fkUsuarioEmpresa
	FOREIGN KEY(fkEmpresa)
    REFERENCES Empresa(idEmpresa),
CONSTRAINT fkUsuarioCargo
	FOREIGN KEY(fkCargo)
    REFERENCES Cargo(idCargo)
);

CREATE TABLE Servidor (
	uuid VARCHAR(100) PRIMARY KEY,
	fkEmpresa INT NOT NULL,
    modeloCPU VARCHAR(100) NOT NULL,
    qtdRam INT NOT NULL,
    qtdDisco INT NOT NULL,
    sistemaOperacional VARCHAR(100),
CONSTRAINT fkServidorEmpresa
	FOREIGN KEY(fkEmpresa)
    REFERENCES Empresa(idEmpresa)
);

INSERT INTO Empresa(nome, cnpj, ativo, aprovada) VALUES
	('Monitora', '12.345.789/0001-10', 1, 1);

INSERT INTO Cargo(nome, fkEmpresa) VALUES
	('Admin', 1);

INSERT INTO Usuario(nome, email, senha, ativo, fkEmpresa, fkCargo, isAdmin) VALUES
	('João', 'joao@gmail.com', '1234', 1, 1, 1, 1);
    
SELECT * FROM Servidor
WHERE fkEmpresa = 1;

SELECT * FROM Usuario;
SELECT * FROM Empresa;

SELECT * FROM Cargo
WHERE fkEmpresa = 1;	