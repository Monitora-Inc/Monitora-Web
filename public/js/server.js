carregarServidores();

async function carregarServidores() {
    let respostaServidores = await fetch(`/servidores/buscarServidores/${sessionStorage.ID_EMPRESA}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application-json'
        }
    });

    if(!respostaServidores.ok) {
        respostaServidores.text().then((texto) => {
            console.log(texto);
        });

        return;
    }

    let jsonServidores = await respostaServidores.json();

    totalServidores.innerHTML = jsonServidores.length;
}