CREATE DATABASE IF NOT EXISTS Monitora;

USE Monitora;

CREATE TABLE Empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    ativo TINYINT NOT NULL,
    aprovada TINYINT NOT NULL DEFAULT 0
);

select * from empresa;

/*Empresas testes para a tela de aprovação*/
INSERT INTO Empresa (nome, cnpj, ativo, aprovada) VALUES
    ('Tech Solutions LTDA', '11.222.333/0001-44', 1, 0),
    ('StreamNow Serviços Digitais', '22.333.444/0001-55', 1, 0),
    ('CloudHost Brasil', '33.444.555/0001-66', 1, 0),
    ('DataSecure Tecnologia', '44.555.666/0001-77', 1, 0),
    ('MediaWave Streaming', '55.666.777/0001-88', 1, 0);


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

select * from usuario where fkEmpresa = "1";

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
	('João', 'joao@gmail.com', '1234', 1, 1, 1, 1),
    ('Pedro', 'pedro@gmail.com', '1234', 1, 1, 1, 1);
    
    
SELECT * FROM Servidor
WHERE fkEmpresa = 1;

SELECT * FROM Usuario;
SELECT * FROM Empresa;

SELECT * FROM Cargo
WHERE fkEmpresa = 1;	