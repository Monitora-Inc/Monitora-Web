// Verifica se o usuário deslogou. Se sim, o desconecta automaticamente.

// Fecha popups ao navegar entre as seções
function fechar_popups() {
      popup_screen.innerHTML = ``;
}

/*
  /$$$$$$  /$$       /$$           /$$                          
 /$$__  $$|__/      | $$          | $$                          
| $$  \__/ /$$  /$$$$$$$  /$$$$$$ | $$$$$$$   /$$$$$$   /$$$$$$ 
|  $$$$$$ | $$ /$$__  $$ /$$__  $$| $$__  $$ |____  $$ /$$__  $$
 \____  $$| $$| $$  | $$| $$$$$$$$| $$  \ $$  /$$$$$$$| $$  \__/
 /$$  \ $$| $$| $$  | $$| $$_____/| $$  | $$ /$$__  $$| $$      
|  $$$$$$/| $$|  $$$$$$$|  $$$$$$$| $$$$$$$/|  $$$$$$$| $$      
 \______/ |__/ \_______/ \_______/|_______/  \_______/|__/      
*/

if (sessionStorage.empresaNome === "admin" && sessionStorage.fotoUser == null) {
      id_sidebar.innerHTML = `    
            <div class="icones_navbar icones_navbar_superiores">
                  <a href="./perfil.html" class="tooltipNav" onclick="fechar_popups()">
                        <div id="perfil_foto">
                              <img src="../../assets/fotosPerfil/${sessionStorage.empresaFoto}" alt="">
                        </div>
                        <span class="tooltiptextNav">Perfil</span>
                  </a>
                  <a href="./usuarios.html" class="tooltipNav icone_usuarios" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Usuários</span>
                  </a>
                  <a href="" class="tooltipNav icone_configuracoes" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Configurações</span>
                  </a>
                  <a href="" class="tooltipNav icone_suporte">
                        <span class="tooltiptextNav">Suporte</span>
                  </a>
                  <a class="tooltipNav icone_sair" onclick="popup_sair()">
                        <span class="tooltiptextNav">Sair</span>
                  </a>
            </div>
            <div class="icones_navbar icones_navbar_inferiores" onclick="fechar_popups()">
                  <div class="logo"></div>
            </div>`;

} else if (sessionStorage.empresaNome === "admin" && sessionStorage.fotoUser != null) {
      id_sidebar.innerHTML = `    
            <div class="icones_navbar icones_navbar_superiores">
                  <a href="./perfil.html" class="tooltipNav" onclick="fechar_popups()">
                        <div id="perfil_foto">
                              <img src="../../assets/fotosPerfil/${sessionStorage.fotoUser}" alt="">
                        </div>
                        <span class="tooltiptextNav">Perfil</span>
                  </a>
                  <a href="./usuarios.html" class="tooltipNav icone_usuarios" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Usuários</span>
                  </a>
                  <a href="" class="tooltipNav icone_configuracoes" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Configurações</span>
                  </a>
                  <a href="" class="tooltipNav icone_suporte">
                        <span class="tooltiptextNav">Suporte</span>
                  </a>
                  <a class="tooltipNav icone_sair" onclick="popup_sair()">
                        <span class="tooltiptextNav">Sair</span>
                  </a>
            </div>
            <div class="icones_navbar icones_navbar_inferiores" onclick="fechar_popups()">
                  <div class="logo"></div>
            </div>`;
} else if (sessionStorage.userNome == null) {
      id_sidebar.innerHTML = `
            <div class="icones_navbar icones_navbar_superiores" >
                  <a href="./perfil.html" class="tooltipNav" onclick="fechar_popups()">
                        <div id="perfil_foto"><img src="../../assets/fotosPerfil/${sessionStorage.empresaFoto}" alt=""></div>
                        <span class="tooltiptextNav">Perfil</span>
                  </a>
                  <a href="./home.html" class="tooltipNav icone_dashboard" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Dashboard</span>
                  </a>
                  <a href="./servidores.html" class="tooltipNav icone_servidores" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Servidores</span>
                  </a>
                  <a href="./datacenters.html" class="tooltipNav icone_datacenters" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Data Centers</span>
                  </a>
                  <a href="" class="tooltipNav icone_logs" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Logs</span>
                  </a>
                  <a href="./usuarios.html" class="tooltipNav icone_usuarios" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Usuários</span>
                  </a>
                  <a href="" class="tooltipNav icone_configuracoes" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Configurações</span>
                  </a>
                  <a href="./tela_cargos.html" class="tooltipNav icone_cargos" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Cargos</span>
                  </a>
                  <a href="" class="tooltipNav icone_suporte">
                        <span class="tooltiptextNav">Suporte</span>
                  </a>
                  <a class="tooltipNav icone_sair" onclick="popup_sair()">
                        <span class="tooltiptextNav">Sair</span>
                  </a>
            </div>
            <div class="icones_navbar icones_navbar_inferiores" onclick="fechar_popups()">
                  <div class="logo"></div>
            </div>`;
} else {
      id_sidebar.innerHTML = `
            <div class="icones_navbar icones_navbar_superiores" >
                  <a href="./perfil.html" class="tooltipNav" onclick="fechar_popups()">
                        <div id="perfil_foto"><img src="../../assets/fotosPerfil/${sessionStorage.fotoUser}" alt=""></div>
                        <span class="tooltiptextNav">Perfil</span>
                  </a>
                  <a href="./home.html" class="tooltipNav icone_dashboard" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Dashboard</span>
                  </a>
                  <a href="./servidores.html" class="tooltipNav icone_servidores" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Servidores</span>
                  </a>
                  <a href="./datacenters.html" class="tooltipNav icone_datacenters" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Data Centers</span>
                  </a>
                  <a href="" class="tooltipNav icone_logs" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Logs</span>
                  </a>
                  <a href="./usuarios.html" class="tooltipNav icone_usuarios" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Usuários</span>
                  </a>
                  <a href="" class="tooltipNav icone_configuracoes" onclick="fechar_popups()">
                        <span class="tooltiptextNav"">Configurações</span>
                  </a>
                  <a href="./tela_cargos.html" class="tooltipNav icone_cargos" onclick="fechar_popups()">
                        <span class="tooltiptextNav">Cargos</span>
                  </a>
                  <a href="" class="tooltipNav icone_suporte">
                        <span class="tooltiptextNav">Suporte</span>
                  </a>
                  <a class="tooltipNav icone_sair" onclick="popup_sair()">
                        <span class="tooltiptextNav">Sair</span>
                  </a>
            </div>
            <div class="icones_navbar icones_navbar_inferiores" onclick="fechar_popups()">
                  <div class="logo"></div>
            </div>`;
}

