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
          if (idx === 0) console.log('[CSV HEADER]', Object.keys(row));
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

  console.log(`[PROCESSADO] ${linhas.length} linhas de ${selecionados.length} arquivos`);

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
      console.log(`[CACHE HIT] KPI ${periodo}`);
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
      console.log('[DEBUG] Chaves disponíveis:', Object.keys(firstRow));

      bytesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('env')) || bytesEnvCol;
      bytesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('bytes') && k.toLowerCase().includes('recb')) || bytesRecbCol;
      pacotesEnvCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('env')) || pacotesEnvCol;
      pacotesRecbCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('recb')) || pacotesRecbCol;
      pacotesPerdCol = Object.keys(firstRow).find(k => k.toLowerCase().includes('pacot') && k.toLowerCase().includes('perd')) || pacotesPerdCol;

      console.log(`[AUTO-DETECT] Colunas detectadas: env=${bytesEnvCol}, recb=${bytesRecbCol}, pacotes_env=${pacotesEnvCol}`);
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

    console.log(`totalLinhas processadas: ${todosDados.length}, totalArquivos: ${totalArquivosProcessados}`);
    console.log('Amostra de dados (primeiros 3):', todosDados.slice(0, 3));
    const deltas = gerarDeltas(todosDados);

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


function calcularKPIs(dados) {
  if (dados.length === 0) {
    return {
      trafegoMedioUltimaHora: "0 Mbps",
      perdaPacotes: "0%",
      dadosEnviados: "0 MB",
      dadosRecebidos: "0 MB"
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
    const env = Number(d.bytesEnv_delta) || 0;
    const recb = Number(d.bytesRecb_delta) || 0;

    totalEnviados += Number(d.pacotesEnv_delta) || 0;
    totalPerdidos += Number(d.pacotesPerd_delta) || 0;

    totalBytesEnv += env;
    totalBytesRecb += recb;

    if (d.timestamp > umaHoraAtras) {
      bytesUltimaHoraEnv += env;
      bytesUltimaHoraRecb += recb;

      if (!primeiroTimestampUltimaHora || d.timestamp < primeiroTimestampUltimaHora)
        primeiroTimestampUltimaHora = d.timestamp;

      if (!ultimoTimestampUltimaHora || d.timestamp > ultimoTimestampUltimaHora)
        ultimoTimestampUltimaHora = d.timestamp;
    }
  }

  const perdaPacotes = totalEnviados > 0
    ? ((totalPerdidos / totalEnviados) * 100).toFixed(2) + "%"
    : "0%";

  // ⬇️ CORREÇÃO: usar **MB**, não GB
  const enviadosMB = (totalBytesEnv / (1024 * 1024)).toFixed(2) + " MB";
  const recebidosMB = (totalBytesRecb / (1024 * 1024)).toFixed(2) + " MB";

  // evitar intervalo zero
  let intervaloSegundos = 60;
  if (primeiroTimestampUltimaHora && ultimoTimestampUltimaHora) {
    const diff = (ultimoTimestampUltimaHora - primeiroTimestampUltimaHora) / 1000;
    intervaloSegundos = diff > 0 ? diff : 60;
  }

  // tráfego total da última hora (ENVI + RECB)
  const bytesUltimaHora = bytesUltimaHoraEnv + bytesUltimaHoraRecb;

  // Mbps = (bytes * 8) / (segundos * 1024 * 1024)
  const mbps = ((bytesUltimaHora * 8) / (intervaloSegundos * 1024 * 1024))
    .toFixed(2) + " Mbps";

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
    if (cached) return res.json(cached);

    const { linhas, agora } = await carregarDadosTrafego(
      empresaId, servidorId, periodo, true
    );

    if (!linhas.length)
      return res.json({ success: true, periodo, labels: [], valores: [] });

    // Detectar colunas
    const first = linhas[0].row;
    const colEnv = Object.keys(first).find(k => k.includes("env")) || "bytesEnv";
    const colRecb = Object.keys(first).find(k => k.includes("recb")) || "bytesRecb";

    // Converter linhas em valores numéricos
    const dados = linhas.map(l => ({
      ts: l.ts,
      env: Number(l.row[colEnv] || 0),
      recb: Number(l.row[colRecb] || 0)
    }));

    // Ordenar e gerar deltas
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

    let labels = [];
    let valores = [];

    if (periodo === "24h") {
      // Agrupar por hora (9 pontos)
      const horaMap = {};

      deltas.forEach(p => {
        const h = new Date(p.ts);
        h.setMinutes(0, 0, 0);
        const key = h.toISOString();
        horaMap[key] = (horaMap[key] || 0) + p.delta;
      });

      for (let i = 8; i >= 0; i--) {
        const h = new Date(agora - i * 3600 * 1000);
        h.setMinutes(0, 0, 0);
        const key = h.toISOString();
        labels.push(h.getHours().toString().padStart(2, "0") + "h");

        // Conversão correta para Mbps (delta/hora)
        const bytes = horaMap[key] || 0;
        const mbps = (bytes * 8) / (3600 * 1024 * 1024);

        valores.push(Number(mbps.toFixed(2)));
      }

    } else {
      // 7d e 30d → exibir MB/dia
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
    console.error("Erro na série de tráfego:", err);
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
  gerarDeltas
};
