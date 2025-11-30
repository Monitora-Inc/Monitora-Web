# Guia de Teste Local - Dashboard Maria

## Pré-requisitos
- Node.js instalado
- Arquivo `.env.dev` configurado com credenciais AWS
- Dados no bucket `monitora-client`

## Passo 1: Inicie o servidor

```powershell
# Navegue até o diretório do projeto
cd c:\Users\dudam\OneDrive\Área de Trabalho\facul\p.i\Monitora-Inc\Monitora-Web

# Instale dependências (se necessário)
npm install

# Inicie o servidor
npm start
# ou
node app.js
```

Você verá a mensagem:
```
Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://localhost:3000
```

## Passo 2: Acesse a página

Abra seu navegador e vá para:
```
http://localhost:3000/pages/dashboards/Maria.html
```

## Passo 3: Configure o sessionStorage (importante!)

Como você está acessando localmente sem fazer login, precisa simular o sessionStorage:

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Execute os comandos abaixo:

```javascript
sessionStorage.empresaCnpj = "12345678000195";
sessionStorage.empresaId = "1";
```

## Passo 4: Recarregue a página

Pressione F5 ou execute na console:
```javascript
location.reload();
```

## Passo 5: Verifique os logs

Na aba Console do DevTools, você verá:

### ✅ Sucesso
```
Dados carregados: {
  trafego: Array(450),
  dadosPorHora: Array(9),
  mediaLatencia: "5.23",
  totalLinhas: 450,
  ...
}
Gráfico de tráfego renderizado com sucesso
Gráfico de pacotes renderizado com sucesso
```

### ❌ Erros comuns

**Erro 1: empresaId não definido**
```
#ERRO: empresaId não definido no sessionStorage
```
**Solução:** Execute novamente na console: `sessionStorage.empresaId = "1"`

**Erro 2: Nenhum arquivo encontrado**
```
#ERRO dadosServidores: Error: Nenhum dado encontrado nos últimos 9 CSVs
```
**Solução:** 
- Verifique se existem dados no bucket `monitora-client`
- Confirme que o path está correto: `empresaId/servidorId/trafegoRede/ano/mes/dia/`
- Teste manualmente no console:
  ```javascript
  await fetch('/bucket/read/1/1/trafegoRede/2025/11/29/0').then(r => r.json())
  ```

**Erro 3: Credenciais AWS inválidas**
```
Erro ao ler CSV: AccessDenied
```
**Solução:** Verifique `.env.dev`:
- `AWS_ACCESS_KEY` correto
- `AWS_SECRET_KEY` correto
- `AWS_SESSION_TOKEN` (se necessário)
- Permissões no bucket

## Passo 6: Teste manual da API

```javascript
// Na Console do navegador, execute:

// 1. Teste de conexão básica
await fetch('/bucket/read/1/1/trafegoRede/2025/11/29/0').then(r => r.json()).then(console.log)

// 2. Carregue os dados
await carregarDados()

// 3. Veja os dados globais carregados
console.log(dadosGlobal)

// 4. Teste a função de agrupamento
const testData = dadosGlobal.trafego.slice(0, 5);
console.log('Teste agrupamento:', agruparPorHora(testData))
```

## Passo 7: Inspecione os gráficos

- Abra o DevTools (F12)
- Aba Elements
- Procure pelos elementos:
  - `<div id="chart"></div>` - Gráfico de Tráfego
  - `<div id="graficoPacotes"></div>` - Gráfico de Pacotes

Se estiverem preenchidos com SVG, significa que os gráficos foram renderizados com sucesso.

## Troubleshooting

### Gráficos não aparecem
1. Verifique o console para erros
2. Confirme que ApexCharts está carregado: `typeof ApexCharts`
3. Confirme que os elementos HTML existem:
   ```javascript
   document.querySelector("#chart")
   document.querySelector("#graficoPacotes")
   ```

### Dados aparecem mas gráficos não
1. Verifique se `atualizarGraficos()` está sendo chamada
2. Confira se há dados em `dadosGlobal.dadosPorHora`
3. Teste manualmente:
   ```javascript
   atualizarGraficos(dadosGlobal)
   ```

### Performance lenta
- Pode ser normal na primeira carga (busca 9 CSVs)
- Abra Network (F12) para ver quanto tempo cada request leva
- Os CSVs podem ser grandes

## Próximos passos

Após confirmar que funciona localmente:

1. **Commit suas mudanças:**
   ```powershell
   git add .
   git commit -m "Integração de dados reais do bucket na dashboard Maria"
   git push origin Maria
   ```

2. **Deploy em produção:**
   - Confirme que `app.js` tem `var ambiente_processo = 'producao'`
   - Certifique-se que `.env` (produção) tem credenciais AWS corretas
   - Deploy

3. **Melhorias futuras:**
   - Cache de dados
   - Refresh automático a cada X minutos
   - Seleção de data/período customizado
   - Outros servidores (não apenas ID=1)