/*
 /$$   /$$ /$$$$$$$  /$$$$$$          
| $$  /$$/| $$__  $$|_  $$_/          
| $$ /$$/ | $$  \ $$  | $$    /$$$$$$$
| $$$$$/  | $$$$$$$/  | $$   /$$_____/
| $$  $$  | $$____/   | $$  |  $$$$$$ 
| $$\  $$ | $$        | $$   \____  $$
| $$ \  $$| $$       /$$$$$$ /$$$$$$$/
|__/  \__/|__/      |______/|_______/ 
*/

if (sessionStorage.empresaNome != "admin") {
      id_info_kpis.innerHTML = `    
            <div class="kpi_servidores tooltipKPI">
                  <img src="../../assets/icons/icone_servidores_info.svg" alt="">
                  <h1 id="servidores_monitorados" onclick="dashboard_servidores()">0</h1>
                  <span class="tooltiptextKPI">Servidores Monitorados</span>
                  </div>

                  <div class="kpi_servidores_status">
                  <img src="../../assets/icons/icone_sino_info.svg" alt="">
                  <h1 class="servidores_criticos tooltipKPI" onclick="dashboard_home()">0
                        <span class="tooltiptextKPI">Servidores em Risco</span>
                  </h1>
                  <h1 class="servidores_alertas tooltipKPI" onclick="dashboard_home()">0
                        <span class="tooltiptextKPI">Servidores em Alerta</span>
                  </h1>
            </div>`;

}
function dashboard_home() {
      fechar_popups();
      window.location = "home.html";
}

function dashboard_servidores() {
      fechar_popups();
      window.location = "servidores.html";
}