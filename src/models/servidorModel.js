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

function atualizarServidor(uuid, modeloCPU, qtdRam, qtdDisco, sistemaOperacional) {
    let instrucaoSql = `
        UPDATE Servidor
        SET modeloCPU = '${modeloCPU}',
            qtdRam = '${qtdRam}',
            qtdDisco = '${qtdDisco}',
            sistemaOperacional = '${sistemaOperacional}'
        WHERE uuid = '${uuid}';
    `;

    return database.executar(instrucaoSql);
}

function excluirServidor(uuid) {
    let instrucaoSql = `
        DELETE FROM Servidor
        WHERE uuid = '${uuid}';
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    adicionarServidor,
    buscarServidorUUID,
    atualizarServidor,
    excluirServidor
}