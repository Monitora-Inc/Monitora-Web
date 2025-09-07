var express = require("express");
var router = express.Router();

var aprovarCadastroController = require("../controllers/aprovarCadastro");

router.get("/empresas", function(req, res) {
    aprovarCadastroController.listarEmpresasNaoAprovadas(req, res);
});

router.put("/empresa/:idEmpresa", function(req, res) {
    aprovarCadastroController.aprovarEmpresa(req, res);
});

module.exports = router;