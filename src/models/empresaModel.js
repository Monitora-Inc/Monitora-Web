var database = require("../database/config");

function cadastrarEmpresa(nome, cnpj) {
    let instrucaoSql = `
        INSERT INTO Empresas(nome, cnpj, ativo, aprovada) VALUES
            ('${nome}', '${cnpj}', 1, 0);
    `;

    return database.executar(instrucaoSql);
}

function negarEmpresa(idEmpresa) {
    let instrucaoSql = `
        DELETE FROM Empresa
        WHERE idEmpresa = ${idEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEmpresa,
    negarEmpresa
}