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

    if (!nome || !pais || !estado || !cidade || !rua || !fkempresa) {
        return res.status(400).send("Há campos obrigatórios vazios.");
    }

    DatacenterModel.adicionarDatacenter(nome, pais, estado, cidade, bairro, rua, num, complemento, fkempresa, longitude, latitude).then((resultado) => {
        res.status(200).send('Cadastro de datacenter realizado com sucesso!');
    }).catch(err => {
        console.error("Erro ao adicionar Datacenter: ", err);
        res.status(500).send("Erro ao adicionar Datacenter.");
    });
}

function buscarIDdatacenter(req, res) {
    let id = req.params.id;

    if (id == undefined){ 
        return res.status(400).send("ID obrigatório.")
    }

    DatacenterModel.buscarIDdatacenter(id).then((resultado) => {
        if (resultado.length == 1) {
           return res.status(200).json(resultado);
        } else {
           return res.status(403).send("ID do servidor não encontrada");
        }
    }).catch(err => {
        console.error("Erro ao buscar ID do Datacenter: ", err);
        res.status(500).send("Erro ao buscar ID do Datacenter.");
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
    }).catch(err => {
        console.error("Erro ao atualizar Datacenter: ", err);
        res.status(500).send("Erro ao atualizar Datacenter.");
    });
}

function excluirDatacenter(req, res) {
    let id = req.params.id;

    DatacenterModel.excluirDatacenter(id).then((resultado) => {
        res.status(200).json(resultado);
    }).catch(err => {
        console.error("Erro ao excluir Datacenter: ", err);
        res.status(500).send("Erro ao excluir Datacenter.");
    });
}

function buscarDatacenter(req, res) {
    let idEmpresa = req.params.idEmpresa;

    DatacenterModel.buscarDatacenter(idEmpresa).then((resultado) => {
        res.status(200).json(resultado);
    }).catch(err => {
        console.error("Erro ao buscar Datacenter: ", err);
        res.status(500).send("Erro ao buscar Datacenter.");
    });
}
function buscarLngLatNomeDatacenter(req, res) {
    let idDatacenter = req.params.idDatacenter;

    DatacenterModel.buscarLngLatNomeDatacenter(idDatacenter).then((resultado) => {
        res.status(200).json(resultado);
    }).catch(err => {
        console.error("Erro ao buscar Datacenter: ", err);
        res.status(500).send("Erro ao buscar Datacenter.");
    });
}

module.exports = {
    adicionarDatacenter,
    buscarIDdatacenter,
    atualizarDatacenter,
    excluirDatacenter,
    buscarDatacenter,
    buscarLngLatNomeDatacenter
}