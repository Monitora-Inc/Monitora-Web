// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var multer = require("multer");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "public/assets/fotosPerfil")); // 👈 pasta onde salva
    },
    filename: function (req, file, cb) {
        const nomeArquivo = Date.now() + "-" + file.originalname;
        cb(null, nomeArquivo);
    }
});
var upload = multer({ storage: storage }); 

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var empresaRouter = require("./src/routes/empresas");
var servidorRouter = require("./src/routes/servidores");
var cargoRouter = require("./src/routes/cargos");
var aprovarCadastro = require("./src/routes/aprovarCadastro");
var datacentersRouter = require("./src/routes/datacenters")
var usuarioRouter = require("./src/routes/usuarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/empresas", empresaRouter);
app.use("/servidores", servidorRouter);
app.use("/datacenters", datacentersRouter)
app.use("/cargos", cargoRouter);
app.use("/aprovarCadastro", aprovarCadastro);
app.use("/bucket", bucketRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
