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