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

 function formatarGBouTB(valorGB) {
      if (valorGB >= 1024) {
        const valorTB = (valorGB / 1024).toFixed(2);
        return `${valorTB} TB`;
      }
      return `${valorGB.toFixed(2)} GB`;
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
          if (idx === 0) console.log('header do csv', Object.keys(row));
          linhas.push({ row });
        });
      } else {
        for (let i = 1; i < resultado.length; i++) {
          const linha = resultado[i];
          if (!linha || linha.length < 4) continue;
          const ts = new Date(linha[1]);

          linhas.push({ linha });
        }
      }
    } catch (err) {
      console.error(`Erro ao processar ${obj.Key}:`, err.message);
    }
  }

  console.log(`${linhas.length} linhas de ${selecionados.length} arquivos`);
  if (linhas.length > 0) {
    const inicio = dataInicio.getTime();
    const fim = agora.getTime();
    const intervalo = fim - inicio;

    linhas.forEach((item, idx) => {
      const fator = linhas.length === 1 ? 1 : idx / (linhas.length - 1);
      const tsMs = inicio + intervalo * fator;
      item.ts = new Date(tsMs);
    });
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
      console.log('Chaves disponíveis:', Object.keys(firstRow));

      bytesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('env')) || bytesEnvCol;
      bytesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('recb')) || bytesRecbCol;
      pacotesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('env')) || pacotesEnvCol;
      pacotesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('recb')) || pacotesRecbCol;
      pacotesPerdCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('perd')) || pacotesPerdCol;

      console.log(`Colunas: env=${bytesEnvCol}, recb=${bytesRecbCol}, pacotes_env=${pacotesEnvCol}`);
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

    const deltas = gerarDeltas(todosDados);
    deltas.forEach(d => {
      d.bytesEnv_delta = d.bytesEnv_delta * 1024;
      d.bytesRecb_delta = d.bytesRecb_delta * 1024;
      d.pacotesEnv_delta = d.pacotesEnv_delta * 1024;
      d.pacotesRecb_delta = d.pacotesRecb_delta * 1024;
      d.pacotesPerd_delta = d.pacotesPerd_delta * 1024;
    });


   
    const kpis = calcularKPIs(deltas);

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
function gerarDeltas(dados) {
  let anterior = null;
  let lista = [];

  for (const d of dados.sort((a, b) => a.timestamp - b.timestamp)) {

    if (anterior) {
      const deltaEnv = Math.max(0, d.bytesEnv - anterior.bytesEnv);
      const deltaRecb = Math.max(0, d.bytesRecb - anterior.bytesRecb);

      const deltaPacEnv = Math.max(0, d.pacotes_enviados - anterior.pacotes_enviados);
      const deltaPacRecb = Math.max(0, d.pacotes_recebidos - anterior.pacotes_recebidos);
      const deltaPacPerd = Math.max(0, d.pacotes_perdidos - anterior.pacotes_perdidos);

      lista.push({
        timestamp: d.timestamp,
        bytesEnv_delta: deltaEnv,
        bytesRecb_delta: deltaRecb,
        pacotesEnv_delta: deltaPacEnv,
        pacotesRecb_delta: deltaPacRecb,
        pacotesPerd_delta: deltaPacPerd
      });
    }

    anterior = d;
  }

  return lista;
}


function calcularKPIs(dados, periodo = '24h') {
  if (dados.length === 0) {
    return {
      trafegoMedio: "0 Gbps",
      perdaPacotes: "0%",
      dadosEnviados: "0 GB",
      dadosRecebidos: "0 GB"
    };
  }

  let totalEnviados = 0;
  let totalPerdidos = 0;
  let totalBytesEnv = 0;
  let totalBytesRecb = 0;

  for (const d of dados) {
    const env = Number(d.bytesEnv_delta) || 0;
    const recb = Number(d.bytesRecb_delta) || 0;

    totalEnviados += Number(d.pacotesEnv_delta) || 0;
    totalPerdidos += Number(d.pacotesPerd_delta) || 0;

    totalBytesEnv += env;
    totalBytesRecb += recb;
  }

  const perdaPacotes = totalEnviados > 0
    ? ((totalPerdidos / totalEnviados) * 100).toFixed(2) + "%"
    : "0%";


  const enviadosGB = totalBytesEnv / (1024 * 1024);
  const recebidosGB = totalBytesRecb / (1024 * 1024);


  const enviadosFmt = formatarGBouTB(enviadosGB);
  const recebidosFmt = formatarGBouTB(recebidosGB);


  let janelaSegundos;
  if (periodo === '24h') {
    janelaSegundos = 3600;
  } else if (periodo === '7d') {

    janelaSegundos = 7 * 24 * 3600;
  } else if (periodo === '30d') {

    janelaSegundos = 30 * 24 * 3600;
  } else {
    // padrao: assume 24h
    janelaSegundos = 24 * 3600;
  }

  const bytesTotaisPeriodo = totalBytesEnv + totalBytesRecb;
  const mbpsMedio = ((bytesTotaisPeriodo * 8) / (janelaSegundos * 1024 * 1024))
    .toFixed(2) + " Gbps";

  return {
    perdaPacotes,
    dadosEnviados: enviadosFmt,
    dadosRecebidos: recebidosFmt,
    trafegoMedio: mbpsMedio
  };
}

