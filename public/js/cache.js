/* cache.js
   Script específico para a tela de Cache.
   - Mock de dados
   - Renderização dos KPIs básicos
   - Simulação simples de real-time
   - Funções utilitárias para cálculos
*/

/* ---------- Mock data (estrutura clara) ---------- */
const MOCK_SERVERS = [
  { id: 'srv-01', nome: 'srv-01', cidade: 'São Paulo', estado: 'SP' },
  { id: 'srv-02', nome: 'srv-02', cidade: 'Campinas', estado: 'SP' }
];

let METRICS = {
  server: 'srv-01',
  cacheHitRate: 78,        // %
  usedGB: 1200,            // GB
  usedPct: 82,             // %
  unusedGB: 256,           // GB
  unusedPct: 18,           // %
  retentionDays: [2,5,7,10,11,12,14,30,45], // valores exemplo
  costUnused: 1500,        // R$
  transferTotalTB: 4.5,    // TB
  transferRateMBs: 428,
  servedByCachePct: 78,
  latencyMs: { avg: 45, p95: 120, p99: 250 },
  requestsSlowPct: 3.1,
  latencyCorrelation: -0.85
};

/* ---------- Init ---------- */
function carregarCache() {
  popularSelects();
  renderAll();
  simulateRealtime(); // simula atualizações
}

/* ---------- Popula selects com servidores (padrão sistema) ---------- */
function popularSelects() {
  const sel = document.getElementById('select_servidor');
  sel.innerHTML = '';
  MOCK_SERVERS.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `Servidor: ${s.nome}`;
    sel.appendChild(opt);
  });
  sel.value = METRICS.server;
  sel.addEventListener('change', (e) => {
    METRICS.server = e.target.value;
    renderAll();
  });

  // período e tipo
  document.getElementById('select_periodo').addEventListener('change', renderAll);
  document.getElementById('select_tipo').addEventListener('change', renderAll);

  // period toggle buttons
  document.querySelectorAll('.btn-toggle').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.btn-toggle').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderTransferChart(b.dataset.range);
    });
  });
}

/* ---------- Render principal ---------- */
function renderAll() {
  renderKPIs();
  renderStackedChart();
  renderRetention();
  renderTransfer();
  renderLatency();
  renderAlerts();
}

/* ---------- Render KPIs básicos ---------- */
function renderKPIs() {
  document.getElementById('dc-score').textContent = calcDataCenterScore();
  document.getElementById('cache-hit-rate').textContent = `${METRICS.cacheHitRate}%`;
  document.getElementById('dados-utilizados').textContent = `${formatGB(METRICS.usedGB)}`;
  document.getElementById('dados-nao-utilizados').textContent = `${formatGB(METRICS.unusedGB)}`;
  document.getElementById('custo-inutil').textContent = formatMoney(METRICS.costUnused);

  // badge status example
  const badge = document.getElementById('badge-unused');
  const pct = METRICS.unusedPct;
  if (pct > 50) {
    badge.textContent = 'Crítico';
    badge.className = 'badge badge-critical';
  } else if (pct > 30) {
    badge.textContent = 'Alerta';
    badge.className = 'badge';
    badge.style.background = '#FEF3C7';
    badge.style.color = '#B45309';
  } else {
    badge.textContent = 'Estável';
    badge.className = 'badge';
    badge.style.background = '#ECFDF5';
    badge.style.color = '#064E3B';
  }
}

/* ---------- Stacked chart (placeholder simples) ---------- */
function renderStackedChart() {
  const wrap = document.getElementById('stacked-chart');
  wrap.innerHTML = ''; // limpa
  // Simula 6 barras com percentuais variados
  const bars = [70,65,75,80,78,82];
  bars.forEach(p => {
    const col = document.createElement('div');
    col.style.flex = '1';
    col.style.display = 'flex';
    col.style.flexDirection = 'column-reverse';
    col.style.gap = '2px';

    const used = document.createElement('div');
    used.style.height = `${p}%`;
    used.style.background = 'var(--primary, #2563EB)';
    used.style.borderTopLeftRadius = '6px';
    used.style.borderTopRightRadius = '6px';

    const unused = document.createElement('div');
    unused.style.height = `${100 - p}%`;
    unused.style.background = '#CBD5E1';
    unused.style.borderBottomLeftRadius = '6px';
    unused.style.borderBottomRightRadius = '6px';

    col.appendChild(used);
    col.appendChild(unused);
    wrap.appendChild(col);
  });
}

/* ---------- Retention ---------- */
function renderRetention() {
  const arr = METRICS.retentionDays;
  const mean = calcMean(arr).toFixed(1);
  const med = calcMedian(arr).toFixed(1);
  document.getElementById('retencao-media').textContent = `${mean} dias`;
  document.getElementById('retencao-mediana').textContent = `${med} dias`;
  // excess > 30 days
  const excess = arr.filter(v => v > 30).length;
  const pct = Math.round((excess / arr.length) * 100);
  document.getElementById('retencao-excessiva').textContent = `${pct}%`;
  document.getElementById('retencao-custo').textContent = formatMoney(Math.round((pct / 100) * METRICS.costUnused));
}

