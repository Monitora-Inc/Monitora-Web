var servidorModel = require("../models/servidorModel");

//funcao de adicão de dados servidor
// function adicionarServidor(req, res) {
//     let nome = req.body.nome;
//     let fkDataCenter = req.body.fkDataCenter;

//         servidorModel.adicionarServidor(nome, fkDataCenter)
//         .then(() => res.status(200).send("✅ Servidor cadastrado com sucesso!"))
//         .catch(erro => {
//             console.error(erro);
//             res.status(500).send("Erro ao cadastrar servidor.");
//         });
// }

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
    let nome = req.body.nome;
    let fkDataCenter = req.body.fkDataCenter;

    servidorModel.atualizarServidor(idServidor, nome, fkDataCenter)
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

module.exports = {
    // adicionarServidor,
    adicionarServidorJAVA,
    atualizarServidor,
    excluirServidor,
    listarServidores
};
