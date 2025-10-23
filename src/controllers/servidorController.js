var servidorModel = require("../models/servidorModel");

function adicionarServidor(req, res) {
    let nome = req.body.nome;
    let fkDataCenter = req.body.fkDataCenter;
    let limite = req.body.limite; // limite da CPU, por exemplo
    let nomeComponenteId = req.body.nomeComponenteId;
    let medidaId = req.body.medidaId;

    // 1️⃣ Inserir servidor
    servidorModel.adicionarServidor(nome, fkDataCenter)
    .then(resultadoServidor => {
        let idServidor = resultadoServidor.insertId;

        // 2️⃣ Inserir parâmetro (limite)
        servidorModel.adicionarParametro(limite)
        .then(resultadoParametro => {
            let idParametro = resultadoParametro.insertId;

            // 3️⃣ Inserir componente
            servidorModel.adicionarComponente(nomeComponenteId, idServidor, medidaId, idParametro)
            .then(() => {
                res.status(201).send("✅ Servidor e componente cadastrados com sucesso!");
            })
            .catch(erro => {
                console.error(erro);
                res.status(500).send("Erro ao cadastrar componente.");
            });
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao cadastrar parâmetro.");
        });
    })
    .catch(erro => {
        console.error(erro);
        res.status(500).send("Erro ao cadastrar servidor.");
    });
}

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
    servidorModel.listarServidores()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).send("Erro ao listar servidores.");
        });
}

module.exports = {
    adicionarServidor,
    atualizarServidor,
    excluirServidor,
    listarServidores
};
