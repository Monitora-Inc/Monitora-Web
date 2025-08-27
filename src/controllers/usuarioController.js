var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.params.email;
    var senha = req.params.senha;

    usuarioModel.autenticar(email, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                idUsuario: resultadoAutenticar[0].idUsuario,
                email: resultadoAutenticar[0].email,
                nome: resultadoAutenticar[0].nome,
                senha: resultadoAutenticar[0].senha,
                fkEmpresa: resultadoAutenticar[0].fkEmpresa
            });
        } else {
            res.status(403).send("Email e/ou senha inválido(s)");
        }
    });
}

module.exports = {
    autenticar
}