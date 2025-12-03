function verificarPermissoesSideBar() {
    if (sessionStorage.listaPermissoes.indexOf('CadastrarFuncionario') === -1 && sessionStorage.listaPermissoes.indexOf('EditarCargoFuncionario') === -1
        && sessionStorage.listaPermissoes.indexOf('RemoverFuncionario') === -1) {
        let linkUsuarios = document.getElementById('linkUsuarios');
        linkUsuarios.style.display = 'none';
        if (window.location.pathname.endsWith('/pages/dashboards/usuarios.html')) {
            negarAcessoPagina();
        }
    } else {
        linkUsuarios.style.display = 'block';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarServidor') === -1 && sessionStorage.listaPermissoes.indexOf('EditarServidor') === -1
        && sessionStorage.listaPermissoes.indexOf('ExcluirServidor') === -1) {
        let linkServidores = document.getElementById('linkServidores');
        linkServidores.style.display = 'none';
        if (window.location.pathname.endsWith('/pages/dashboards/servidores.html')) {
            negarAcessoPagina();
        }
    } else {
        linkServidores.style.display = 'block';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarDataCenter') === -1 && sessionStorage.listaPermissoes.indexOf('EditarDataCenter') === -1
        && sessionStorage.listaPermissoes.indexOf('ExcluirDataCenter') === -1) {
        let linkDataCenters = document.getElementById('linkDataCenters');
        linkDataCenters.style.display = 'none';
        if (window.location.pathname.endsWith('/pages/dashboards/datacenters.html')) {
            negarAcessoPagina();
        }
    } else {
        linkDataCenters.style.display = 'block';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarCargos') === -1 && sessionStorage.listaPermissoes.indexOf('ModificarCargos') === -1
        && sessionStorage.listaPermissoes.indexOf('DeletarCargos') === -1) {
        let linkCargos = document.getElementById('linkCargos');
        linkCargos.style.display = 'none';
        if (window.location.pathname.endsWith('/pages/dashboards/tela_cargos.html')) {
            negarAcessoPagina();
        }
    } else {
        linkCargos.style.display = 'block';
    }
}

function negarAcessoPagina() {
    let page_content = document.querySelector('.page_content');
    if (page_content) {
        page_content.innerHTML = `
                <div class="pagina_permissao_negada">
                    <h1>Você não tem permissão para acessar essa página.</h1>
                    <button class="btns_popup" onclick="redirecionarPaginaInicial()">Voltar para página incial</button>
                </div>
                `
    }
}

function redirecionarPaginaInicial() {
    window.location.href = '/pages/dashboards/home.html';
}

function verificarPermissao(permissao) {
    if (sessionStorage.listaPermissoes.indexOf(permissao) === -1) {
        popup_screen.innerHTML = `        
        <div class="popup_container">
            <div class="popup">
                <h1>Permissão negada.</h1>

                <div id="mensagem_erro"></div>

                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="fechar_popup()">Fechar</button>
                </div>
            </div>
        </div>`;
        return false;
    } else {
        return true;
    }
}

function listarPermissoesReload() {
    if (sessionStorage.empresaCnpj == undefined && sessionStorage.empresaId != 1) {
        fetch(`/usuarios/listarPermissoes/${sessionStorage.cargoId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        }).then(function (dadosPermissoes) {
            listaPermissoes = [];
            for (var i = 0; i < dadosPermissoes.length; i++) {
                listaPermissoes.push(dadosPermissoes[i].nomePermissao)
            }
            sessionStorage.listaPermissoes = listaPermissoes;
            console.log(sessionStorage.listaPermissoes)
        }
        )
    }
}

    footerButons.innerHTML = `
        <a href="./home.html" class="tooltip"><span class="tooltip-text">Dahboard home.</span><img style="border-radius: 0 !important" src="../../Images/home.svg" alt=""></a>
        <a href="./Ally.html" class="tooltip"><span class="tooltip-text">Dashboard de mapeamento global.</span><img src="../../Images/Colaboradores/Colaborador1.svg" alt=""></a>
        <a href="./Leonardo.html" class="tooltip"><span class="tooltip-text">Dashboard de tickets do JIRA.</span><img src="../../Images/Colaboradores/Colaborador3.svg" alt=""></a>
        <a href="./Maria.html" class="tooltip"><span class="tooltip-text">Dashboard trafego de rede.</span><img src="../../Images/Colaboradores/Colaborador4.svg" alt=""></a>
    `

    footerButonsUnico.innerHTML = `
        <a href="./home.html" class="tooltip"><span class="tooltip-text">Dahboard home.</span><img style="border-radius: 0 !important" src="../../Images/home.svg" alt=""></a>
        <a href="./Pedro.html" class="tooltip"><span class="tooltip-text">Dashboard de mapeamento global.</span><img src="../../Images/Colaboradores/Colaborador1.svg" alt=""></a>
        <a href="./Gustavo.html" class="tooltip"><span class="tooltip-text">Dashboard de tickets do JIRA.</span><img src="../../Images/Colaboradores/Colaborador3.svg" alt=""></a>
    `

function preencherKpisServidoresAlertas() {

    fetch(`/servidores/contarServidores/${sessionStorage.empresaId}`,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        }).then(function (valorContagem) {
            let elementoHtml = document.getElementById("servidores_monitorados");
            elementoHtml.innerHTML = valorContagem[0].contagem;
        }
        );
    const fetchPromise = fetch("https://baiqze345xsjipst2bsfdm7wx40tsnni.lambda-url.us-east-1.on.aws/");

    fetchPromise
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let elementoCriticos = document.getElementById("qtdAlertasCriticos");
            let elementoAtencao = document.getElementById("qtdAlertasAtencao");
            elementoCriticos.insertAdjacentHTML('afterbegin', `${data.criticosAbertos}`);
            elementoAtencao.insertAdjacentHTML('afterbegin', `${data.atencaoAbertos}`);
        });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        verificarPermissoesSideBar,
        verificarPermissao,
        listarPermissoesReload,
        redirecionarPaginaInicial,
        preencherKpisServidoresAlertas
    };
} 