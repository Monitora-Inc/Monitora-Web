let cargoModel = require("../models/cargoModel");

function buscarCargos(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    cargoModel.buscarCargos(fkEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

module.exports = {
    buscarCargos
}