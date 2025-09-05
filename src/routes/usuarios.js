var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.get("/autenticar/:email/:senha", function(req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrar", function(req, res) {
    usuarioController.cadastrarUsuario(req, res);
});

router.get("/buscarUsuarios/:fkEmpresa", function(req, res) {
    usuarioController.buscarUsuarios(req, res);
});

module.exports = router;