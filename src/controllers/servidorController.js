var servidorModel = require("../models/servidorModel");

function adicionarServidor(req, res) {
    let uuid = req.body.uuidServer;
    let modeloCPU = req.body.modeloCPUServer;
    let qtdRam = req.body.qtdRamServer;
    let qtdDisco = req.body.qtdDiscoServer;
    let sistemaOperacional = req.body.sistemaOperacionalServer;
    let idEmpresa = req.body.idEmpresaServer;

    servidorModel.adicionarServidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional, idEmpresa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    adicionarServidor
}