var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.get("/autenticar/:login/:senha", function(req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;