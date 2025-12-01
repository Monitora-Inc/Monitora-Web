const data = [
  { timestamp: '2025-10-26', cache_miss: 35, cache_hit: 52, lat: 0.025, requisicoes: 20,
    p50: 90,  p90: 130, p99: 180 },
  { timestamp: '2025-10-27', cache_miss: 42, cache_hit: 89, lat: 0.027, requisicoes: 295,
    p50: 110, p90: 145, p99: 190 },
  { timestamp: '2025-10-28', cache_miss: 65, cache_hit: 58, lat: 0.030, requisicoes: 210,
    p50: 105, p90: 140, p99: 185 },
  { timestamp: '2025-10-29', cache_miss: 50, cache_hit: 61, lat: 0.031, requisicoes: 240,
    p50: 100, p90: 135, p99: 175 },
  { timestamp: '2025-10-30', cache_miss: 2,  cache_hit: 60, lat: 0.032, requisicoes: 135,
    p50: 95,  p90: 138, p99: 178 },
  { timestamp: '2025-10-31', cache_miss: 45, cache_hit: 59, lat: 0.030, requisicoes: 180,
    p50: 97,  p90: 132, p99: 170 },
  { timestamp: '2025-11-01', cache_miss: 32, cache_hit: 59, lat: 0.030, requisicoes: 85,
    p50: 92,  p90: 128, p99: 165 }
];

let data_eventos = [
  {
    pos1: '18', pos2: '11', pos3: '10', pos4: '8', pos5: '6', 
  }
]

    const labels = data.map(d => d.timestamp);

    const limits = {
        cache_miss: { alert: 70, critical: 75 },
        cache_hit: { alert: 30, critical: 25 },
        lat: { alert: 0.03, critical: 0.05 },
    };


    const graficoCacheHitMiss = (ctx, label, field, color) => {

        const { alert, critical } = limits[field] || {};

        return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
            label,
            data: data.map(d => d[field]),
            borderColor: color,
            backgroundColor: color,
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: color,
            pointBorderColor: color,
            pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: { labels: { color: '#000000ff' } },
            annotation: {
                annotations: {
                ...(alert !== undefined && {
                    alertLine: {
                    type: 'line',
                    yMin: alert,
                    yMax: alert,
                    borderColor: 'rgba(255, 206, 86, 0.9)',
                    borderWidth: 2,
                    borderDash: [6, 6],
                    label: {
                        display: true,
                        content: 'Atenção',
                        backgroundColor: '#ffc917',
                        color: '#1e3d4a',
                        position: 'end',
                        yAdjust: 0
                    }
                    }
                }),
                ...(critical !== undefined && {
                    criticalLine: {
                    type: 'line',
                    yMin: critical,
                    yMax: critical,
                    borderColor: 'rgba(255, 99, 132, 0.9)',
                    borderWidth: 2,
                    borderDash: [6, 6],
                    label: {
                        display: true,
                        content: 'Crítico',
                        backgroundColor: '#ff3b3b',
                        color: '#fff',
                        position: 'start',
                        yAdjust: 0
                    }
                    }
                })
                }
            }
            },
            scales: {
            x: { ticks: { color: '#5c5c5cff' } },
            y: { ticks: { color: '#5c5c5cff' } }
            }
        }
        });
    };

    const graficosBarra = (ctx, label, field, color) => {
        return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label,
            data: data.map(d => d[field]),
            backgroundColor: color,
            borderRadius: { topLeft: 8, topRight: 8 }, 
            borderSkipped: false    
            }]
        }
        });
    };

    const graficoLatenciaPercentis = (ctx) => {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'p50',
            data: data.map(d => d.p50),
            borderColor: '#5A6CF3',
            backgroundColor: 'rgba(90,108,243,0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#5A6CF3'
          },
          {
            label: 'p90',
            data: data.map(d => d.p90),
            borderColor: '#54D5E4',
            backgroundColor: 'rgba(84,213,228,0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#54D5E4'
          },
          {
            label: 'p99',
            data: data.map(d => d.p99),
            borderColor: '#FF7AD9',
            backgroundColor: 'rgba(255,122,217,0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#FF7AD9'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#000000ff' } }
        },
        scales: {
          x: { ticks: { color: '#5c5c5cff' } },
          y: { ticks: { color: '#5c5c5cff' } }
        }
      }
    });
  };


const valores_eventos = [
  data_eventos[0].pos1,
  data_eventos[0].pos2,
  data_eventos[0].pos3,
  data_eventos[0].pos4,
  data_eventos[0].pos5
];

const graficoEventos = (ctx) => {

  const labels_eventos = ['Natal', 'Páscoa', 'Férias Escolares', 'Halloween', 'Dia dos Namorados'];

  const valores = data_eventos[0];

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels_eventos,
      datasets: [
        {
          label: 'Impacto:',
          data: [
            valores.pos1,
            valores.pos2,
            valores.pos3,
            valores.pos4,
            valores.pos5
          ],
          backgroundColor: [
            'rgba(255, 36, 36, 0.2)',
            'rgba(216, 97, 0, 0.2)',
            'rgba(255, 211, 91, 0.2)',
            'rgba(253, 255, 108, 0.2)',
            'rgba(255, 252, 100, 0.2)'
          ],
          borderColor: [
            '#f35a5aff',
            '#e47d54ff',
            '#ffc831ff',
            '#e8ff80ff',
            '#ffefd2ff'
          ],
          borderWidth: 4,
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
};


graficoCacheHitMiss(document.getElementById('graficoCacheMiss'), 'Cache Miss (%)', 'cache_miss', '#FF0267');
graficoCacheHitMiss(document.getElementById('graficoCacheHit'), 'Cache Hit (%)', 'cache_hit', '#6DF8A4');
graficosBarra(document.getElementById('graficoRequisicoes'), 'Número de Requisições', 'requisicoes', '#8979FF');
graficoEventos(document.getElementById('graficoEventos'));
graficoLatenciaPercentis(document.getElementById('graficoPercentil'));

