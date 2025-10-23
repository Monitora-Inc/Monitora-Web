var database = require("../database/config");


function adicionarDatacenter(nome, pais, estado, cidade, bairro, rua, num, complemento, fkempresa) {
//      No primerio insert adiciono o endereco do DataCenter. No segundo crio o DataCenter e pego com um select o fkEndereco
//      pela forma que está ele vai pegar o id usando a rua e o numero que são iguais ao insert anterior como referência 
    let instrucaoSql1 = `
        INSERT INTO endereco(pais, estado, cidade, bairro, rua, numero, complemento) VALUES
            ('${pais}', '${estado}', '${cidade}', '${bairro}', '${rua}', ${num},'${complemento}');
    `;
    let instrucaoSql2 = `
        INSERT INTO datacenters(nome, FkEmpresa, FkEndereco) VALUES
        ('${nome}', ${fkempresa}, (select idEndereco from endereco where rua = '${rua}' and numero = ${num}));
    `;
//  Aqui ele executará primeiro a instrucao1 e então a instrucao2.(Sistema não deixa execucao de 2 )
    return database.executar(instrucaoSql1).then(() => database.executar(instrucaoSql2))
}

function buscarIDdatacenter(id) {
    let instrucaoSql = `
        SELECT * FROM datacenters
        WHERE idDataCenter = '${id}'
    `;

    return database.executar(instrucaoSql);
}

function atualizarDatacenter(idDataCenter, nome, pais, estado, cidade, bairro, rua, num, complemento, fkEndereco) {
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
            complemento = '${complemento}'
        WHERE idEndereco = ${fkEndereco};
    `;
    //Ler funcão adicionar datacenter
    return database.executar(instrucaoSql).then(() => database.executar(instrucaoSql2))
}

function excluirDatacenter(id) {
    let instrucaoSql = `
        DELETE FROM datacenters
        WHERE idDataCenter = '${id}';
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