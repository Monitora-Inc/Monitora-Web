var servidorModel = require("../models/servidorModel");

// funcao de adicão de dados servidor
function editarServidor(req, res) {

}

function adicionarServidorJAVA(req, res) {
    let id = req.body.id;
    let nome = req.body.nome;
    let fkDataCenter = req.body.fkDataCenter;

    servidorModel.adicionarServidorJAVA(id, nome, fkDataCenter)
        .then(() => res.status(200).send("✅ Servidor cadastrado com sucesso!"))
        .catch(erro => {
            console.error(erro);

            //Aqui ele captura o erro configurado no Promise e caso seja o tipo específicado na model retornará um erro específico
            if (erro.tipo == "CONFLITO") {
                return res.status(409).send("Servidor já cadastrado");
            }
            res.status(500).send("Erro ao cadastrar servidor.");
        });
}

//Funcão de edicão de dados do servidor
function atualizarServidor(req, res) {
    let idServidor = req.params.id;
    let nomeServidor = req.body.nomeServidorServer;
    let idDatacenter = req.body.idDatacenterServer;
    let cpuAlerta = req.body.cpuAlertaServer;
    let cpuCritico = req.body.cpuCriticoServer;
    let ramAlerta = req.body.ramAlertaServer;
    let ramCritico = req.body.ramCriticoServer;
    let discoAlerta = req.body.discoAlertaServer;
    let discoCritico = req.body.discoCriticoServer;
    let redeAlertaPercent = req.body.redeAlertaPercentServer;
    let redeCriticoPercent = req.body.redeCriticoPercentServer;
    let redeAlertaMs = req.body.redeAlertaMsServer;
    let redeCriticoMs = req.body.redeCriticoMsServer;
    console.log(idServidor);
    if (idServidor == undefined) console.log("idServidor está como: " + idServidor)
    if (nomeServidor == undefined) console.log("nomeServidor está como: " + nomeServidor)
    if (idDatacenter == undefined) console.log("idDatacenter está como: " + idDatacenter)
    if (cpuAlerta == undefined) console.log("cpuAlerta está como: " + cpuAlerta)
    if (cpuCritico == undefined) console.log("cpuCritico está como: " + cpuCritico)
    if (ramAlerta == undefined) console.log("ramAlerta está como: " + ramAlerta)
    if (ramCritico == undefined) console.log("ramCritico está como: " + ramCritico)
    if (discoAlerta == undefined) console.log("discoAlerta está como: " + discoAlerta)
    if (discoCritico == undefined) console.log("discoCritico está como: " + discoCritico)
    if (redeAlertaPercent == undefined) console.log("redeAlertaPercent está como: " + redeAlertaPercent)
    if (redeCriticoPercent == undefined) console.log("redeCriticoPercent está como: " + redeCriticoPercent)
    if (redeAlertaMs == undefined) console.log("redeAlertaMs está como: " + redeAlertaMs)
    if (redeCriticoMs == undefined) console.log("redeCriticoMs está como: " + redeCriticoMs)

    servidorModel.atualizarServidor(idServidor, nomeServidor, idDatacenter, cpuAlerta, cpuCritico, ramAlerta, ramCritico, discoAlerta, discoCritico, redeAlertaPercent, redeCriticoPercent, redeAlertaMs, redeCriticoMs)
        .then(() => res.status(200).send("✅ Servidor atualizado com sucesso!"))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao atualizar servidor.");
        });
}





function excluirServidor(req, res) {
    let idServidor = req.params.id;

    servidorModel.excluirServidor(idServidor)
        .then(() => res.status(200).send("✅ Servidor excluído com sucesso!"))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao excluir servidor.");
        });
}

function listarServidores(req, res) {
    let idEmpresa = req.params.id;

    servidorModel.listarServidores(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao listar servidores.");
        });
}

function parametros(req, res) {
    let idServidor = req.params.id;

    servidorModel.parametros(idServidor)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao listar servidores.");
        });
}

function buscarNomeServidor(req, res) {
    let idServidor = req.params.id;

    servidorModel.buscarNomeServidor(idServidor)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao buscar nome do servidores.");
        });
}

module.exports = {
    // adicionarServidor,
    adicionarServidorJAVA,
    atualizarServidor,
    excluirServidor,
    listarServidores,
    parametros,
    buscarNomeServidor
};
