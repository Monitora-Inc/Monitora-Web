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

function autenticar(req, res) {
    var cnpj = req.params.cnpj;
    var senha = req.params.senha;

    empresaModel.autenticar(cnpj, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                empresaId: resultadoAutenticar[0].empresaId,
                empresaNome: resultadoAutenticar[0].empresaNome,
                empresaCnpj: resultadoAutenticar[0].empresaCnpj,
                empresaFoto: resultadoAutenticar[0].empresaFoto,
                empresaAtivo: resultadoAutenticar[0].empresaAtivo,
                empresaAprovada: resultadoAutenticar[0].empresaAprovada
            });
        } else {
            res.status(403).send("CNPJ e/ou senha inválido(s)");
        }
    });
}




function negarEmpresa(req, res) {
    let idEmpresa = req.params.idEmpresa;

    empresaModel.negarEmpresa(idEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function autorizarEmpresa(req, res) {
    let idEmpresa = req.params.idEmpresa;

    empresaModel.autorizarEmpresa(idEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function buscarEmpresas(req, res){
    empresaModel.buscarEmpresas().then((resultado) => {
        res.json(resultado);
    });
}

module.exports = {
    cadastrarEmpresa,
    autenticar,
    negarEmpresa,
    autorizarEmpresa,
    buscarEmpresas
}