var database = require("../database/config");

function cadastrarEmpresa(nome, cnpj, senha) {
    console.log("Estou acessando o banco \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarEmpresa():", nome, cnpj);

    let instrucaoSql = `
        INSERT INTO Empresas(nome, cnpj, senha, ativo, aprovada) VALUES
            ('${nome}', '${cnpj}', SHA2('${senha}', 512), 1, 0);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

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