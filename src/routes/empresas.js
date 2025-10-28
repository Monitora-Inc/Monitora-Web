var express = require("express");
var router = express.Router();
var empresaController = require("../controllers/empresaController");

var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/assets/fotosPerfil"));
    },
    filename: function (req, file, cb) {
        const nomeArquivo = Date.now() + "-" + file.originalname;
        cb(null, nomeArquivo);
    }
});

var upload = multer({ storage: storage });

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

router.get("/confirmarSenha/:cnpj/:senha", function(req, res){
    empresaController.confirmarSenha(req, res);
});

router.put("/editarPerfil", function (req, res) {
    empresaController.editarPerfil(req, res);
});

router.put("/editarFoto", upload.single("foto"), function (req, res) {
    empresaController.editarFoto(req, res);
});

module.exports = router;
