var express = require("express");
var router = express.Router();
var servidorController = require("../controllers/servidorController");

router.get("/listar/:id", function(req, res){
    servidorController.listarServidores(req, res)}
);
// router.post("/adicionar", function(req, res){
//     servidorController.adicionarServidor(req, res)
// });
router.post("/adicionar/JAVA", function(req, res){
    servidorController.adicionarServidorJAVA(req, res)
});
router.put("/atualizar/:id", function(req, res){
    servidorController.atualizarServidor(req, res)
});
router.delete("/excluir/:id", function(req, res){
    servidorController.excluirServidor(req, res)
});

module.exports = router;
