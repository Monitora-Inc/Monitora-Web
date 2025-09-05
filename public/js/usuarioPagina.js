carregarUsuarios();

async function carregarUsuarios() {
    let idEmpresa = sessionStorage.ID_EMPRESA;

    let respostaUsuarios = await fetch(`/usuarios/buscarUsuarios/${idEmpresa}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!respostaUsuarios.ok) {
        respostaUsuarios.text().then((texto) => {
            console.error(texto);
        })
    }

    let jsonUsuarios = await respostaUsuarios.json();

    totalUsuarios.innerHTML = `${jsonUsuarios.length}`;
}