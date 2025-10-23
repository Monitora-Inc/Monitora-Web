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

module.exports = {
    buscarCargos,
    adicionarCargo
}