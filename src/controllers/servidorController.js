var servidorModel = require("../models/servidorModel");

function adicionarServidor(req, res) {
    let uuid = req.body.uuid;
    let modeloCPU = req.body.modeloCPU;
    let qtdRam = req.body.qtdRam;
    let qtdDisco = req.body.qtdDisco;
    let sistemaOperacional = req.body.sistemaOperacional;
    let idEmpresa = req.body.idEmpresa;

    servidorModel.adicionarServidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional, idEmpresa).then((resultado) => {
        res.status(200).send("✅ Servidor cadastrado com sucesso!");
    });
}

function buscarServidorUUID(req, res) {
    let uuid = req.params.uuid;

    servidorModel.buscarServidorUUID(uuid).then((resultado) => {
        if(resultado.length == 1) {
            res.status(200).send("Servidor encontrado");
        } else {
            res.status(403).send("UUID do servidor não encontrada");    
        }
    });
}

function atualizarServidor(req, res) {
    let uuid = req.body.uuid;
    let modeloCPU = req.body.modeloCPU;
    let qtdRam = req.body.qtdRam;
    let qtdDisco = req.body.qtdDisco;
    let sistemaOperacional = req.body.sistemaOperacional;

    servidorModel.atualizarServidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional).then((resultado) => {
        res.status(200).send("✅ Servidor atualizado com sucesso!");
    });
}

function excluirServidor(req, res) {
    let uuid = req.params.uuid;

    servidorModel.excluirServidor(uuid).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function buscarServidores(req, res) {
    let idEmpresa = req.params.idEmpresa;

    servidorModel.buscarServidores(idEmpresa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    adicionarServidor,
    buscarServidorUUID,
    atualizarServidor,
    excluirServidor,
    buscarServidores
}