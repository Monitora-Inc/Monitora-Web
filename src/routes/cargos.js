var express = require("express");
var router = express.Router();

var cargoController = require('../controllers/cargoController');

router.get("/buscarCargos/:fkEmpresa", function(req, res) {
    cargoController.buscarCargos(req, res);
});

router.post("/adicionarCargo", function(req, res) {
    cargoController.adicionarCargo(req, res);
});

router.delete("/deletarCargo/:cargoId", function(req, res) {
    cargoController.deletarCargo(req, res);
});

router.get("/listarPermissoes/:idCargo", function(req, res) {
    cargoController.listarPermissoes(req, res);
});

router.post("/adicionarPermissao", function(req, res) {
    cargoController.adicionarPermissao(req, res);
});

router.delete("/removerPermissao/:cargoId/:permissaoId", function(req, res) {
    cargoController.removerPermissao(req, res);
});

module.exports = router;