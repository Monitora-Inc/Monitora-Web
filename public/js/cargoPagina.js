carregarCargos();

async function carregarCargos() {
    let fkEmpresa = sessionStorage.ID_EMPRESA;

    let respostaCargos = await fetch(`/cargos/buscarCargos/${fkEmpresa}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!respostaCargos.ok) {
        respostaCargos.text().then((texto) => {
            console.error(texto);
        });
    }

    let jsonCargos = await respostaCargos.json();

    totalCargos.innerHTML = `${jsonCargos.length}`;
}