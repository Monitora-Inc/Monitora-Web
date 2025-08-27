var database = require("../database/config");

function adicionarServidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional, idEmpresa) {
    let instrucaoSql = `
        INSERT INTO Servidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional, fkEmpresa) VALUES
            ('${uuid}', '${modeloCPU}', '${qtdRam}', '${qtdDisco}', '${sistemaOperacional}', '${idEmpresa}');
    `;

    return database.executar(instrucaoSql);
}

function buscarServidorUUID(uuid) {
    let instrucaoSql = `
        SELECT * FROM Servidor
        WHERE uuid = '${uuid}'
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    adicionarServidor,
    buscarServidorUUID
}