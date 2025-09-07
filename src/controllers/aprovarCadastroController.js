let aprovarCadastroModel = require("../models/aprovarCadastro");

function listarEmpresasNaoAprovadas(req, res) {
    aprovarCadastroModel.listarEmpresasNaoAprovadas()
        .then(resultado => res.json(resultado))
}

function aprovarEmpresa(req, res) {
    const { idEmpresa } = req.params;
    aprovarCadastroModel.aprovarEmpresa(idEmpresa)
        .then(() => res.json({ sucesso: true }))
}

module.exports = {
    listarEmpresasNaoAprovadas,
    aprovarEmpresa
}