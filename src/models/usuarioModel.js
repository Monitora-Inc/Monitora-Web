var database = require("../database/config");

function autenticar(email, senha) {
    let instrucaoSql = ` 
        SELECT
            u.idUsuario as userId, 
            u.nome as userNome, 
            u.sobrenome as userSobrenome, 
            u.email as userEmail, 
            u.telefone as userTelefone, 
            u.fotoUser as fotoUser, 
            u.FkCargo as cargoId, 
            c.nome_cargo as cargo, 
            e.idEmpresa as empresaId, 
            e.nome AS empresaNome, 
            e.ativo as empresaAtiva, 
            e.aprovada as empresaAprovada
        FROM usuarios AS u
        JOIN cargos AS c ON u.FkCargo = c.idCargo
        JOIN empresas AS e ON u.FkEmpresa = e.idEmpresa
        WHERE u.email = '${email}' AND u.senha = SHA2('${senha}', 512);
    `;

    return database.executar(instrucaoSql);
}

// function cadastrarUsuario(nome, email, senha, ativo, fkEmpresa, fkCargo, isAdmin) --> Assinatura original da função
function cadastrarUsuario(nome, sobrenome, email, senha, fkEmpresa, fkCargo, telefone) {
    let instrucaoSql = `
        INSERT INTO usuarios(nome, sobrenome, email, senha, fkEmpresa, fkCargo, telefone) VALUES
            ('${nome}', '${sobrenome}', '${email}', SHA2('${senha}', 512), ${fkEmpresa}, ${fkCargo}, ${telefone});
    `;

    return database.executar(instrucaoSql);
}

function buscarUsuarios(fkEmpresa) {
    let instrucaoSql = `
        SELECT u.idUsuario, u.nome, u.sobrenome, c.nome_cargo, c.idCargo, u.email, u.telefone, cast(u.data_cadastro AS DATE) as data_cadastro, u.fotoUser
        FROM usuarios u
        INNER JOIN cargos c on u.fkcargo = c.idCargo 
        WHERE u.fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function listarCargos(idEmpresa) {
    let instrucaoSql = `
    SELECT idCargo, 
    nome_cargo FROM cargos
    WHERE fkEmpresa = ${idEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function listarCargosEditar(idEmpresa, idCargoAtual) {
    let instrucaoSql = `
    SELECT 
    idCargo, 
    nome_cargo FROM cargos
    WHERE fkEmpresa = ${idEmpresa} and idCargo not like ${idCargoAtual};
    `;

    return database.executar(instrucaoSql);
}

function listarPermissoes(idCargo) {
    let instrucaoSql = `
        select p.nomePermissao from permissoes as p
        inner join permissoes_has_cargos as pc on pc.permissoes_idPermissao = p.idPermissao
        where pc.cargos_idCargo = ${idCargo};
    `;

    return database.executar(instrucaoSql);
}



function deletarUsuario(usuario_id) {
    let instrucaoSql = `
    DELETE FROM usuarios
    WHERE idUsuario = ${usuario_id};
    `;

    return database.executar(instrucaoSql);
}

function editarCargo(usuario_id, cargo_id) {
    let instrucaoSql = `
    UPDATE usuarios
    SET fkCargo = ${cargo_id}
    WHERE idUsuario = ${usuario_id};
    `;

    return database.executar(instrucaoSql);
}

function aprovarUsuarioAdmin(fkEmpresa) {
    let instrucaoSql = `
        UPDATE usuarios
        SET ativo = 1
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function negarUsuarioAdmin(fkEmpresa) {
    let instrucaoSql = `
        DELETE FROM usuarios
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    return database.executar(instrucaoSql);
}

function editarPerfil(funcionario_nome, funcionario_sobrenome, funcionario_email, funcionario_telefone, funcionario_senha, id) {
    console.log("=== DEBUG funcao_editar MODEL ===");
    
    let updateSql = `
        UPDATE usuarios 
        SET nome = '${funcionario_nome}', 
            sobrenome = '${funcionario_sobrenome}'
    `;
        if (funcionario_email && funcionario_email !== "") {
        updateSql += `, email = '${funcionario_email}'`;
    }
    
    if (funcionario_telefone && funcionario_telefone !== "") {
        updateSql += `, telefone = '${funcionario_telefone}'`;
    }
    
    if (funcionario_senha && funcionario_senha !== "") {
        updateSql += `, senha = SHA2('${funcionario_senha}', 512)`;
    }
    
    updateSql += ` WHERE idUsuario = ${id};`;
    
    console.log("Query SQL completa:", updateSql);
    console.log("=================================");
    
    return database.executar(updateSql);
}

function editarFoto(id, foto) {
    console.log("=== DEBUG editarFoto MODEL ===");
    console.log("Foto recebida no model:", foto);

    const updateSql = `
        UPDATE usuarios 
        SET fotoUser = '${foto}'
        WHERE idUsuario = ${id};
    `;

    console.log("Query SQL completa:", updateSql);
    console.log("=================================");

    return database.executar(updateSql);
}

function editarFoto(id, foto) {
    console.log("=== DEBUG editarFoto MODEL ===");
    console.log("Foto recebida no model:", foto);

    const updateSql = `
        UPDATE usuarios 
        SET fotoUser = '${foto}'
        WHERE idUsuario = ${id};
    `;

    console.log("Query SQL completa:", updateSql);
    console.log("=================================");

    return database.executar(updateSql);
}
module.exports = {
    autenticar,
    cadastrarUsuario,
    buscarUsuarios,
    listarCargos,
    listarCargosEditar,
    listarPermissoes,
    deletarUsuario,
    editarCargo,
    aprovarUsuarioAdmin,
    negarUsuarioAdmin,
    editarPerfil,
    editarFoto
}