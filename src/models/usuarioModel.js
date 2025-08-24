var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT * FROM Usuario
        WHERE email = '${email}'
        AND senha = '${senha}';
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar
}