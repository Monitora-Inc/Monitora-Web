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
            res.status(500).send("Erro ao cadastrar servidor.");
        });
}

//Funcão de edicão de dados do servidor

function atualizarServidor(req, res) {
    let idServidor = req.params.id;
    let nomeServidor = req.body.nomeServidorServer;
    let idDatacenter = req.body.idDatacenterServer;
    let cpuLimite = req.body.cpuLimiteServer;
    let ramLimite = req.body.ramLimiteServer;
    let discoLimite = req.body.discoLimiteServer;
    let redeLimitePercent = req.body.redeLimitePercentServer;
    let redeLimiteMs = req.body.redeLimiteMsServer
    console.log(idServidor);
    if(idServidor == undefined) console.log("idServidor está como: " + idServidor)
    if(nomeServidor == undefined) console.log("nomeServidor está como: " + nomeServidor)
    if(idDatacenter == undefined) console.log("idDatacenter está como: " + idDatacenter)
    if(cpuLimite == undefined) console.log("cpuLimite está como: " + cpuLimite)
    if(ramLimite == undefined) console.log("ramLimite está como: " + ramLimite)
    if(discoLimite == undefined) console.log("discoLimite está como: " + discoLimite)
    if(redeLimitePercent == undefined) console.log("redeLimitePercent está como: " + redeLimitePercent)
    if(redeLimiteMs == undefined) console.log("redeLimiteMs está como: " + redeLimiteMs)

    servidorModel.atualizarServidor(idServidor, nomeServidor, idDatacenter, cpuLimite, ramLimite, discoLimite, redeLimitePercent, redeLimiteMs)
        .then(() => res.status(200).send("✅ Servidor atualizado com sucesso!"))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao atualizar servidor.");
        });
}





//Não está excluindo, parametro vindo como undefined
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

module.exports = {
    // adicionarServidor,
    adicionarServidorJAVA,
    atualizarServidor,
    excluirServidor,
    listarServidores,
    parametros
};
