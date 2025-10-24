let cargoModel = require("../models/cargoModel");

function buscarCargos(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    cargoModel.buscarCargos(fkEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function adicionarCargo(req, res) {
    let fkEmpresa = req.body.fkEmpresa;
    let nomeCargo = req.body.nomeCargo;

    cargoModel.adicionarCargo(fkEmpresa, nomeCargo).then((resultado) => {
        res.json(resultado);
    });
}

function deletarCargo(req, res) {
    let cargoId = req.params.cargoId;

    cargoModel.deletarCargo(cargoId).then((resultado) => {
        res.json(resultado);
    });
}

function listarPermissoes(req, res) {
    let idCargo = req.params.idCargo;

    cargoModel.listarPermissoes(idCargo).then((resultado) => {
        res.json(resultado);
    });
}

function adicionarPermissao(req, res) {
    let fkCargo = req.body.cargoId;
    let fkPermissao = req.body.permissaoId;

    cargoModel.adicionarPermissao(fkCargo, fkPermissao).then((resultado) => {
        res.json(resultado);
    });
}

function removerPermissao(req, res) {
    let cargoId = req.params.cargoId;
    let permissaoId = req.params.permissaoId;

    cargoModel.removerPermissao(cargoId, permissaoId).then((resultado) => {
        res.json(resultado);
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