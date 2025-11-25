const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const empresaModel = require("../models/empresaModel");


// SDK AWS 
const s3 = new S3Client({ region: "us-east-1" });

const uploadToS3 = async (req, res) => {
  let filePath;
  try {
    
    const file = req.file;
    const { servidorId } = req.body;  // id que vem do python

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    if (!servidorId) {
      return res.status(400).json({ error: "servidorId é obrigatório" });
    }
    if (!file.originalname.endsWith('.csv')) {
      return res.status(400).json({ error: "Apenas arquivos CSV são permitidos" });
    }

    // Busca a empresa do servidor
    const empresaResult = await empresaModel.getNomeEmpresa(servidorId);
    if (!empresaResult || empresaResult.length === 0) {
      return res.status(404).json({ error: "Servidor não encontrado ou não está associado a uma empresa" });
    }
    const { idEmpresa: empresaId, nome: empresaNome } = empresaResult[0];

    //nome da empresa para usar como nome da pasta
    const empresaPasta = empresaNome.toLowerCase();          

    const nomeArquivo = file.originalname;
    
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    // Estrutura: empresa/servidor/ano/mes/arquivo.csv
    const key = `${empresaPasta}/${servidorId}/${ano}/${mes}/${nomeArquivo}`;

    filePath = file.path;
    const fileStream = fs.createReadStream(filePath);

    // Nome do bucket
    //monitora-raw
    const bucket = "monitora-raw"

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: "text/csv",  
    };

    console.log(`Uploading CSV to S3 bucket=${bucket} key=${key}`);

    await s3.send(new PutObjectCommand(uploadParams));

    console.log(`Sucesso Upload empresa=${empresaId} (${empresaNome}), servidor=${servidorId}`);
    return res.json({ 
      message: "Upload realizado com sucesso no S3!", 
      key,
      bucket: bucket,
      empresaId,
      empresaNome
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Falha ao enviar para o S3" });
  } finally {
    // tenta remover o arquivo temporário
    if (filePath) {
      fs.promises.unlink(filePath).catch((err) => {
        console.warn(`Falha ao remover arquivo temporário ${filePath}:`, err.message);
      });
    }
  }
};

module.exports = {
    uploadToS3
};