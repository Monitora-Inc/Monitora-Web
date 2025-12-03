const { S3Client, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const Papa = require("papaparse");

var s3;

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

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


function setS3Client(s3Client) {
  s3 = s3Client;
}

async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

async function carregarDadosTrafego(empresaId, servidorId, periodo, usarHeader) {
  const agora = new Date();
  const horasMap = { "24h": 24, "7d": 168, "30d": 720 };
  const horas = horasMap[periodo] || 24;
  const dataInicio = new Date(agora.getTime() - horas * 3600 * 1000);

  const basePrefix = `${empresaId}/trafegoRede/${servidorId}/`;

  const listar = await s3.send(new ListObjectsV2Command({
    Bucket: "monitora-client",
    Prefix: basePrefix
  }));

  const arquivos = (listar.Contents || [])
    .filter(a => a.Key.endsWith(".csv") && a.LastModified >= dataInicio)
    .sort((a, b) => b.LastModified - a.LastModified);

  const maxArquivos = periodo === "24h" ? 24 : periodo === "7d" ? 50 : 300;
  const selecionados = arquivos.slice(0, maxArquivos);

  console.log(`${arquivos.length}, usando ${selecionados.length}`);

  const linhas = [];

  for (const obj of selecionados) {
    try {
      const file = await s3.send(new GetObjectCommand({
        Bucket: "monitora-client",
        Key: obj.Key
      }));

      const text = await streamToString(file.Body);
      const resultado = Papa.parse(text, {
        delimiter: ";",
        skipEmptyLines: true,
        header: usarHeader
      }).data;

      if (usarHeader) {
        resultado.forEach((row, idx) => {
          if (!row.timestamp) return;
          const ts = new Date(row.timestamp);
          if (isNaN(ts) || ts < dataInicio || ts > agora) return;
          if (idx === 0) console.log('header csv', Object.keys(row));
          linhas.push({ ts, row });
        });
      } else {
        for (let i = 1; i < resultado.length; i++) {
          const linha = resultado[i];
          if (!linha || linha.length < 4) continue;
          const ts = new Date(linha[1]);
          if (isNaN(ts) || ts < dataInicio || ts > agora) continue;
          linhas.push({ ts, linha });
        }
      }
    } catch (err) {
      console.error(`Erro ao processar ${obj.Key}:`, err.message);
    }
  }


  return { linhas, agora, dataInicio, arquivosFiltrados: arquivos };
}

async function getKPITrafego(req, res) {
  try {
    const { empresaId, servidorId, periodo = '24h' } = req.query;
    if (!empresaId || !servidorId) {
      return res.status(400).json({
        error: "empresaId e servidorId são obrigatórios"
      });
    }


    const cacheKey = getCacheKey(empresaId, servidorId, `kpi_${periodo}`);
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const { linhas, arquivosFiltrados } = await carregarDadosTrafego(empresaId, servidorId, periodo, true);
    const totalArquivosProcessados = arquivosFiltrados.length;


    let bytesEnvCol = 'bytes_env';
    let bytesRecbCol = 'bytes_recb';
    let pacotesEnvCol = 'pacotes_enviados';
    let pacotesRecbCol = 'pacotes_recebidos';
    let pacotesPerdCol = 'pacotes_perdidos';

    if (linhas.length > 0) {
      const firstRow = linhas[0].row;

      bytesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('env')) || bytesEnvCol;
      bytesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('recb')) || bytesRecbCol;
      pacotesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('env')) || pacotesEnvCol;
      pacotesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('recb')) || pacotesRecbCol;
      pacotesPerdCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('perd')) || pacotesPerdCol;

    }

    const todosDados = linhas.map(({ ts, row }) => {
      const bytesEnv = parseFloat(row[bytesEnvCol]) || 0;
      const bytesRecb = parseFloat(row[bytesRecbCol]) || 0;

      return {
        timestamp: ts,
        bytesEnv,
        bytesRecb,
        pacotes_enviados: parseInt(row[pacotesEnvCol]) || 0,
        pacotes_recebidos: parseInt(row[pacotesRecbCol]) || 0,
        pacotes_perdidos: parseInt(row[pacotesPerdCol]) || 0
      };
    });

    const kpis = calcularKPIs(todosDados);

    const response = {
      success: true,
      periodo,
      timestamp: new Date().toISOString(),
      totalLinhas: todosDados.length,
      totalArquivos: totalArquivosProcessados,
      ...kpis
    };


    setCache(cacheKey, response);

    return res.json(response);

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
      trafegoMedioUltimaHora: "0 Gbps",
      perdaPacotes: "0%",
      dadosEnviados: "0 GB",
      dadosRecebidos: "0 GB"
    };
  }

  const agora = new Date();
  const umaHoraAtras = new Date(agora.getTime() - 3600 * 1000);

  let totalEnviados = 0;
  let totalPerdidos = 0;
  let totalBytesEnv = 0;
  let totalBytesRecb = 0;
  let bytesUltimaHoraEnv = 0;
  let bytesUltimaHoraRecb = 0;
  let primeiroTimestampUltimaHora = null;
  let ultimoTimestampUltimaHora = null;

  for (const d of dados) {
    const env = Number(d.bytesEnv) || 0;
    const recb = Number(d.bytesRecb) || 0;

    totalEnviados += Number(d.pacotes_enviados) || 0;
    totalPerdidos += Number(d.pacotes_perdidos) || 0;
    totalBytesEnv += env;
    totalBytesRecb += recb;

    if (d.timestamp > umaHoraAtras) {
      bytesUltimaHoraEnv += env;
      bytesUltimaHoraRecb += recb;
      if (!primeiroTimestampUltimaHora || d.timestamp < primeiroTimestampUltimaHora) {
        primeiroTimestampUltimaHora = d.timestamp;
      }
      if (!ultimoTimestampUltimaHora || d.timestamp > ultimoTimestampUltimaHora) {
        ultimoTimestampUltimaHora = d.timestamp;
      }
    }
  }

  console.log(` totalBytesEnv: ${totalBytesEnv}, totalBytesRecb: ${totalBytesRecb}, bytesUltimaHora: ${bytesUltimaHoraEnv + bytesUltimaHoraRecb}`);

  const perdaPacotes = totalEnviados > 0
    ? ((totalPerdidos / totalEnviados) * 100).toFixed(2) + '%'
    : '0%';

  // Convertendo para MB  para simular GB
  const enviadosMB = (totalBytesEnv / (1024 * 1024)).toFixed(2) + ' GB';
  const recebidosMB = (totalBytesRecb / (1024 * 1024)).toFixed(2) + ' GB';

  //  intervalo  entre primeiro e último timestamp da ÚLTIMA HORA (em segundos)
  let intervaloSegundos = 60; 
  if (primeiroTimestampUltimaHora && ultimoTimestampUltimaHora) {
    const diff = (ultimoTimestampUltimaHora - primeiroTimestampUltimaHora) / 1000;
    intervaloSegundos = diff > 0 ? diff : 60;
  }

  // Gb da última hora
  const bytesUltimaHora = bytesUltimaHoraEnv + bytesUltimaHoraRecb;
  const mbps = ((bytesUltimaHora * 8) / (intervaloSegundos * 1024 * 1024)).toFixed(2) + ' Gbps';


  return {
    perdaPacotes,
    dadosEnviados: enviadosMB,
    dadosRecebidos: recebidosMB,
    trafegoMedioUltimaHora: mbps
  };
}

