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

function cadastrarUsuario(req, res) {
    let nome = req.body.nomeUsuarioServer;
    let email = req.body.emailUsuarioServer;
    let senha = req.body.senhaUsuarioServer;
    let fkEmpresa = req.body.fkEmpresaServer;
    let ativo = req.body.ativoServer;
    let fkCargo = req.body.fkCargoServer;
    let isAdmin = req.body.isAdminServer;

    usuarioModel.cadastrarUsuario(nome, email, senha, ativo, fkEmpresa, fkCargo, isAdmin).then((resultado) => {
        res.status(200).send('Cadastro realizado com sucesso!');
    })
}

module.exports = {
    autenticar,
    cadastrarUsuario
}