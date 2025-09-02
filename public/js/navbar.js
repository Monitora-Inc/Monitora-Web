if(!sessionStorage.EMAIL_USUARIO || !sessionStorage.ID_EMPRESA || !sessionStorage.ID_USUARIO || !sessionStorage.NOME_USUARIO) {
    window.location = "index.html";
}

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
                        <h3 role="button">Informações Gerais</h3>
                        <a href="servidores.html" class="link-underline link-underline-opacity-0"><h3 role="button">Configurar Servidores</h3></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h1>Configurações</h1>

`;

if(sessionStorage.ID_EMPRESA == 1) {
    navbar.innerHTML += `
        <div class="collapseSection">
            <div class="collapseTitulo" role="button" aria-expanded="false">
                <img src="../Images/empresaIcon.svg">
                <a href="empresas.html" class="link-underline link-underline-opacity-0"><h2>Empresas</h2></a>
            </div>
        </div>
    `;
}

navbar.innerHTML += `
    <div class="collapseSection">
        <div onclick="virarSeta(setaUsuarios)" class="collapseTitulo" data-bs-toggle="collapse" href="#collapseUsuarios" role="button" aria-expanded="false" aria-controls="collapseUsuarios">
            <img src="../Images/userIcon.svg">
            <h2>Usuários</h2>
            <img src="../Images/chevron_right.svg" class="setaBaixo" id="setaUsuarios">
        </div>
        <div class="collapse" id="collapseUsuarios">
            <div class="collapsePages">
                <a href="usuarios.html" class="link-underline link-underline-opacity-0"><h3 role="button">Usuários</h3></a>
                <a href="cargos.html" class="link-underline link-underline-opacity-0"><h3 role="button">Cargos</h3></a>
            </div>
        </div>
    </div>
    <div class="collapseSection logout" onclick="desconectar()">
        <div class="collapseTitulo" role="button" aria-expanded="false">
            <img src="../Images/logoutIcon.svg">
            <h2>Desconectar</h2>
        </div>
    </div>
`;

function virarSeta(idSeta) {
    if(idSeta.classList.contains('rotate-90')) {
        idSeta.classList.remove('rotate-90');
    } else {
        idSeta.classList.add('rotate-90')
    }
}

function desconectar() {
    sessionStorage.clear();

    window.location = "index.html";
}