async function getDadosTrafego(req, res) {
  try {
    const { empresaId, servidorId, periodo = '24h' } = req.query;

    const cacheKey = getCacheKey(empresaId, servidorId, `dados_${periodo}`);
    const cached = getCached(cacheKey);
    if (cached) {
      console.log(`Dados ${periodo}`);
      return res.json(cached);
    }

    const { linhas, arquivosFiltrados, agora } = await carregarDadosTrafego(empresaId, servidorId, periodo, true);

    let bytesEnvCol = 'bytesEnv', bytesRecbCol = 'bytesRecb';
    if (linhas[0]) {
      const firstRow = linhas[0].row;
      bytesEnvCol = Object.keys(firstRow).find(k => k.includes('env')) || 'bytesEnv';
      bytesRecbCol = Object.keys(firstRow).find(k => k.includes('recb')) || 'bytesRecb';
    }

    const pontos = linhas.map(({ ts, row }) => ({
      ts,
      valor: (parseFloat(row[bytesEnvCol]) || 0) + (parseFloat(row[bytesRecbCol]) || 0)
    }));

    let labels = [], valores = [];

    if (periodo === '24h') {
      const horaMap = {};
      pontos.forEach(p => {
        const h = new Date(p.ts);
        h.setMinutes(0, 0, 0, 0);
        const chave = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}_${String(h.getHours()).padStart(2, '0')}`;
        horaMap[chave] = (horaMap[chave] || 0) + p.valor;
      });

      const horasBase = [];
      for (let i = 8; i >= 0; i--) {
        const h = new Date(agora.getTime() - i * 60 * 60 * 1000);
        h.setMinutes(0, 0, 0, 0);
        horasBase.push(h);
      }

      horasBase.forEach(h => {
        const chave = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}_${String(h.getHours()).padStart(2, '0')}`;
        const somaBytes = horaMap[chave] || 0;
        labels.push(h.getHours().toString().padStart(2, '0') + 'h');
        valores.push(Number(((somaBytes * 8) / (3600 * 1024 * 1024)).toFixed(2)));
      });
    } else if (periodo === '7d') {
      for (let i = 6; i >= 0; i--) {
        const dia = new Date(agora.getTime() - i * 24 * 60 * 60 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 24 * 60 * 60 * 1000);
        const soma = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.valor, 0);
        labels.push(ini.getDate().toString().padStart(2, '0') + '/' + (ini.getMonth() + 1));
        valores.push(Number((soma / (1024 * 1024)).toFixed(2)));
      }
    } else { 
      // mostrar total diário em MB (não converter para Mbps)
      for (let i = 29; i >= 0; i--) {
        const dia = new Date(agora.getTime() - i * 24 * 60 * 60 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 24 * 60 * 60 * 1000);
        const soma = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.valor, 0);
        labels.push(ini.getDate().toString().padStart(2, '0') + '/' + (ini.getMonth() + 1));
      
        valores.push(Number((soma / (1024 * 1024)).toFixed(2)));
      }
    }

    const response = { success: true, periodo, labels, valores };

    setCache(cacheKey, response);
    return res.json(response);

  } catch (error) {
    console.error("Erro na série de tráfego:", error);
    return res.status(500).json({
      error: "Erro ao montar série de tráfego",
      details: error.message
    });
  }
}

