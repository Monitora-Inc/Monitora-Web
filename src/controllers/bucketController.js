const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const Papa = require("papaparse");

const fs = require("fs");
const empresaModel = require("../models/empresaModel");
const trafegoController = require("./trafegoController");
var s3;

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(empresaId, servidorId, periodo) {
  return `${empresaId}:${servidorId}:${periodo}`;
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    }
  });
} else {
  s3 = new S3Client({ region: "us-east-1" });
}

// Passar S3 client para trafegoController
trafegoController.setS3Client(s3);

const uploadToS3 = async (req, res) => {
  let filePath;

  try {
    const file = req.file;
    const { servidorId } = req.body;

    // validações
    if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado" });
    if (!servidorId) return res.status(400).json({ error: "servidorId é obrigatório" });
    if (!file.originalname.endsWith(".csv"))
      return res.status(400).json({ error: "Apenas arquivos CSV são permitidos" });

    // 1. BUSCAR EMPRESA DO SERVIDOR
    const empresaResult = await empresaModel.getIdEmpresa(servidorId);
    if (!empresaResult || empresaResult.length === 0)
      return res.status(404).json({ error: "Servidor não encontrado ou sem empresa associada" });

    const { idEmpresa: empresaId, nome: empresaNome } = empresaResult[0];
    const empresaPasta = empresaId.toString();

    const nomeArquivo = file.originalname;
    filePath = file.path;

    // 2. LER CSV PARA PEGAR DATA
    const conteudoTexto = fs.readFileSync(filePath, "utf-8");
    const linhas = conteudoTexto.trim().split("\n");

    if (linhas.length < 2)
      return res.status(400).json({ error: "CSV inválido: dados insuficientes" });

    const primeiraLinhaDados = linhas[1];
    const colunas = primeiraLinhaDados.split(";");

    const data = colunas[1];
    if (!data || !data.includes("-"))
      return res.status(400).json({ error: "CSV inválido: data não encontrada" });

    const [partdata] = data.split(" ");
    const [ano, mes, dia] = partdata.split("-");

    // -------------------------
    // 3. STREAM PARA S3
    // -------------------------
    const fileStream = fs.createReadStream(filePath);

    const key = `${empresaPasta}/${servidorId}/${ano}/${mes}/${dia}/${nomeArquivo}`;

    const uploadParams = {
      Bucket: "monitora-raw",
      Key: key,
      Body: fileStream,
      ContentType: "text/csv",
    };

    console.log(`Uploading S3: bucket=monitora-raw key=${key}`);
    await s3.send(new PutObjectCommand(uploadParams));

    return res.json({
      message: "Upload realizado com sucesso!",
      bucket: "monitora-raw",
      key,
      empresaId,
      empresaNome
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Falha ao enviar para o S3", details: error.message });

  } finally {
    // remover CSV temporário
    if (filePath) {
      fs.promises.unlink(filePath).catch(err => {
        console.warn(`Falha ao remover temp ${filePath}:`, err.message);
      });
    }
  }
};


async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

function readCSV(req, res) {
  const bucket = "monitora-client";
  // prefix = caminho do arquivo (sem o arquivo final)
  var prefix = req.params.prefix;
  // 0 = ultimo, 1 = penutimo ...
  var index = req.params.index;

  // Validação
  if (!prefix) {
    return res.status(400).send("O prefixo é obrigatório!");
  }
  if (index === undefined) {
    return res.status(400).send("O index é obrigatório!");
  }

  // Corrigindo o caminho caso venha da maneira incorreta
  if (!prefix.endsWith("/")) prefix += "/";

  index = Number(index);
  if (isNaN(index)) {
    return res.status(400).send("O index deve ser um número!");
  }

  // Listando os arquivos encontrados na S3
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix
  });

  s3.send(listCommand)
    .then(list => {

      if (!list.Contents || list.Contents.length === 0) {
        return res.status(404).send("Nenhum arquivo encontrado nesse prefixo.");
      }

      // Ordenar os arquivos
      const sorted = list.Contents.sort(
        (a, b) => b.LastModified - a.LastModified
      );

      if (index < 0 || index >= sorted.length) {
        return res.status(400).send(`Index inválido. Existem apenas ${sorted.length} arquivos.`);
      }

      const fileKey = sorted[index].Key;

      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey
      });

      return s3.send(getCommand)
        .then(async file => {
          const text = await streamToString(file.Body);

          // Transformando csv para json
          const parsed = Papa.parse(text, {
            delimiter: ";",
            skipEmptyLines: true
          }).data;

          // Formatando o json
          const header = parsed[0];
          const formated = [];
          for (var i = 1; i < parsed.length; i++) {
            const thread = parsed[i];
            if (!thread || thread.length == 0) continue;
            let object = {};

            for (let j = 0; j < header.length; j++) {
              object[header[j]] = thread[j];
            }
            formated.push(object);
          }

          return res.json({
            success: true,
            prefix,
            index,
            key: fileKey,
            totalArquivos: sorted.length,
            rows: formated
          });
        });
    })
    .catch(err => {
      console.error("Erro ao ler CSV:", err);
      return res.status(500).send("Erro interno ao ler CSV do S3.");
    });
}




module.exports = {
  uploadToS3,
  readCSV,
  // funções do trafegoController
  getKPITrafego: trafegoController.getKPITrafego,
  getDadosTrafego: trafegoController.getDadosTrafego,
  getDadosPacotes: trafegoController.getDadosPacotes
};
