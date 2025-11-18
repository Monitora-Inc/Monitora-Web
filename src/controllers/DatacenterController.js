var DatacenterModel = require("../models/DatacenterModel");

function adicionarDatacenter(req, res) {
    let nome = req.body.DcNomeServer
    let pais = req.body.DcPaisServer
    let estado = req.body.DcEstadoServer
    let cidade = req.body.DcCidadeServer
    let bairro = req.body.DcBairroServer
    let rua = req.body.DcRuaServer
    let num = req.body.DcNumServer
    let complemento = req.body.DcComplementoServer
    let fkempresa = req.body.fkEmpresa
    let longitude = req.body.longitudeServer
    let latitude = req.body.latitudeServer

    DatacenterModel.adicionarDatacenter(nome, pais, estado, cidade, bairro, rua, num, complemento, fkempresa, longitude, latitude).then((resultado) => {
        res.status(200).send('Cadastro de datacenter realizado com sucesso!');
    })
}

function buscarIDdatacenter(req, res) {
    let id = req.params.id;

    DatacenterModel.buscarIDdatacenter(id).then((resultado) => {
        if (resultado.length == 1) {
            res.status(200).json(resultado);
        } else {
            res.status(403).send("ID do servidor não encontrada");
        }
    });
}

function atualizarDatacenter(req, res) {
    let idDataCenter = req.params.id
    let nome = req.body.DcNomeServer
    let pais = req.body.DcPaisServer
    let estado = req.body.DcEstadoServer
    let cidade = req.body.DcCidadeServer
    let bairro = req.body.DcBairroServer
    let rua = req.body.DcRuaServer
    let num = req.body.DcNumServer
    let complemento = req.body.DcComplementoServer
    let fkEndereco = req.params.fkEndereco
    let longitude = req.body.longitudeServer
    let latitude = req.body.latitudeServer


    DatacenterModel.atualizarDatacenter(idDataCenter, nome, pais, estado, cidade, bairro, rua, num, complemento, fkEndereco, longitude, latitude).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function excluirDatacenter(req, res) {
    let id = req.params.id;

    DatacenterModel.excluirDatacenter(id).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function buscarDatacenter(req, res) {
    let idEmpresa = req.params.idEmpresa;

    DatacenterModel.buscarDatacenter(idEmpresa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    adicionarDatacenter,
    buscarIDdatacenter,
    atualizarDatacenter,
    excluirDatacenter,
    buscarDatacenter
}