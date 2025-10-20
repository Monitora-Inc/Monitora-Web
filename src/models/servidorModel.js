var database = require("../database/config");

function adicionarServidor(nome, fkDataCenter) {
    let instrucaoSql = `
        INSERT INTO servidores (nome, fkDataCenter)
        VALUES ('${nome}', '${fkDataCenter}');
    `;
    return database.executar(instrucaoSql);
}

function atualizarServidor(idServidor, nome, fkDataCenter) {
    let instrucaoSql = `
        UPDATE servidores
        SET nome = '${nome}', fkDataCenter = '${fkDataCenter}'
        WHERE idServidor = '${idServidor}';
    `;
    return database.executar(instrucaoSql);
}

function excluirServidor(idServidor) {
    let instrucaoSqlComponentes = `
        DELETE FROM componentes_monitorados
        WHERE servidores_idServidor = '${idServidor}';
    `;

    let instrucaoSqlServidor = `
        DELETE FROM servidores
        WHERE idServidor = '${idServidor}';
    `;

    return database.executar(instrucaoSqlComponentes)
        .then(() => {
            return database.executar(instrucaoSqlServidor);
        });
}

function listarServidores() {
    let instrucaoSql = `
        SELECT 
        idServidor, 
        nome, 
        data_cadastro, 
        fkDataCenter
        FROM servidores;
    `;
    return database.executar(instrucaoSql);
}

function adicionarParametro(limite) {
    let sql = `
        INSERT INTO parametros (limite)
        VALUES ('${limite}');
    `;
    return database.executar(sql);
}

function adicionarComponente(nomeComponenteId, servidorId, medidaId, parametroId) {
    let sql = `
        INSERT INTO componentes_monitorados (nome_componente_id, servidores_idServidor, medida_id, parametros_id)
        VALUES ('${nomeComponenteId}', '${servidorId}', '${medidaId}', '${parametroId}');
    `;
    return database.executar(sql);
}

module.exports = {
    adicionarServidor,
    atualizarServidor,
    excluirServidor,
    listarServidores,
    adicionarParametro,
    adicionarComponente
};
