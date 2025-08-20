var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var login = req.params.loginUsuario;
    var senha = req.params.senhaUsuario;

    usuarioModel.autenticar(login, senha).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    autenticar
}