async function getDadosPacotes(req, res) {
  try {
    const { empresaId, servidorId, periodo = '24h' } = req.query;

    const cacheKey = getCacheKey(empresaId, servidorId, `pacotes_${periodo}`);
    const cached = getCached(cacheKey);
    if (cached) {
      console.log(`Pacotes ${periodo}`);
      return res.json(cached);
    }

    const { linhas, arquivosFiltrados, agora } = await carregarDadosTrafego(empresaId, servidorId, periodo, true);

    let pacotesEnvCol = 'pacotes_enviados', pacotesRecbCol = 'pacotes_recebidos';
    if (linhas[0]) {
      const firstRow = linhas[0].row;
      pacotesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('env')) || pacotesEnvCol;
      pacotesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('recb')) || pacotesRecbCol;
      console.log(`Colunas: env=${pacotesEnvCol}, recb=${pacotesRecbCol}`);
    }

    const pontos = linhas.map(({ ts, row }) => ({
      ts,
      pacotes_enviados: parseInt(row[pacotesEnvCol]) || 0,
      pacotes_recebidos: parseInt(row[pacotesRecbCol]) || 0
    }));

    let labels = [], pacotes_recebidos = [], pacotes_enviados = [];

    if (periodo === '24h') {
    
      const horaMapRecb = {}, horaMapEnv = {};
      pontos.forEach(p => {
        const h = new Date(p.ts);
        h.setMinutes(0, 0, 0, 0);
        const chave = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}_${String(h.getHours()).padStart(2, '0')}`;
        horaMapRecb[chave] = (horaMapRecb[chave] || 0) + p.pacotes_recebidos;
        horaMapEnv[chave] = (horaMapEnv[chave] || 0) + p.pacotes_enviados;
      });

      // Últimas 9 horas 
      for (let i = 8; i >= 0; i--) {
        const h = new Date(agora.getTime() - i * 60 * 60 * 1000);
        h.setMinutes(0, 0, 0, 0);
        const chave = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}_${String(h.getHours()).padStart(2, '0')}`;
        labels.push(h.getHours().toString().padStart(2, '0') + 'h');
        pacotes_recebidos.push(horaMapRecb[chave] || 0);
        pacotes_enviados.push(horaMapEnv[chave] || 0);
      }
    } else if (periodo === '7d') {
   
      for (let i = 6; i >= 0; i--) {
        const dia = new Date(agora.getTime() - i * 24 * 60 * 60 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 24 * 60 * 60 * 1000);
        
        const somaRecb = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.pacotes_recebidos, 0);
        const somaEnv = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.pacotes_enviados, 0);
        
        labels.push(ini.getDate().toString().padStart(2, '0') + '/' + (ini.getMonth() + 1));
        pacotes_recebidos.push(somaRecb);
        pacotes_enviados.push(somaEnv);
      }
    } else { 
      
      for (let i = 29; i >= 0; i--) {
        const dia = new Date(agora.getTime() - i * 24 * 60 * 60 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 24 * 60 * 60 * 1000);
        
        const somaRecb = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.pacotes_recebidos, 0);
        const somaEnv = pontos.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.pacotes_enviados, 0);
        
        labels.push(ini.getDate().toString().padStart(2, '0') + '/' + (ini.getMonth() + 1));
        pacotes_recebidos.push(somaRecb);
        pacotes_enviados.push(somaEnv);
      }
    }

    const response = {
      success: true,
      periodo,
      labels,
      pacotes_recebidos,
      pacotes_enviados
    };

    setCache(cacheKey, response);
    console.log(`${labels.length} pontos: recb=${pacotes_recebidos[0]}, env=${pacotes_enviados[0]}`);
    return res.json(response);

  } catch (error) {
    console.error("Erro pacotes:", error);
    return res.status(500).json({ error: "Erro ao processar pacotes", details: error.message });
  }
}

module.exports = {
  getKPITrafego,
  calcularKPIs,
  getDadosTrafego,
  carregarDadosTrafego,
  getDadosPacotes,
  setS3Client
};
