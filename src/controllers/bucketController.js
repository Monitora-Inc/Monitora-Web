const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const empresaModel = require("../models/empresaModel");

// SDK AWS 
const s3 = new S3Client({ region: "us-east-1" });

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

    const [ano, mes, dia] = data.split("-"); 

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

module.exports = {
  uploadToS3,
};
