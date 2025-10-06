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
                fkEmpresa: resultadoAutenticar[0].fkEmpresa,
                ativo: resultadoAutenticar[0].ativo
            });
        } else {
            res.status(403).send("Email e/ou senha inválido(s)");
        }
    });
}

function cadastrarUsuario(req, res) {
    let nome = req.body.nomeUsuarioServer;
    let sobrenome = req.body.sobrenomeUsuarioServer;
    let telefone = req.body.telefoneUsuarioServer;
    let email = req.body.emailUsuarioServer;
    let senha = req.body.senhaUsuarioServer;
    let fkEmpresa = req.body.fkEmpresaServer;
    //let ativo = req.body.ativoServer; --> Deixei comentado pois no banco já há default. Importante rever.
    let fkCargo = req.body.fkCargoServer;
    //let isAdmin = req.body.isAdminServer; --> Importante rever.

    //Assinatura original da função --> usuarioModel.cadastrarUsuario(nome, sobrenome, email, senha, ativo, fkEmpresa, fkCargo, telefone)
    usuarioModel.cadastrarUsuario(nome, sobrenome, email, senha, fkEmpresa, fkCargo, telefone).then((resultado) => {
        res.status(200).send('Cadastro realizado com sucesso!');
    })
}

function buscarUsuarios(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.buscarUsuarios(fkEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function aprovarUsuarioAdmin(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.aprovarUsuarioAdmin(fkEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function negarUsuarioAdmin(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.negarUsuarioAdmin(fkEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

module.exports = {
    autenticar,
    cadastrarUsuario,
    buscarUsuarios,
    aprovarUsuarioAdmin,
    negarUsuarioAdmin
}