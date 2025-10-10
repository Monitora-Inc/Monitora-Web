var database = require("../database/config");

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT * FROM Usuario
        WHERE email = '${email}'
        AND senha = '${senha}';
    `;

    return database.executar(instrucaoSql);
}

// function cadastrarUsuario(nome, email, senha, ativo, fkEmpresa, fkCargo, isAdmin) --> Assinatura original da função
function cadastrarUsuario(nome, sobrenome, email, senha, fkEmpresa, fkCargo, telefone) {
    let instrucaoSql = `
        INSERT INTO Usuarios(nome, email, senha, fkEmpresa, ativo, fkCargo, isAdmin) VALUES
            ('${nome}', '${email}', '${senha}', ${fkEmpresa}, ${ativo}, ${fkCargo}, ${isAdmin});
    `;

    return database.executar(instrucaoSql);
}

function buscarUsuarios(fkEmpresa) {
    let instrucaoSql = `
        SELECT u.idUsuario, u.nome, u.sobrenome, c.nome_cargo, u.email, u.telefone, cast(u.data_cadastro AS DATE) as data_cadastro 
        FROM Usuario u
        INNER JOIN cargos c on u.fkcargo = c.idCargo 
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function listarCargos() {
    let instrucaoSql = `
    SELECT idCargo, nome_cargo FROM Cargos;
    `;

    return database.executar(instrucaoSql);
}

function deletarUsuario(usuario_id) {
    let instrucaoSql = `
    DELETE FROM usuario
    WHERE idUsuario = ${usuario_id};
    `;

    return database.executar(instrucaoSql);
}

function editarCargo(usuario_id, cargo_id) {
    let instrucaoSql = `
    UPDATE usuario
    SET fkCargo = ${cargo_id}
    WHERE idUsuario = ${usuario_id};
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
    listarCargos,
    deletarUsuario,
    editarCargo,
    aprovarUsuarioAdmin,
    negarUsuarioAdmin
}