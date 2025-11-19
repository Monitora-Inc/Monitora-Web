var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.params.email;
    var senha = req.params.senha;

    usuarioModel.autenticar(email, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                userId: resultadoAutenticar[0].userId,
                userNome: resultadoAutenticar[0].userNome,
                userSobrenome: resultadoAutenticar[0].userSobrenome,
                userEmail: resultadoAutenticar[0].userEmail,
                userTelefone: resultadoAutenticar[0].userTelefone,
                fotoUser: resultadoAutenticar[0].fotoUser,
                cargoId: resultadoAutenticar[0].cargoId,
                cargo: resultadoAutenticar[0].cargo,
                empresaId: resultadoAutenticar[0].empresaId,
                empresaNome: resultadoAutenticar[0].empresaNome,
                empresaAtiva: resultadoAutenticar[0].empresaAtiva,
                empresaAprovada: resultadoAutenticar[0].empresaAprovada,
                permissoes: resultadoAutenticar[0].permissoes
            });
        } else {
            res.status(403).send("Email e/ou senha inválido(s)");
        }
    }).catch(err => {
        console.error("Erro ao autenticar usuário: ", err);
        res.status(500).send("Erro ao autenticar usuário.");
    });
}

function confirmarSenha(req, res) {
    var email = req.params.email;
    var senha = req.params.senha;

    usuarioModel.autenticar(email, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                userId: resultadoAutenticar[0].userId,
                userNome: resultadoAutenticar[0].userNome,
                userSobrenome: resultadoAutenticar[0].userSobrenome,
                userEmail: resultadoAutenticar[0].userEmail,
                userTelefone: resultadoAutenticar[0].userTelefone,
                fotoUser: resultadoAutenticar[0].fotoUser,
                cargoId: resultadoAutenticar[0].cargoId,
                cargo: resultadoAutenticar[0].cargo,
                empresaId: resultadoAutenticar[0].empresaId,
                empresaNome: resultadoAutenticar[0].empresaNome,
                empresaAtiva: resultadoAutenticar[0].empresaAtiva,
                empresaAprovada: resultadoAutenticar[0].empresaAprovada
            });
        } else {
            res.status(403).send("Senha inválida!");
        }
    }).catch(err => {
        console.error("Erro ao confirmar senha: ", err);
        res.status(500).send("Erro ao confirmar senha.");
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
    }).catch(err => {
        console.error("Erro ao cadastrar usuário: ", err);
        res.status(500).send("Erro ao cadastrar usuário.");
    });
}

function buscarUsuarios(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.buscarUsuarios(fkEmpresa).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao buscar usuários: ", err);
        res.status(500).send("Erro ao buscar usuários.");
    });
}

function listarCargos(req, res) {
    let idEmpresa = req.params.idEmpresa;

    usuarioModel.listarCargos(idEmpresa).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao listar cargos: ", err);
        res.status(500).send("Erro ao listar cargos.");
    });
}

function listarCargosEditar(req, res) {
    let idEmpresa = req.params.idEmpresa;
    let idCargoAtual = req.params.idCargoAtual;

    usuarioModel.listarCargosEditar(idEmpresa, idCargoAtual).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Erro interno em: listarCargosEditar()");
    });
}

function listarPermissoes(req, res) {
    let idCargo = req.params.idCargo;

    usuarioModel.listarPermissoes(idCargo).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao listar permissões: ", err);
        res.status(500).send("Erro ao listar permissões.");
    });
}

function deletarUsuario(req, res) {
    let usuario_id = req.params.usuario_id;

    usuarioModel.deletarUsuario(usuario_id).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao deletar usuário: ", err);
        res.status(500).send("Erro ao deletar usuário.");
    });
}

function editarCargo(req, res) {
    let usuario_id = req.body.usuario_id;
    let cargo_id = req.body.cargo_id;

    usuarioModel.editarCargo(usuario_id, cargo_id).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao editar cargo: ", err);
        res.status(500).send("Erro ao editar cargo.");
    });
}

function aprovarUsuarioAdmin(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.aprovarUsuarioAdmin(fkEmpresa).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao aprovar usuário como administrador: ", err);
        res.status(500).send("Erro ao aprovar usuário como administrador.");
    });
}

function negarUsuarioAdmin(req, res) {
    let fkEmpresa = req.params.fkEmpresa;

    usuarioModel.negarUsuarioAdmin(fkEmpresa).then((resultado) => {
        res.json(resultado);
    }).catch(err => {
        console.error("Erro ao negar usuário como administrador: ", err);
        res.status(500).send("Erro ao negar usuário como administrador.");
    });
}

function editarPerfil(req, res) {
    console.log("=== DEBUG editarPerfil ===");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body recebido:", req.body);

    let id = req.body.idServer;
    let funcionario_nome = req.body.nomeServer;
    let funcionario_sobrenome = req.body.sobrenomeServer;
    let funcionario_email = req.body.emailServer;
    let funcionario_telefone = req.body.telefoneServer;
    let funcionario_senha = req.body.senhaServer;


    if (funcionario_nome == undefined) {
        return res.status(400).send("O nome é obrigatório!");
    } else if (funcionario_sobrenome == undefined) {
        return res.status(400).send("O sobrenome é obrigatório!");
    } else if (id == undefined) {
        return res.status(400).send("O id é obrigatório!");
    } else if (funcionario_telefone == undefined) {
        return res.status(400).send("O id é obrigatório!");
    }

    // Verificar se a senha antiga está correta
    usuarioModel.editarPerfil(
        funcionario_nome, 
        funcionario_sobrenome, 
        funcionario_email,
        funcionario_telefone, 
        funcionario_senha,
        id
    )
    .then(resposta => {
        res.json({
            success: true,
            message: "Usuário atualizado com sucesso"
        });
    }).catch(err => {
        console.error("Erro ao editar perfil do usuário: ", err);
        res.status(500).send("Erro ao editar perfil do usuário.");
    });
}

function editarFoto(req, res) {
    const id = req.body.id;
    const foto = req.file.filename; 

    usuarioModel.editarFoto(id, foto)
        .then(() => {
            res.json({
                success: true,
                message: "Foto atualizada com sucesso!",
                foto: foto
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Erro ao atualizar foto");
        });
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
    confirmarSenha,
    editarPerfil,
    editarFoto
}