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

router.get("/listarCargos/:idEmpresa", function(req, res) {
    usuarioController.listarCargos(req, res);
});

router.get("/listarCargosEditar/:idEmpresa/:idCargoAtual", function(req, res) {
    usuarioController.listarCargosEditar(req, res);
});

router.delete("/deletarUsuario/:usuario_id", function(req, res) {
    usuarioController.deletarUsuario(req, res);
});

router.put("/editarCargo", function(req, res) {
    usuarioController.editarCargo(req, res);
})

router.put("/aprovarUsuarioAdmin/:fkEmpresa", function(req, res) {
    usuarioController.aprovarUsuarioAdmin(req, res);
});

router.delete("/negarUsuarioAdmin/:fkEmpresa", function(req, res) {
    usuarioController.negarUsuarioAdmin(req, res);
});

module.exports = router;