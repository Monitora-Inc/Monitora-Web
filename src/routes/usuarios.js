var express = require("express");
var router = express.Router();
var usuarioController = require("../controllers/usuarioController");

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



router.get("/autenticar/:email/:senha", function(req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/confirmarSenha/:email/:senha", function(req, res){
    usuarioController.confirmarSenha(req, res);
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

router.get("/listarPermissoes/:idCargo", function(req, res) {
    usuarioController.listarPermissoes(req, res);
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

router.put("/editarPerfil", function (req, res) {
    usuarioController.editarPerfil(req, res);
});

router.put("/editarFoto", upload.single("foto"), function (req, res) {
    usuarioController.editarFoto(req, res);
});


module.exports = router;