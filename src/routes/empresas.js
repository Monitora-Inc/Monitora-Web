var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrarEmpresa", function(req, res) {
    empresaController.cadastrarEmpresa(req, res);
});

router.get("/autenticar/:cnpj/:senha", function(req, res) {
    empresaController.autenticar(req, res);
});

router.put("/negarEmpresa/:idEmpresa", function(req, res) {
    empresaController.negarEmpresa(req, res);
});

router.put("/autorizarEmpresa/:idEmpresa", function(req, res) {
    empresaController.autorizarEmpresa(req, res);
});

router.get("/buscarEmpresas", function(req, res){
    empresaController.buscarEmpresas(req, res);
});

module.exports = router;
