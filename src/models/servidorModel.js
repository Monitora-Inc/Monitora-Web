var database = require("../database/config");

function adicionarServidorJAVA(id, nome, fkDataCenter) {

    //Verificando se existe um servidor com o id a ser cadastrado:
    let instrucaoVerifi = `
        SELECT count(idServidor) AS total FROM servidores WHERE idServidor = '${id}'
    `;
    // Aqui peco para realizar a verificacao e com a resposta(nome da variavel pode ser qualquer um) do select
    return database.executar(instrucaoVerifi).then((resposta) => {
        if(resposta[0].total > 0){
            //Aqui caso seja duplicado return Promise.reject(Ler config.js do database para melhor entendimento). 
            //Onde rejeitando chegara ao .cacth do controlller 
            return Promise.reject({ tipo: "CONFLITO", erro: "ID Servidor já cadastrado " });
        }
            let instrucaoTeste = `
            INSERT INTO monitora.servidores(idServidor, nome, FkDataCenter) VALUES
            ('${id}', '${nome}', ${fkDataCenter});
            `;
    
        return database.executar(instrucaoTeste);
        
        
    });

}

function atualizarServidor(idServidor, nomeServidor, idDatacenter, cpuAlerta, cpuCritico, ramAlerta, ramCritico, discoAlerta, discoCritico, redeAlertaPercent, redeCriticoPercent, redeAlertaMs, redeCriticoMs) {
    let instrucaoSql = `
        update servidores
        set
            nome = '${nomeServidor}',
            FkDataCenter = ${idDatacenter}
        where idServidor = '${idServidor}';
    `;

    let instrucaoSql2 = `
        update parametros_atencao p
        inner join componentes_monitorados cm on cm.parametros_atencao_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${cpuAlerta}
        where nc.componente = 'CPU' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql3 = `
        update parametros_atencao p
        inner join componentes_monitorados cm on cm.parametros_atencao_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${ramAlerta}
        where nc.componente  like 'RAM' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql4 = `
        update parametros_atencao p
        inner join componentes_monitorados cm on cm.parametros_atencao_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${discoAlerta}
        where nc.componente  like 'Disco' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql5 = `
        update parametros_atencao p
        inner join componentes_monitorados cm on cm.parametros_atencao_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeAlertaPercent}
        where nc.componente  like 'Rede' and um.unidade_de_medida = '%' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql6 = `
        update parametros_atencao p
        inner join componentes_monitorados cm on cm.parametros_atencao_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeAlertaMs}
        where nc.componente  like 'Rede' and um.unidade_de_medida = 'ms' AND s.idServidor = '${idServidor}';
    `

        let instrucaoSql7 = `
        update parametros_critico p
        inner join componentes_monitorados cm on cm.parametros_critico_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${cpuCritico}
        where nc.componente = 'CPU' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql8 = `
        update parametros_critico p
        inner join componentes_monitorados cm on cm.parametros_critico_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${ramCritico}
        where nc.componente  like 'RAM' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql9 = `
        update parametros_critico p
        inner join componentes_monitorados cm on cm.parametros_critico_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${discoCritico}
        where nc.componente  like 'Disco' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql10 = `
        update parametros_critico p
        inner join componentes_monitorados cm on cm.parametros_critico_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeCriticoPercent}
        where nc.componente  like 'Rede' and um.unidade_de_medida = '%' AND s.idServidor = '${idServidor}';
    `

    let instrucaoSql11 = `
        update parametros_critico p
        inner join componentes_monitorados cm on cm.parametros_critico_id = p.id
        inner join nome_componente nc on cm.nome_componente_id = nc.id
        inner join unidade_medida um on um.id = cm.unidade_medida_id
        inner join servidores s on cm.servidores_idServidor = s.idServidor
            set p.limite = ${redeCriticoMs}
        where nc.componente  like 'Rede' and um.unidade_de_medida = 'ms' AND s.idServidor = '${idServidor}';
    `

    console.log("executando a instrucao sql: " + instrucaoSql)
    return database.executar(instrucaoSql).then(() => database.executar(instrucaoSql2)).then(() => database.executar(instrucaoSql3)).then(() => database.executar(instrucaoSql4)).then(() => database.executar(instrucaoSql5)).then(() => database.executar(instrucaoSql6)).then(() => database.executar(instrucaoSql7)).then(() => database.executar(instrucaoSql8)).then(() => database.executar(instrucaoSql9)).then(() => database.executar(instrucaoSql10)).then(() => database.executar(instrucaoSql11))
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
            pa.limite AS alerta_monitoramento,
            pc.limite AS critico_monitoramento

        FROM servidores AS s
        JOIN componentes_monitorados AS c ON s.idServidor = c.servidores_idServidor
        JOIN nome_componente AS nc ON c.nome_componente_id = nc.id
        JOIN unidade_medida AS u ON c.unidade_medida_id = u.id
        JOIN parametros_atencao AS pa ON c.parametros_atencao_id = pa.id
        JOIN parametros_critico AS pc ON c.parametros_critico_id = pc.id
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
