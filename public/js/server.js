carregarServidores();
    
async function carregarServidores() {
    let respostaServidores = await fetch(`/servidores/buscarServidores/${sessionStorage.ID_EMPRESA}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
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

    jsonServidores.forEach(servidor => {
        cardsServers.innerHTML += `
            <div class="card-server">
                <div class="crud-buttons">
                    <img type="button" src="./Images/edit.svg">
                    <img type="button" src="./Images/delete.svg" id="delete-icon" data-bs-toggle="modal" data-bs-target="#deleteServerModal${servidor.uuid}">
                </div>
                <div class="title">
                    <h1>Servidor 1</h1>
                    <p>${servidor.uuid}</p>
                    <p>${servidor.sistemaOperacional}</p>
                </div>
                <div>
                    <h2>CPU</h2>
                    <p>${servidor.modeloCPU}</p>
                    <input type="range" class="form-range" id="range1">
                </div>
                <div>
                    <h2>Memória RAM</h2>
                    <p>${servidor.qtdRam}GB</p>
                    <input type="range" class="form-range" id="range1">
                </div>
            </div>
            <div class="modal fade" id="deleteServerModal${servidor.uuid}" tabindex="-1" aria-labelledby="addServerModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h5 class="modal-title" id="addServerModalLabel">Deletar servidor</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Fechar"></button>
                        </div>

                        <div class="modal-body">
                            <p>Você está prestes a deletar o Servidor 1. Esta ação é permanente e não pode ser desfeita.</p>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary deletar-server-btn" onclick="deletarServidor('${servidor.uuid}')">Deletar Servidor</button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    });
}

async function deletarServidor(uuid) {
    let respostaDeletarServidor = await fetch(`/servidores/excluirServidor/${uuid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!respostaDeletarServidor.ok) {
        respostaDeletarServidor.text().then((texto) => {
            console.log(texto);
        });

        return;
    }

    window.location.reload();
}

function trocarInstrucoes(id) {
    let idRemove = id == 'linux' ? 'windows' : 'linux';
    
    document.getElementById(id).classList.add('ativo');
    document.getElementById(`instrucoes-${id}`).classList.remove('hide');

    document.getElementById(idRemove).classList.remove('ativo'); 
    document.getElementById(`instrucoes-${idRemove}`).classList.add('hide');
}