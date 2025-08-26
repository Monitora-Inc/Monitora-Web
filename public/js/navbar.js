navbar.innerHTML = `
    <img src="../Images/Logo Maior - PNG.png" class="logo">
    <div class="categoriaSection">
        <h1>Navegação</h1>
        <div class="collapseOptions">
            <div class="collapseSection">
                <div onclick="virarSeta(setaDashboard)" class="collapseTitulo" data-bs-toggle="collapse" href="#collapseDashboards" role="button" aria-expanded="false" aria-controls="collapseDashboards">
                    <img src="../Images/home.svg">
                    <h2>Dashboards</h2>
                    <img src="../Images/chevron_right.svg" class="setaBaixo" id="setaDashboard">
                </div>
                <div class="collapse" id="collapseDashboards">
                    <div class="collapsePages">
                        <a href="dashboard.html" class="link-underline link-underline-opacity-0"><h3 role="button">Estatísticas</h3></a>
                        <h3 role="button">Gráficos</h3>
                    </div>
                </div>
            </div>
            <div class="collapseSection">
                <div onclick="virarSeta(setaServers)" class="collapseTitulo" data-bs-toggle="collapse" href="#collapseServers" role="button" aria-expanded="false" aria-controls="collapseServers">
                    <img src="../Images/serverIcon.svg">
                    <h2>Servidores</h2>
                    <img src="../Images/chevron_right.svg" class="setaBaixo" id="setaServers">
                </div>
                <div class="collapse" id="collapseServers">
                    <div class="collapsePages">
                        <h3 role="button">Configurações</h3>
                        <a href="servidores.html" class="link-underline link-underline-opacity-0"><h3 role="button">Adicionar Servidor</h3></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h1>Configurações</h1>

`;

function virarSeta(idSeta) {
    if(idSeta.classList.contains('rotate-90')) {
        idSeta.classList.remove('rotate-90');
    } else {
        idSeta.classList.add('rotate-90')
    }
}