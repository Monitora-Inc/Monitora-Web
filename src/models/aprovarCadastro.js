let database = require("../database/config");

function listarEmpresasNaoAprovadas() {
    let instrucaoSql = `
    SELECT * FROM Empresa WHERE aprovada = 0;`;
    
    return database.executar(instrucaoSql);
}

function aprovarEmpresa(idEmpresa) {
    let instrucaoSql = `
    UPDATE Empresa SET aprovada = 1 WHERE idEmpresa = ${idEmpresa};`;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarEmpresasNaoAprovadas,
    aprovarEmpresa
}