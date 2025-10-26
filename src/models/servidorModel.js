var database = require("../database/config");


// Estava mexendo nessa parte e questionando mudancas de popup para como funcionaria a adicao de um servidor e seus componentes
// function adicionarServidor(idServidor, nome, fkDataCenter, limite, nomeComponenteId, servidorId, medidaId, parametroId){

//     Isto pode excluir e descomentar abaixo usei para teste apenas. ******Este insert é o que o java está enviando os paramaetros para a adicao de servidor
//     let instrucaoTeste = `
//         INSERT INTO monitora.servidores(nome, FkDataCenter) VALUES
//         ('${nome}', ${fkDataCenter});
//     `;

//     return database.executar(instrucaoTeste)

// let instrucaoSql = `
//     INSERT INTO componentes_monitorados (nome_componente_id, servidores_idServidor, medida_id, parametros_id)
//     VALUES ('${nomeComponenteId}', '${servidorId}', '${medidaId}', '${parametroId}');
// `;
// let instrucao2 = `
//     INSERT INTO parametros (limite)
//     VALUES ('${limite}');
// `;
// let instrucao3 = `
//     UPDATE servidores set nome = '${nome}' 
//     WHERE idServidor = ${idServidor}
// `;

// //Desta forma o node aceita as tres instrucoes sendo realizada uma após a outra
// return database.executar(instrucaoSql).then(() => {
//     return database.executar(instrucao2).then(() => {
//         return database.executar(instrucao3)
//     })
// });
// }

function adicionarServidorJAVA(id, nome, fkDataCenter) {
    let instrucaoTeste = `
        INSERT INTO monitora.servidores(idServidor, nome, FkDataCenter) VALUES
        ('${id}', '${nome}', ${fkDataCenter});
    `;

    return database.executar(instrucaoTeste)
}

function atualizarServidor(idServidor, nomeServidor, idDatacenter, cpuLimite, ramLimite, discoLimite, redeLimitePercent, redeLimiteMs) {
    let instrucaoSql = `
        update servidores
        set
            nome = '${nomeServidor}',
            FkDataCenter = ${idDatacenter}
        where idServidor = '${idServidor}';
    `;

    let instrucaoSql2 = `
        update parametros p
        inner join componentes_monitorados cm on cm.parametros_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${cpuLimite}
        where nc.componente = 'CPU' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql3 = `
        update parametros p
        inner join componentes_monitorados cm on cm.parametros_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${ramLimite}
        where nc.componente  like 'RAM' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql4 = `
        update parametros p
        inner join componentes_monitorados cm on cm.parametros_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${discoLimite}
        where nc.componente  like 'Disco' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql5 = `
        update parametros p
        inner join componentes_monitorados cm on cm.parametros_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeLimitePercent}
        where nc.componente  like 'Rede' and um.unidade_de_medida = '%' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql6 = `
        update parametros p
        inner join componentes_monitorados cm on cm.parametros_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeLimiteMs}
        where nc.componente  like 'Rede' and um.unidade_de_medida = 'ms' AND s.idServidor = '${idServidor}';
    `
    console.log("executando a instrucao sql: " + instrucaoSql)
    return database.executar(instrucaoSql).then(() => database.executar(instrucaoSql2)).then(() => database.executar(instrucaoSql3)).then(() => database.executar(instrucaoSql4)).then(() => database.executar(instrucaoSql5)).then(() => database.executar(instrucaoSql6))
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

function listarServidores(idEmpresa) {
    let instrucaoSql = `
    SELECT
        s.idServidor,
        s.nome,
        s.data_cadastro,
        s.fkDataCenter,
        e.pais,
        e.estado,
        e.cidade,
        e.bairro,
        e.rua,
        e.numero,
        d.nome as nomeDatacenter
    FROM servidores s
    INNER JOIN datacenters d ON d.idDataCenter = s.fkDataCenter
    INNER JOIN endereco e ON e.idEndereco = d.fkEndereco
    WHERE d.FkEmpresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}

function parametros(idServer) {
    let sql = `
        SELECT 
            s.idServidor,
            s.nome AS nome_servidor,
            nc.componente AS nome_componente,
            u.unidade_de_medida,
            p.limite AS limite_monitoramento
        FROM servidores AS s
        JOIN componentes_monitorados AS c ON s.idServidor = c.servidores_idServidor
        JOIN nome_componente AS nc ON c.nome_componente_id = nc.id
        JOIN unidade_medida AS u ON c.unidade_medida_id = u.id
        JOIN parametros AS p ON c.parametros_id = p.id
        WHERE s.idServidor = '${idServer}'
        ORDER BY nome_componente;
    `;
    return database.executar(sql);
}

module.exports = {
    // adicionarServidor,
    adicionarServidorJAVA,
    atualizarServidor,
    excluirServidor,
    listarServidores,
    parametros
};
