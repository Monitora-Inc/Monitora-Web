var express = require("express");
var router = express.Router();
var servidorController = require("../controllers/servidorController");

router.get("/listar/:id", function(req, res){
    servidorController.listarServidores(req, res)}
);

router.post("/editar/:id", function(req, res){
    servidorController.editarServidor(req, res)
});

router.post("/adicionar/JAVA", function(req, res){
    servidorController.adicionarServidorJAVA(req, res)
});
router.put("/atualizar/:id", function(req, res){
    servidorController.atualizarServidor(req, res)
});
router.delete("/excluir/:id", function(req, res){
    servidorController.excluirServidor(req, res)
});
router.get("/parametros/:id", function(req, res){
    servidorController.parametros(req, res)
});

router.get("/buscarNomeServidor/:id", function(req, res){
    servidorController.buscarNomeServidor(req, res)
})

module.exports = router;
