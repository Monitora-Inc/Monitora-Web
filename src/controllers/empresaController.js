var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
    let nome = req.body.nomeServer;
    let cnpj = req.body.cnpjServer;
    let senha = req.body.senhaServer;
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }
    if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    }
    if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }

    empresaModel.cadastrarEmpresa(nome, cnpj, senha).then((resultado) => {
        res.json(resultado);
    });
}

function autenticar(req, res) {
    var cnpj = req.params.cnpj;
    var senha = req.params.senha;

    empresaModel.autenticar(cnpj, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                empresaId: resultadoAutenticar[0].empresaId,
                empresaNome: resultadoAutenticar[0].empresaNome,
                empresaCnpj: resultadoAutenticar[0].empresaCnpj,
                empresaFoto: resultadoAutenticar[0].empresaFoto,
                empresaAtivo: resultadoAutenticar[0].empresaAtivo,
                empresaAprovada: resultadoAutenticar[0].empresaAprovada
            });
        } else {
            res.status(403).send("CNPJ e/ou senha inválido(s)");
        }
    });
}

function negarEmpresa(req, res) {
    let idEmpresa = req.params.idEmpresa;

    empresaModel.negarEmpresa(idEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function autorizarEmpresa(req, res) {
    let idEmpresa = req.params.idEmpresa;

    empresaModel.autorizarEmpresa(idEmpresa).then((resultado) => {
        res.json(resultado);
    });
}

function buscarEmpresas(req, res){
    empresaModel.buscarEmpresas().then((resultado) => {
        res.json(resultado);
    });
}


function confirmarSenha(req, res) {
    var cnpj = req.params.cnpj;
    var senha = req.params.senha;

    empresaModel.autenticar(cnpj, senha).then((resultadoAutenticar) => {
        if (resultadoAutenticar.length == 1) {
            res.json({
                empresaId: resultadoAutenticar[0].empresaId,
                empresaNome: resultadoAutenticar[0].empresaNome,
                empresaCnpj: resultadoAutenticar[0].empresaCnpj,
                empresaFoto: resultadoAutenticar[0].empresaFoto,
                empresaAtivo: resultadoAutenticar[0].empresaAtivo,
                empresaAprovada: resultadoAutenticar[0].empresaAprovada
            });
        } else {
            res.status(403).send("Senha inválida!");
        }
    });
}

function editarPerfil(req, res) {
    console.log("=== DEBUG editarPerfil ===");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body recebido:", req.body);

    let id = req.body.idServer;
    let empresa_nome = req.body.nomeServer;
    let empresa_cnpj = req.body.cnpjServer;
    let empresa_senha = req.body.senhaServer;


    if (empresa_nome == undefined) {
        return res.status(400).send("O nome é obrigatório!");
    } else if (empresa_cnpj == undefined) {
        return res.status(400).send("O cnpj é obrigatório!");
    } else if (id == undefined) {
        return res.status(400).send("O id é obrigatório!");
    }

    // Verificar se a senha antiga está correta
    empresaModel.editarPerfil(
        empresa_nome, 
        empresa_cnpj, 
        empresa_senha,
        id
    )
    .then(resposta => {
        res.json({
            success: true,
            message: "Usuário atualizado com sucesso"
        });
}) .catch(err => {
    console.error(err);
    res.status(500).send("CNPJ já existente");
});
}

function editarFoto(req, res) {
    const id = req.body.id;
    const foto = req.file.filename; 

    empresaModel.editarFoto(id, foto)
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

function getNomeEmpresa(req, res) {
    const idServidor = req.body.servidorId;
    if (idServidor == undefined){
        console.log("Id do servidor undefined")
    }
    empresaModel.getNomeEmpresa(idServidor).then((resultado) => {
        res.json(resultado);
    });
}



module.exports = {
    cadastrarEmpresa,
    autenticar,
    negarEmpresa,
    autorizarEmpresa,
    buscarEmpresas,
    confirmarSenha,
    editarFoto,
    editarPerfil,
    getNomeEmpresa
}