var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrarEmpresa", function(req, res) {
    empresaController.cadastrarEmpresa(req, res);
});

router.get("/autenticar/:cnpj/:senha", function(req, res) {
    empresaController.autenticar(req, res);
});

router.delete("/negarEmpresa/:idEmpresa", function(req, res) {
    empresaController.negarEmpresa(req, res);
});

module.exports = router;
