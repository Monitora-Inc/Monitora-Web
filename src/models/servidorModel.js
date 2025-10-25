var database = require("../database/config");


//Estava mexendo nessa parte e questionando mudancas de popup para como funcionaria a adicao de um servidor e seus componentes
function adicionarServidor(idServidor, nome, fkDataCenter, limite, nomeComponenteId, servidorId, medidaId, parametroId){

    //Isto pode excluir e descomentar abaixo usei para teste apenas. ******Este insert é o que o java está enviando os paramaetros para a adicao de servidor
    let instrucaoTeste = `
        INSERT INTO monitora.servidores(nome, FkDataCenter) VALUES
        ('${nome}', ${fkDataCenter});
    `;

    return database.executar(instrucaoTeste)

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
}

function adicionarServidorJAVA(id, nome, fkDataCenter){

    //Isto pode excluir e descomentar abaixo usei para teste apenas. ******Este insert é o que o java está enviando os paramaetros para a adicao de servidor
    let instrucaoTeste = `
        INSERT INTO monitora.servidores(idServidor, nome, FkDataCenter) VALUES
        ('${id}', '${nome}', ${fkDataCenter});
    `;

    return database.executar(instrucaoTeste)
}

function atualizarServidor(idServidor, nome, fkDataCenter) {
    let instrucaoSql = `
        UPDATE servidores
        SET nome = '${nome}', fkDataCenter = '${fkDataCenter}'
        WHERE idServidor = '${idServidor}';
    `;
    return database.executar(instrucaoSql);
}
//ID Servidor vindo como undefined
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
        e.estado,
        e.cidade,
        e.rua,
        e.numero,
        cm.nome_componente_id,
        cm.medida_id,
        cm.parametros_id,
        p.limite,
        m.unidade_de_medida
    FROM servidores s
    INNER JOIN datacenters d ON d.idDataCenter = s.fkDataCenter
    INNER JOIN endereco e ON e.idEndereco = d.fkEndereco
    LEFT JOIN componentes_monitorados cm ON cm.servidores_idServidor = s.idServidor
    LEFT JOIN parametros p ON p.id = cm.parametros_id
    LEFT JOIN medida m ON m.id = cm.medida_id
    WHERE d.FkEmpresa = ${idEmpresa}
    ;
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
    adicionarServidorJAVA,
    atualizarServidor,
    excluirServidor,
    listarServidores,
    adicionarParametro,
    adicionarComponente
};
