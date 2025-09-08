var database = require("../database/config");

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT * FROM Usuario
        WHERE email = '${email}'
        AND senha = '${senha}';
    `;

    return database.executar(instrucaoSql);
}

function cadastrarUsuario(nome, email, senha, ativo, fkEmpresa, fkCargo, isAdmin) {
    let instrucaoSql = `
        INSERT INTO Usuario(nome, email, senha, fkEmpresa, ativo, fkCargo, isAdmin) VALUES
            ('${nome}', '${email}', '${senha}', ${fkEmpresa}, ${ativo}, ${fkCargo}, ${isAdmin});
    `;

    return database.executar(instrucaoSql);
}

function buscarUsuarios(fkEmpresa) {
    let instrucaoSql = `
        SELECT * FROM Usuario
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function aprovarUsuarioAdmin(fkEmpresa) {
    let instrucaoSql = `
        UPDATE Usuario
        SET ativo = 1
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function negarUsuarioAdmin(fkEmpresa) {
    let instrucaoSql = `
        DELETE FROM Usuario
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarUsuario,
    buscarUsuarios,
    aprovarUsuarioAdmin,
    negarUsuarioAdmin
}