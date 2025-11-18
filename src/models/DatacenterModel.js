var database = require("../database/config");


function adicionarDatacenter(nome, pais, estado, cidade, bairro, rua, num, complemento, fkempresa, longitude, latitude) {
    let instrucaoSql1 = `
        INSERT INTO endereco(pais, estado, cidade, bairro, rua, numero, complemento, longitude, latitude) VALUES
            ('${pais}', '${estado}', '${cidade}', '${bairro}', '${rua}', ${num},'${complemento}', '${longitude}', '${latitude}');
    `;
    let instrucaoSql2 = `
        INSERT INTO datacenters(nome, FkEmpresa, FkEndereco) VALUES
        ('${nome}', ${fkempresa}, (select idEndereco from endereco where rua = '${rua}' and numero = ${num}));
    `;
    return database.executar(instrucaoSql1).then(() => database.executar(instrucaoSql2))
}

function buscarIDdatacenter(id) {
    let instrucaoSql = `
        SELECT 
            dc.idDataCenter,
            dc.nome,
            e.pais,
            e.estado,
            e.cidade,
            e.bairro,
            e.rua,
            e.numero,
            e.complemento,
            dc.FkEndereco
        FROM datacenters dc
        JOIN endereco e ON e.idEndereco = dc.fkEndereco
        WHERE idDataCenter = '${id}'
    `;

    return database.executar(instrucaoSql);
}

function atualizarDatacenter(idDataCenter, nome, pais, estado, cidade, bairro, rua, num, complemento, fkEndereco, longitude, latitude) {
    let instrucaoSql = `
        UPDATE datacenters
        SET 
            nome = '${nome}'
        WHERE idDataCenter = '${idDataCenter}';
    `;
    let instrucaoSql2 = `
        UPDATE endereco
        SET
            pais = '${pais}',
            estado = '${estado}',
            cidade = '${cidade}',
            bairro = '${bairro}',
            rua = '${rua}',
            numero = '${num}',
            complemento = '${complemento}',
            longitude = '${longitude}',
            latitude = '${latitude}'
        WHERE idEndereco = ${fkEndereco};
    `;
    return database.executar(instrucaoSql).then(() => database.executar(instrucaoSql2))
}

function excluirDatacenter(id) {
    let instrucaoSql = `
        DELETE FROM endereco
        WHERE idEndereco = '${id}';
    `;

    return database.executar(instrucaoSql);
}

function buscarDatacenter(idEmpresa) {
    let instrucaoSql = `
        SELECT
        dc.idDataCenter,
        dc.nome,
        e.pais,
        e.estado,
        e.cidade,
        e.bairro,
        e.rua,
        e.numero,
        e.complemento,
        dc.FkEndereco
        FROM datacenters dc
        JOIN endereco e ON e.idEndereco = dc.fkEndereco
        JOIN empresas emp ON  dc.fkEmpresa = emp.idEmpresa
        WHERE emp.idEmpresa = ${idEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    adicionarDatacenter,
    buscarIDdatacenter,
    atualizarDatacenter,
    excluirDatacenter,
    buscarDatacenter
}