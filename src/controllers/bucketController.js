const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const Papa = require("papaparse");

const fs = require("fs");
const empresaModel = require("../models/empresaModel");
var s3;

if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    }
  });
}else {
  s3 = new S3Client({ region: "us-east-1" });
}

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
          for(var i = 1; i < parsed.length; i++) {
            const thread = parsed[i];
            if(!thread || thread.length == 0) continue;
            let object = {};

            for(let j = 0; j < header.length; j++){
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



//----------------MARIA-----------------

async function getKPITrafego24h(req, res) {
    try {
        const { empresaId, servidorId } = req.query;
        if (!empresaId || !servidorId) {
            return res.status(400).json({ 
                error: "empresaId e servidorId são obrigatórios" 
            });
        }

        const agora = new Date();
        const dataInicio = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

        // prefixo base
        const basePrefix = `${empresaId}/${servidorId}/trafegoRede/`;

        //todos os arquivos do servidor
        const listar = await s3.send(new ListObjectsV2Command({
            Bucket: "monitora-client",
            Prefix: basePrefix
        }));

        const arquivos = (listar.Contents || [])
            .filter(a => a.Key.endsWith(".csv"))
            .filter(a => a.LastModified >= dataInicio) // <--filtro 24h
            .sort((a, b) => b.LastModified - a.LastModified)
            .slice(0, 24); // máximo 24 arquivos (1 por hora)

        let todosDados = [];

        for (const obj of arquivos) {
            const file = await s3.send(new GetObjectCommand({
                Bucket: "monitora-client",
                Key: obj.Key
            }));

            const text = await streamToString(file.Body);

            const parsed = Papa.parse(text, {
                delimiter: ";",
                skipEmptyLines: true
            }).data;

            for (let i = 1; i < parsed.length; i++) {
                const linha = parsed[i];

                todosDados.push({
                    timestamp: new Date(linha[1]),
                    bytesEnv: parseFloat(linha[2]) || 0,
                    bytesRecb: parseFloat(linha[3]) || 0,
                    pacotes_enviados: parseInt(linha[5]) || 0,
                    pacotes_recebidos: parseInt(linha[6]) || 0,
                    pacotes_perdidos: parseInt(linha[7]) || 0
                });
            }
        }

        const kpis = calcularKPIs(todosDados);

        return res.json({
            success: true,
            timestamp: new Date().toISOString(),
            totalLinhas: todosDados.length,
            totalArquivos: arquivos.length,
            ...kpis
        });

    } catch (error) {
        console.error("Erro no KPI:", error);
        return res.status(500).json({ 
            error: "Erro ao calcular KPIs", 
            details: error.message 
        });
    }
}


function calcularKPIs(dados) {
    if (dados.length === 0) {
        return {
            trafegoMedioUltimaHora: "0 Gbit/s",
            perdaPacotes: "0%",
            dadosEnviados: "0 GB",
            dadosRecebidos: "0 GB"
        };
    }

    const agora = new Date();
    const umaHoraAtras = new Date(agora.getTime() - 3600 * 1000);

    const dadosUltimaHora = dados.filter(d => d.timestamp > umaHoraAtras);

    const totalEnviados = dados.reduce((s, d) => s + d.pacotes_enviados, 0);
    const totalPerdidos = dados.reduce((s, d) => s + d.pacotes_perdidos, 0);

    const perdaPacotes = totalEnviados > 0
        ? ((totalPerdidos / totalEnviados) * 100).toFixed(2) + '%'
        : '0%';

    const totalBytesEnv = dados.reduce((s, d) => s + d.bytesEnv, 0);
    const totalBytesRecb = dados.reduce((s, d) => s + d.bytesRecb, 0);

    const enviadosGB = (totalBytesEnv / (1024 * 1024)).toFixed(1) + ' GB'; //deixando em MB só para os valores não ficarem muito pequenos
    const recebidosGB = (totalBytesRecb / (1024 * 1024)).toFixed(1) + ' GB';

    const bytesUltimaHora = dadosUltimaHora
        .reduce((s, d) => s + d.bytesEnv + d.bytesRecb, 0);

    const intervaloSegundos = dadosUltimaHora.length > 0
        ? (agora - dadosUltimaHora[0].timestamp) / 1000
        : 3600;

    const gbps = ((bytesUltimaHora * 8) / intervaloSegundos / 1e9)
        .toFixed(1) + ' Gbit/s';

    return {
        perdaPacotes,
        dadosEnviados: enviadosGB,
        dadosRecebidos: recebidosGB,
        trafegoMedioUltimaHora: gbps
    };
}


module.exports = {
  uploadToS3,
  readCSV,
  getKPITrafego24h,
  calcularKPIs
};
