let database = require("../database/config");

function buscarCargos(fkEmpresa) {
    let instrucaoSql = `
        SELECT * FROM Cargo
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function adicionarCargo(fkEmpresa, nomeCargo) {
    let instrucaoSql = `
        INSERT INTO cargos (nome_cargo, FkEmpresa)
        VALUES ('${nomeCargo}', ${fkEmpresa});
    `;

    return database.executar(instrucaoSql);
}

function deletarCargo(cargoId) {
    let instrucaoSql = `
        DELETE FROM cargos
        WHERE idCargo = ${cargoId};
    `;

    return database.executar(instrucaoSql);
}

function listarPermissoes(idCargo) {
    let instrucaoSql = `
        select permissoes_idPermissao from permissoes_has_cargos
        where cargos_idCargo = ${idCargo};
    `;

    return database.executar(instrucaoSql);
}

function adicionarPermissao(fkCargo, fkPermissao) {
    let instrucaoSql = `
        INSERT INTO permissoes_has_cargos (cargos_idCargo, permissoes_idPermissao)
        VALUES (${fkCargo}, ${fkPermissao});
    `;

    return database.executar(instrucaoSql);
}

function removerPermissao(cargoId, permissaoId) {
    let instrucaoSql = `
        DELETE FROM permissoes_has_cargos
        WHERE cargos_idCargo = ${cargoId} and permissoes_idPermissao = ${permissaoId};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCargos,
    adicionarCargo,
    deletarCargo,
    listarPermissoes,
    adicionarPermissao,
    removerPermissao
}