CREATE DATABASE Monitora;

USE Monitora;

CREATE TABLE Usuario (
	idUsuario INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT,
    PRIMARY KEY(idUsuario)
);

INSERT INTO Usuario(nome, email, senha, ativo) VALUES
	('João', 'joao@gmail.com', '1234', 1);