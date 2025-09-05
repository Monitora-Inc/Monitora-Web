let database = require("../database/config");

function buscarCargos(fkEmpresa) {
    let instrucaoSql = `
        SELECT * FROM Cargo
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCargos
}