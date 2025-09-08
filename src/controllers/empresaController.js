var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
    let nome = req.body.nomeEmpresaServer;
    let cnpj = req.body.cnpjServer;

    empresaModel.cadastrarEmpresa(nome, cnpj).then((resultado) => {
        res.json(resultado);
    });
}

function negarEmpresa(req, res) {
    let idEmpresa = req.params.idEmpresa;

    empresaModel.negarEmpresa(idEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

module.exports = {
    cadastrarEmpresa,
    negarEmpresa
}