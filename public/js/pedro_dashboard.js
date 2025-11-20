const data = [
  { timestamp: '2025-10-26', cache_miss: 35, cache_hit: 52, lat: 0.025, requisicoes: 120,
    p50: 90,  p90: 130, p99: 180 },
  { timestamp: '2025-10-27', cache_miss: 42, cache_hit: 89, lat: 0.027, requisicoes: 125,
    p50: 110, p90: 145, p99: 190 },
  { timestamp: '2025-10-28', cache_miss: 65, cache_hit: 58, lat: 0.030, requisicoes: 129,
    p50: 105, p90: 140, p99: 185 },
  { timestamp: '2025-10-29', cache_miss: 50, cache_hit: 61, lat: 0.031, requisicoes: 133,
    p50: 100, p90: 135, p99: 175 },
  { timestamp: '2025-10-30', cache_miss: 2,  cache_hit: 60, lat: 0.032, requisicoes: 135,
    p50: 95,  p90: 138, p99: 178 },
  { timestamp: '2025-10-31', cache_miss: 45, cache_hit: 59, lat: 0.030, requisicoes: 134,
    p50: 97,  p90: 132, p99: 170 },
  { timestamp: '2025-11-01', cache_miss: 32, cache_hit: 59, lat: 0.030, requisicoes: 134,
    p50: 92,  p90: 128, p99: 165 }
];



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

    const graficoRequisicoes = (ctx, label, field, color) => {
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



    graficoCacheHitMiss(document.getElementById('graficoCacheMiss'), 'Cache Miss (%)', 'cache_miss', '#FF0267');
    graficoCacheHitMiss(document.getElementById('graficoCacheHit'), 'Cache Hit (%)', 'cache_hit', '#6DF8A4');
    graficoRequisicoes(document.getElementById('graficoRequisicoes'), 'Número de Requisições', 'requisicoes', '#8979FF');
    graficoLatenciaPercentis(document.getElementById('graficoPercentil'));
