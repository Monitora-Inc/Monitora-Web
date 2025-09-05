var express = require("express");
var router = express.Router();

var cargoController = require('../controllers/cargoController');

router.get("/buscarCargos/:fkEmpresa", function(req, res) {
    cargoController.buscarCargos(req, res);
});

module.exports = router;