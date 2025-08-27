var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.post("/adicionarServidor", function(req, res) {
    servidorController.adicionarServidor(req, res);
});

router.get("/buscarServidorUUID/:uuid", function(req, res) {
    servidorController.buscarServidor(req, res);
});

module.exports = router;