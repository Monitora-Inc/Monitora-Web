function verificarPermissoesSideBar() {
    if (sessionStorage.listaPermissoes.indexOf('CadastrarFuncionario') === -1 && sessionStorage.listaPermissoes.indexOf('EditarCargoFuncionario') === -1
        && sessionStorage.listaPermissoes.indexOf('RemoverFuncionario') === -1) {
        let linkUsuarios = document.getElementById('linkUsuarios');
        linkUsuarios.style.display = 'none';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarServidor') === -1 && sessionStorage.listaPermissoes.indexOf('EditarServidor') === -1
        && sessionStorage.listaPermissoes.indexOf('ExcluirServidor') === -1) {
        let linkServidores = document.getElementById('linkServidores');
        linkServidores.style.display = 'none';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarDataCenter') === -1 && sessionStorage.listaPermissoes.indexOf('EditarDataCenter') === -1
        && sessionStorage.listaPermissoes.indexOf('ExcluirDataCenter') === -1) {
        let linkDataCenters = document.getElementById('linkDataCenters');
        linkDataCenters.style.display = 'none';
    }

    if (sessionStorage.listaPermissoes.indexOf('AdicionarCargos') === -1 && sessionStorage.listaPermissoes.indexOf('ModificarCargos') === -1
        && sessionStorage.listaPermissoes.indexOf('DeletarCargos') === -1) {
        let linkCargos = document.getElementById('linkCargos');
        linkCargos.style.display = 'none';
    }
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        verificarPermissoesSideBar,
        verificarPermissao
    };
} 