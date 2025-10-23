var express = require("express");
var router = express.Router();

var DatacenterController = require("../controllers/DatacenterController");

router.post("/adicionarDatacenter", function(req, res) {
    DatacenterController.adicionarDatacenter(req, res);
});

router.get("/buscarIDdatacenter/:id", function(req, res) {
    DatacenterController.buscarServidorID(req, res);
});

router.put("/atualizarDatacenter/:id/:fkEndereco", function(req, res) {
    DatacenterController.atualizarDatacenter(req, res);
});

router.delete("/excluirDatacenter/:id", function(req, res) {
    DatacenterController.excluirDatacenter(req, res);
});

router.get("/buscarDatacenter/:idEmpresa", function(req, res) {
    DatacenterController.buscarDatacenter(req, res);
});

module.exports = router;