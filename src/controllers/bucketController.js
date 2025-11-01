const fs = require("fs");
const axios = require("axios");
const empresaModel = require("../models/empresaModel");

const uploadToS3 = async (req, res) => {
  let filePath;
  try {
    const file = req.file;
    const { servidorId } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    if (!servidorId) {
      return res.status(400).json({ error: "servidorId é obrigatório" });
    }
    if (!file.originalname.endsWith(".csv")) {
      return res.status(400).json({ error: "Apenas arquivos CSV são permitidos" });
    }

    // Busca empresa pelo servidor
    const empresaResult = await empresaModel.getNomeEmpresa(servidorId);
    if (!empresaResult || empresaResult.length === 0) {
      return res
        .status(404)
        .json({ error: "Servidor não encontrado ou não está associado a uma empresa" });
    }

    const { idEmpresa: empresaId, nome: empresaNome } = empresaResult[0];
    const empresaPasta = empresaNome.toLowerCase();

    const nomeArquivo = file.originalname;
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    // Estrutura: empresa/servidor/ano/mes/arquivo.csv
    const key = `${empresaPasta}/${servidorId}/${ano}/${mes}/${nomeArquivo}`;
    const bucketName = "monitora-raw";

    filePath = file.path;
    const fileStream = fs.createReadStream(filePath);

    const url = `https://${bucketName}.s3.amazonaws.com/${encodeURIComponent(key)}`;
    console.log(`Enviando CSV público para: ${url}`);

    // Upload direto via PUT HTTP (sem credenciais)
    const response = await axios.put(url, fileStream, {
      headers: {
        "Content-Type": "text/csv",
        "x-amz-acl": "public-read",
      },
      maxBodyLength: Infinity,
    });

    console.log(
      `✅ Sucesso Upload público empresa=${empresaId} (${empresaNome}), servidor=${servidorId}`
    );

    return res.json({
      message: "Upload público realizado com sucesso!",
      publicUrl: url,
      empresaId,
      empresaNome,
    });
  } catch (error) {
    console.error("Erro no upload público:", error.response?.data || error.message);
    return res.status(500).json({ error: "Falha ao enviar para o S3 público" });
  } finally {

    if (filePath) {
      fs.promises.unlink(filePath).catch((err) => {
        console.warn(`Falha ao remover arquivo temporário ${filePath}:`, err.message);
      });
    }
  }
};

module.exports = {
  uploadToS3,
};