/* ---------- Transfer ---------- */
function renderTransfer() {
  document.getElementById('transfer-total').textContent = `${METRICS.transferTotalTB} TB`;
  document.getElementById('transfer-rate').textContent = `${METRICS.transferRateMBs} MB/s`;
  document.getElementById('transfer-cache').textContent = `${METRICS.servedByCachePct}%`;
  document.getElementById('transfer-nocache').textContent = `${100 - METRICS.servedByCachePct}%`;
  // chart placeholder
  renderTransferChart('day');
}
function renderTransferChart(range) {
  const el = document.getElementById('transfer-chart');
  el.innerHTML = `<div style="padding:24px;color:var(--muted)">Gráfico de transferência (${range}) — placeholder</div>`;
}

/* ---------- Latency ---------- */
function renderLatency() {
  document.getElementById('lat-media').textContent = `${METRICS.latencyMs.avg} ms`;
  document.getElementById('req-lentas').textContent = `${METRICS.requestsSlowPct}%`;
  document.getElementById('lat-corr').textContent = METRICS.latencyCorrelation;
  document.getElementById('latency-chart').innerHTML = `<div style="padding:30px;color:var(--muted)">Gráfico de latência (placeholder)</div>`;
}

/* ---------- Alerts ---------- */
function renderAlerts() {
  const list = document.getElementById('alerts-list');
  list.innerHTML = '';

  // Exemplo de alertas gerados a partir de métricas
  const alerts = [];

  if (METRICS.unusedPct > 50) alerts.push({ level: 'critico', title: 'Excesso de dados não utilizados detectado', desc: 'Recomendamos limpeza de cache para reduzir custos.' });
  if (METRICS.requestsSlowPct > 5) alerts.push({ level: 'critico', title: 'Alta porcentagem de requisições lentas', desc: 'Investigar p95/p99 e uso de disco.' });
  if (METRICS.cacheHitRate < 50) alerts.push({ level: 'aviso', title: 'Baixa taxa de acerto de cache', desc: 'Verificar configuração de TTL e invalidações.' });
  if (alerts.length === 0) alerts.push({ level: 'ok', title: 'Sistema Operando Normalmente', desc: 'Sem alertas críticos nas últimas 24h' });

  alerts.forEach(a => {
    const card = document.createElement('div');
    card.className = 'card';
    const icon = a.level === 'critico' ? '⚠️' : (a.level === 'aviso' ? 'ℹ️' : '✅');
    card.innerHTML = `
      <div style="font-size:18px;margin-right:8px">${icon}</div>
      <div>
        <div style="font-weight:700;color:${a.level==='critico'? 'var(--danger)':'var(--text-primary)'}">${a.title}</div>
        <div style="font-size:13px;color:var(--text-secondary)">${a.desc}</div>
      </div>
    `;
    list.appendChild(card);
  });
}

/* ---------- Insights (botão) ---------- */
function gerarInsights() {
  // função simulada — aqui você pode integrar com backend / IA
  alert('Gerando insights automáticos (simulação). Ver console para detalhes.');
  console.log('Insights gerados com base nas métricas: ', METRICS);
}

/* ---------- Simulação de atualização em tempo real ---------- */
// function simulateRealtime() {
//   setInterval(() => {
//     // pequenas variações aleatórias para demonstrar dinamismo
//     METRICS.cacheHitRate = clamp(METRICS.cacheHitRate + (Math.random() * 4 - 2), 40, 95);
//     METRICS.usedGB = Math.max(500, METRICS.usedGB + Math.round(Math.random() * 40 - 20));
//     METRICS.unusedGB = Math.max(50, METRICS.unusedGB + Math.round(Math.random() * 10 - 5));
//     METRICS.unusedPct = Math.round((METRICS.unusedGB / (METRICS.usedGB + METRICS.unusedGB)) * 100);
//     METRICS.transferRateMBs = Math.round(clamp(METRICS.transferRateMBs + Math.random() * 40 - 20, 50, 2000));
//     METRICS.requestsSlowPct = Math.max(0, +(METRICS.requestsSlowPct + (Math.random() * 0.4 - 0.2)).toFixed(2));

//     renderAll();
//   }, 5000); // atualiza a cada 5s
// }

/* ---------- Utilitários ---------- */
function calcMean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a,b) => a + b, 0) / arr.length;
}
function calcMedian(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a,b)=>a-b);
  const mid = Math.floor(s.length/2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid-1] + s[mid]) / 2;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function formatMoney(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatGB(gb) {
  if (gb >= 1024) return `${(gb/1024).toFixed(1)} TB`;
  return `${gb} GB`;
}

/* Score do data center (exemplo simples) */
function calcDataCenterScore() {
  // formula: (hitRate * 0.45) + (latencyScore * 0.25) + (unusedScore * 0.20) + (retentionScore * 0.10)
  const hit = METRICS.cacheHitRate; // 0-100
  // latScore: quanto menor a latência média, maior a pontuação (inverte)
  const latScore = clamp(100 - METRICS.latencyMs.avg, 0, 100);
  const unusedScore = clamp(100 - METRICS.unusedPct, 0, 100);
  // retentionScore: menos retenção excessiva => melhor
  const excessPct = METRICS.retentionDays.filter(d=>d>30).length / (METRICS.retentionDays.length || 1) * 100;
  const retScore = clamp(100 - excessPct, 0, 100);

  const total = Math.round((hit * 0.45) + (latScore * 0.25) + (unusedScore * 0.20) + (retScore * 0.10));
  // atualiza campo do server-score também
  document.getElementById('server-score').textContent = total;
  return total;
}
