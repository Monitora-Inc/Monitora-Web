let cargoModel = require("../models/cargoModel");

function buscarCargos(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    cargoModel.buscarCargos(fkEmpresa).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao buscar cargos: ", err);
        res.status(500).send("Erro ao buscar cargos.");
    });
}

function adicionarCargo(req, res) {
    let fkEmpresa = req.body.fkEmpresa;
    let nomeCargo = req.body.nomeCargo;

    cargoModel.adicionarCargo(fkEmpresa, nomeCargo).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao adicionar cargo: ", err);
        res.status(500).send("Erro ao adicionar cargo.");
    });
}

function deletarCargo(req, res) {
    let cargoId = req.params.cargoId;

    cargoModel.deletarCargo(cargoId).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao deletar cargo: ", err);
        res.status(500).send("Erro ao deletar cargo.");
    });
}

function listarPermissoes(req, res) {
    let idCargo = req.params.idCargo;

    cargoModel.listarPermissoes(idCargo).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao listar permissões: ", err);
        res.status(500).send("Erro ao listar permissões.");
    });
}

function adicionarPermissao(req, res) {
    let fkCargo = req.body.cargoId;
    let fkPermissao = req.body.permissaoId;

    cargoModel.adicionarPermissao(fkCargo, fkPermissao).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao adicionar permissão: ", err);
        res.status(500).send("Erro ao adicionar permissão.");
    });
}

function removerPermissao(req, res) {
    let cargoId = req.params.cargoId;
    let permissaoId = req.params.permissaoId;

    cargoModel.removerPermissao(cargoId, permissaoId).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao remover permissão: ", err);
        res.status(500).send("Erro ao remover permissão.");
    });
}

module.exports = {
    buscarCargos,
    adicionarCargo,
    deletarCargo,
    listarPermissoes,
    adicionarPermissao,
    removerPermissao
}