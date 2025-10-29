const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

// O SDK AWS vai automaticamente usar as credenciais da instância EC2
const s3 = new S3Client({ region: "us-east-1" });

const uploadToS3 = async (req, res) => {
  try {
    
    const file = req.file;
    const { empresaId, servidorId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    if (!empresaId || !servidorId) {
      return res.status(400).json({ error: "empresaId e servidorId são obrigatórios" });
    }

 
    const nomeArquivo = file.originalname;

    
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    const key = `${empresaId}/${servidorId}/${ano}/${mes}/${nomeArquivo}`;

    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: "Raw", // nome do bucket
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype || "application/octet-stream",
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Remove arquivo temporário assincronamente
    await fs.promises.unlink(file.path);

    return res.json({ message: "Upload realizado com sucesso no S3!" });
  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Falha ao enviar para o S3" });
  }
};

module.exports = {
    uploadToS3
};