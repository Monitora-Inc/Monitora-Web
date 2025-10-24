var database = require("../database/config");

function cadastrarEmpresa(nome, cnpj, senha) {
    console.log("Estou acessando o banco \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarEmpresa():", nome, cnpj);

    let instrucaoSql = `
        INSERT INTO empresas(nome, cnpj, senha, ativo, aprovada) VALUES
            ('${nome}', '${cnpj}', SHA2('${senha}', 512), 1, 0);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function autenticar(cnpj, senha) {
    let instrucaoSql = ` 
        SELECT idEmpresa as empresaId, nome as empresaNome, cnpj as empresaCnpj, fotoDePerfil as empresaFoto, ativo as empresaAtivo, aprovada as empresaAprovada
        FROM empresas WHERE cnpj = ${cnpj} AND senha = SHA2("${senha}", 512);
    `;

    return database.executar(instrucaoSql);
}

function negarEmpresa(idEmpresa) {
    let instrucaoSql = `
        update empresas set aprovada = 0
        WHERE idEmpresa = ${idEmpresa};
    `

    return database.executar(instrucaoSql);
}

function autorizarEmpresa(idEmpresa) {
    let instrucaoSql = `
        update empresas set aprovada = 1
        WHERE idEmpresa = ${idEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function buscarEmpresas(){
    let instrucaoSql = `
        select idEmpresa, nome, cnpj, ativo, aprovada, data_cadastro, fotoDePerfil from empresas;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEmpresa,
    autenticar,
    negarEmpresa,
    autorizarEmpresa,
    buscarEmpresas
}