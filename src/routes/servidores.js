var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.post("/adicionarServidor", function(req, res) {
    servidorController.adicionarServidor(req, res);
});

router.get("/buscarServidorUUID/:uuid", function(req, res) {
    servidorController.buscarServidorUUID(req, res);
});

router.put("/atualizarServidor", function(req, res) {
    servidorController.atualizarServidor(req, res);
});

router.delete("/excluirServidor/:uuid", function(req, res) {
    servidorController.excluirServidor(req, res);
});

module.exports = router;