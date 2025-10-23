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

module.exports = {
    buscarCargos,
    adicionarCargo
}