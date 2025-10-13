var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
    let nome = req.body.nomeServer;
    let cnpj = req.body.cnpjServer;
    let senha = req.body.senhaServer;
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }
    if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    }
    if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }

    empresaModel.cadastrarEmpresa(nome, cnpj, senha).then((resultado) => {
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