async function getDadosTrafego(req, res) {
  try {
    const { empresaId, servidorId, periodo = '24h' } = req.query;

    const cacheKey = getCacheKey(empresaId, servidorId, `dados_${periodo}`);
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const { linhas, agora } = await carregarDadosTrafego(
      empresaId, servidorId, periodo, true
    );

    if (!linhas.length)
      return res.json({ success: true, periodo, labels: [], valores: [] });


    const first = linhas[0].row;
    const colEnv = Object.keys(first).find(k => k.includes("env")) || "bytesEnv";
    const colRecb = Object.keys(first).find(k => k.includes("recb")) || "bytesRecb";


    const dados = linhas.map(l => ({
      ts: l.ts,
      env: Number(l.row[colEnv] || 0),
      recb: Number(l.row[colRecb] || 0)
    }));


    dados.sort((a, b) => a.ts - b.ts);

    let anterior = null;
    const deltas = [];

    for (const d of dados) {
      if (anterior) {
        deltas.push({
          ts: d.ts,
          delta: Math.max(0, (d.env - anterior.env)) +
            Math.max(0, (d.recb - anterior.recb))
        });
      }
      anterior = d;
    }


    deltas.forEach(d => {
      d.delta = d.delta * 1024;
    });

    let labels = [];
    let valores = [];

    if (periodo === "24h") {
      const horaCount = 9;

      for (let i = horaCount - 1; i >= 0; i--) {
        const h = new Date(agora.getTime() - i * 3600 * 1000);
        const ini = new Date(h);
        ini.setMinutes(0, 0, 0);
        const fim = new Date(ini.getTime() + 3600 * 1000);

        const soma = deltas
          .filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.delta, 0);

        labels.push(ini.getHours().toString().padStart(2, "0") + "h");
        const mbps = (soma * 8) / (3600 * 1024 * 1024);
        valores.push(Number(mbps.toFixed(2)));
      }
    } else {

      const dias = periodo === "7d" ? 7 : 30;

      for (let i = dias - 1; i >= 0; i--) {
        const dia = new Date(agora - i * 86400 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 86400000);

        const soma = deltas
          .filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.delta, 0);

        labels.push(
          ini.getDate().toString().padStart(2, "0") + "/" + (ini.getMonth() + 1)
        );
        valores.push(Number((soma / (1024 * 1024)).toFixed(2)));
      }
    }

    const response = { success: true, periodo, labels, valores };
    setCache(cacheKey, response);
    return res.json(response);

  } catch (err) {
    console.error("Erro nos valores de tráfego:", err);
    return res.status(500).json({ error: "Erro ao montar série de tráfego" });
  }
}


async function getDadosPacotes(req, res) {
  try {
    const { empresaId, servidorId, periodo = '24h' } = req.query;

    const cacheKey = getCacheKey(empresaId, servidorId, `pacotes_${periodo}`);
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const { linhas, agora } = await carregarDadosTrafego(
      empresaId, servidorId, periodo, true
    );

    if (!linhas.length)
      return res.json({ success: true, labels: [], pacotes_enviados: [], pacotes_recebidos: [] });

    const first = linhas[0].row;

    const colEnv = Object.keys(first).find(k =>
      k.toLowerCase().includes("pacot") && k.toLowerCase().includes("env")
    ) || "pacotes_enviados";

    const colRecb = Object.keys(first).find(k =>
      k.toLowerCase().includes("pacot") && k.toLowerCase().includes("recb")
    ) || "pacotes_recebidos";

    const dados = linhas.map(l => ({
      ts: l.ts,
      env: Number(l.row[colEnv] || 0),
      recb: Number(l.row[colRecb] || 0)
    }));

    dados.sort((a, b) => a.ts - b.ts);

    let anterior = null;
    const deltas = [];

    for (const d of dados) {
      if (anterior) {
        deltas.push({
          ts: d.ts,
          env: Math.max(0, d.env - anterior.env),
          recb: Math.max(0, d.recb - anterior.recb)
        });
      }
      anterior = d;
    }

    let labels = [];
    let envArr = [];
    let recbArr = [];

    if (periodo === "24h") {
      const horaEnv = {}, horaRecb = {};

      deltas.forEach(p => {
        const h = new Date(p.ts);
        h.setMinutes(0, 0, 0);
        const key = h.toISOString();
        horaEnv[key] = (horaEnv[key] || 0) + p.env;
        horaRecb[key] = (horaRecb[key] || 0) + p.recb;
      });

      for (let i = 8; i >= 0; i--) {
        const h = new Date(agora - i * 3600 * 1000);
        h.setMinutes(0, 0, 0);
        const key = h.toISOString();

        labels.push(h.getHours().toString().padStart(2, "0") + "h");
        envArr.push(horaEnv[key] || 0);
        recbArr.push(horaRecb[key] || 0);
      }

    } else {
      const dias = periodo === "7d" ? 7 : 30;

      for (let i = dias - 1; i >= 0; i--) {
        const dia = new Date(agora - i * 86400 * 1000);
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        const fim = new Date(ini.getTime() + 86400000);

        const env = deltas.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.env, 0);

        const recb = deltas.filter(p => p.ts >= ini && p.ts < fim)
          .reduce((s, p) => s + p.recb, 0);

        labels.push(
          ini.getDate().toString().padStart(2, "0") + "/" + (ini.getMonth() + 1)
        );
        envArr.push(env);
        recbArr.push(recb);
      }
    }

    const response = {
      success: true,
      periodo,
      labels,
      pacotes_enviados: envArr,
      pacotes_recebidos: recbArr
    };

    setCache(cacheKey, response);
    return res.json(response);

  } catch (err) {
    console.error("Erro pacotes:", err);
    return res.status(500).json({ error: "Erro ao processar pacotes" });
  }
}

module.exports = {
  getKPITrafego,
  calcularKPIs,
  getDadosTrafego,
  carregarDadosTrafego,
  getDadosPacotes,
  setS3Client,
  gerarDeltas,
  formatarGBouTB
};
