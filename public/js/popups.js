/*
  /$$$$$$  /$$           /$$                 /$$
 /$$__  $$| $$          | $$                | $$
| $$  \__/| $$  /$$$$$$ | $$$$$$$   /$$$$$$ | $$
| $$ /$$$$| $$ /$$__  $$| $$__  $$ |____  $$| $$
| $$|_  $$| $$| $$  \ $$| $$  \ $$  /$$$$$$$| $$
| $$  \ $$| $$| $$  | $$| $$  | $$ /$$__  $$| $$
|  $$$$$$/| $$|  $$$$$$/| $$$$$$$/|  $$$$$$$| $$
 \______/ |__/ \______/ |_______/  \_______/|__/
*/

function popup_sair() {
    popup_screen.innerHTML = `        
        <div class="popup_container">
            <div class="popup">
                <h1>Deseja Sair?</h1>
                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="sair()">Sim</button>
                    <button onclick="fechar_popup()">Não</button>
                </div>
            </div>
        </div>`;
}

function popup_deletar(usuario_id) {
    popup_screen.innerHTML = `        
        <div class="popup_container">
            <div class="popup">
                <h1>Deseja deletar esse usuário?</h1>
                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="deletar_usuario(${usuario_id})">Sim</button>
                    <button onclick="fechar_popup()">Não</button>
                </div>
            </div>
        </div>`;
}

function fechar_popup() {
    popup_screen.innerHTML = ``;
}

function sair() {
    fechar_popup();
    sessionStorage.clear();
    window.location = "index.html";
}

/*
 /$$$$$$$$        /$$                       /$$                 /$$$$$$$                      /$$$$$$  /$$ /$$
|__  $$__/       | $$                      | $$                | $$__  $$                    /$$__  $$|__/| $$
   | $$  /$$$$$$ | $$  /$$$$$$         /$$$$$$$  /$$$$$$       | $$  \ $$ /$$$$$$   /$$$$$$ | $$  \__/ /$$| $$
   | $$ /$$__  $$| $$ |____  $$       /$$__  $$ /$$__  $$      | $$$$$$$//$$__  $$ /$$__  $$| $$$$    | $$| $$
   | $$| $$$$$$$$| $$  /$$$$$$$      | $$  | $$| $$$$$$$$      | $$____/| $$$$$$$$| $$  \__/| $$_/    | $$| $$
   | $$| $$_____/| $$ /$$__  $$      | $$  | $$| $$_____/      | $$     | $$_____/| $$      | $$      | $$| $$
   | $$|  $$$$$$$| $$|  $$$$$$$      |  $$$$$$$|  $$$$$$$      | $$     |  $$$$$$$| $$      | $$      | $$| $$
   |__/ \_______/|__/ \_______/       \_______/ \_______/      |__/      \_______/|__/      |__/      |__/|__/
*/

function popup_confirmar_senha() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
        <div class="popup">
            <h1>Confirmar senha</h1>
            <div class="inputs">
                <!-- Senha -->
                <div class="input-label-wrapper">
                <span class="input-label">Senha</span>
                </div>
                <input type="password" id="ipt_senha" placeholder="Digite sua senha" required>
            </div>

            <!-- Mensagem de Erro -->
            <div id="mensagem_erro"></div>

            <!-- Botões -->
            <div class="btns_popup">
                <button onclick="popup_editar_informacoes()">Confirmar</button>
                <button onclick="fechar_popup()">Cancelar</button>
            </div>
        </div>
    </div>`;
}

function popup_editar_informacoes() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
            <div class="popup">
                <h1>Editar Informações</h1>
                <div class="inputs">
                    
                    <!-- Nome -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Nome</span>                    </div>
                    <input type="text" id="ipt_nome" placeholder="Digite o nome do funcionário" required>
                    
                    <!-- Sobrenome -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Sobrenome</span>                    </div>
                    <input type="text" id="ipt_sobrenome" placeholder="Digite o sobrenome" required>
                    
                    <!-- Email -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Email</span>                    
                    </div>
                    <input type="email" id="ipt_email" placeholder="exemplo@empresa.com" required>
                     
                    <!-- Celular -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Celular</span>
                    </div>
                    <input type="tel" id="ipt_telefone" placeholder="(11) 99999-9999" required>


                    <!-- Senha -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Nova senha</span>
                    </div>
                    <input type="password" id="ipt_senha" placeholder="Mínimo 8 caracteres com letras e números" required>
                    
                    <!-- Confirmar senha -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Confirmar nova senha</span>
                    </div>
                    <input type="password" id="ipt_confirmar_senha" placeholder="Digite a senha novamente" required>
                </div>

                <!-- Mensagem de Erro -->
                <div id="mensagem_erro"></div>

                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="funcao_adicionar()">Confirmar</button>
                    <button onclick="fechar_popup()">Cancelar</button>
                </div>
            </div>
        </div>`;
}

function popup_editar_foto() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
            <div class="popup">
                <h1>Alterar Foto</h1>
                <div class="inputs">
                    
                    <!-- Nome -->
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
                </div>

                <!-- Mensagem de Erro -->
                <div id="mensagem_erro"></div>

                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="funcao_adicionar()">Confirmar</button>
                    <button onclick="fechar_popup()">Cancelar</button>
                </div>
            </div>
        </div>`;
}

/* 
 /$$$$$$$$        /$$                       /$$                  /$$$$$$                                 /$$       /$$                                        
|__  $$__/       | $$                      | $$                 /$$__  $$                               |__/      | $$                                        
   | $$  /$$$$$$ | $$  /$$$$$$         /$$$$$$$  /$$$$$$       | $$  \__/  /$$$$$$   /$$$$$$  /$$    /$$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
   | $$ /$$__  $$| $$ |____  $$       /$$__  $$ /$$__  $$      |  $$$$$$  /$$__  $$ /$$__  $$|  $$  /$$/| $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$_____/
   | $$| $$$$$$$$| $$  /$$$$$$$      | $$  | $$| $$$$$$$$       \____  $$| $$$$$$$$| $$  \__/ \  $$/$$/ | $$| $$  | $$| $$  \ $$| $$  \__/| $$$$$$$$|  $$$$$$ 
   | $$| $$_____/| $$ /$$__  $$      | $$  | $$| $$_____/       /$$  \ $$| $$_____/| $$        \  $$$/  | $$| $$  | $$| $$  | $$| $$      | $$_____/ \____  $$
   | $$|  $$$$$$$| $$|  $$$$$$$      |  $$$$$$$|  $$$$$$$      |  $$$$$$/|  $$$$$$$| $$         \  $/   | $$|  $$$$$$$|  $$$$$$/| $$      |  $$$$$$$ /$$$$$$$/
   |__/ \_______/|__/ \_______/       \_______/ \_______/       \______/  \_______/|__/          \_/    |__/ \_______/ \______/ |__/       \_______/|_______/ 
                                                                                                                                                                                                                                                                                                  
*/

function popup_adicionar_servidor() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
            <div class="popup">
                <h1>Adicionar Servidor</h1>
                <h2>Instruções</h2>
                <div class="instrucoes">
                    <li>Verifique se o Java está instalado com <i>java --version</i></li>
                        <p style="padding-left: 2em;">1.1. Caso não esteja, <a href="https://www.oracle.com/java/technologies/downloads/">faça o download.</a></p>
                    </li>
                    <li>Faça o download de nosso software clicando abaixo.</li>
                    <li>Faça a extração do arquivo se necessário.</li>
                    <li>No terminal, no diretório, rode: <i>java -jar execSoftware.jar</i></li>
                    <li>Siga as instruções indicadas no software.</li>
                </div>

                <!-- Mensagem de Erro -->
                <div id="mensagem_erro"></div>

                <!-- Botões -->
                <div class="btns_popup">
                    <a href="./softwareDonwload/execSoftware.jar" download><button onclick="funcao_adicionar()">Download Software</button></a>
                    <button onclick="fechar_popup()">Fechar</button>
                </div>
            </div>
        </div>`;
}

function popup_servidor_informacoes() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
            <div class="popup_servidor_informacoes">

            <input type="text" id="servidor_nome" placeholder="Digite o nome do servidor" value="Servidor 1">
                    <span class="servidor_label">UUID:</span>
                    <div id="servidor_uuid">fxvd1vcx23f323543</div>

                    <span class="servidor_label">Sistema Operacional:</span>
                    <div id="servidor_sistema_operacional">Windows 10 Pro</div>

                    <span class="servidor_label">Data Center:</span>
                    <div id="servidor_datacenter">
                    <select id="id_filter" onchange="" disabled>
                        <option value="" selected>Data Center 1</option>
                        <option value="" >Data Center 2</option>
                    </select>
                    </div>
                    <span class="servidor_label">Localização:</span>
                    <div id="servidor_datacenter">Rua Haddock Lobo, 595 - Cerqueira César, São Paulo - SP, Brasil</div>

                    <!-- Parametrização -->
                    <div class="servidor_parametrizacao">
                        <h1>CPU</h1>
                        <h2>% de uso para notificações de estado de alerta</h2>
                        <input type="number">
                        <h2>% de uso para notificações de estado critíco</h2>
                        <input type="number">
                        <h1>RAM</h1>
                        <h2>% de uso para notificações de estado de alerta</h2>
                        <input type="number">
                        <h2>% de uso para notificações de estado critíco</h2>
                        <input type="number">
                        <h1>Disco</h1>
                        <h2>% de uso para notificações de estado de alerta</h2>
                        <input type="number">
                        <h2>% de uso para notificações de estado critíco</h2>
                        <input type="number">
                        <h1>Rede</h1>
                        <h2>Valor de ms para notificações de estado de alerta</h2>
                        <input type="number">
                        <h2>Valor de ms para notificações de estado critíco</h2>
                        <input type="number">
                    </div>

                <!-- Mensagem de Erro -->
                <div id="mensagem_erro"></div>
        

                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="fechar_popup()">Fechar</button>
                </div>
            </div>
        </div>`;
}

/*
 /$$$$$$$$        /$$                       /$$                 /$$   /$$                                         /$$                    
|__  $$__/       | $$                      | $$                | $$  | $$                                        |__/                    
   | $$  /$$$$$$ | $$  /$$$$$$         /$$$$$$$  /$$$$$$       | $$  | $$  /$$$$$$$ /$$   /$$  /$$$$$$   /$$$$$$  /$$  /$$$$$$   /$$$$$$$
   | $$ /$$__  $$| $$ |____  $$       /$$__  $$ /$$__  $$      | $$  | $$ /$$_____/| $$  | $$ |____  $$ /$$__  $$| $$ /$$__  $$ /$$_____/
   | $$| $$$$$$$$| $$  /$$$$$$$      | $$  | $$| $$$$$$$$      | $$  | $$|  $$$$$$ | $$  | $$  /$$$$$$$| $$  \__/| $$| $$  \ $$|  $$$$$$ 
   | $$| $$_____/| $$ /$$__  $$      | $$  | $$| $$_____/      | $$  | $$ \____  $$| $$  | $$ /$$__  $$| $$      | $$| $$  | $$ \____  $$
   | $$|  $$$$$$$| $$|  $$$$$$$      |  $$$$$$$|  $$$$$$$      |  $$$$$$/ /$$$$$$$/|  $$$$$$/|  $$$$$$$| $$      | $$|  $$$$$$/ /$$$$$$$/
   |__/ \_______/|__/ \_______/       \_______/ \_______/       \______/ |_______/  \______/  \_______/|__/      |__/ \______/ |_______/                                                                                         
*/

function popup_cadastrar_usuario() {
    popup_screen.innerHTML = `        
    <div class="popup_container">
            <div class="popup">
                <h1>Adicionar Usuário</h1>
                <div class="inputs">
                    
                    <!-- Nome -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Nome</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="text" id="ipt_nome" placeholder="Digite o nome do funcionário" required>
                    
                    <!-- Sobrenome -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Sobrenome</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="text" id="ipt_sobrenome" placeholder="Digite o sobrenome" required>
                    
                    <!-- Cargo -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Cargo</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <select id="ipt_cargo">
                        <option value="" disabled selected>Selecione um cargo</option>
                    </select>
                    
                    <!-- Email -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Email</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="email" id="ipt_email" placeholder="exemplo@empresa.com" required>
                    
                    <!-- Senha -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Senha</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="password" id="ipt_senha" placeholder="Mínimo 8 caracteres com letras e números" required>
                    
                    <!-- Confirmar senha -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Confirmar senha</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="password" id="ipt_confirmar_senha" placeholder="Digite a senha novamente" required>
                    
                    <!-- Celular -->
                    <div class="input-label-wrapper">
                    <span class="input-label">Celular</span>
                    <span class="obrigatorio">*Obrigatório</span>
                    </div>
                    <input type="tel" id="ipt_telefone" placeholder="(11) 99999-9999" required>
                </div>

                <!-- Mensagem de Erro -->
                <div id="mensagem_erro"></div>

                <!-- Botões -->
                <div class="btns_popup">
                    <button onclick="funcao_adicionar()">Cadastrar</button>
                    <button onclick="fechar_popup()">Cancelar</button>
                </div>
            </div>
        </div>`;
    listarCargos();
}

function popup_usuario(usuario_card, usuario_id) {
    let foto = usuario_card.querySelector("#usuario_foto img").src;
    let nome = usuario_card.querySelector("#usuario_nome").innerText;
    let cargo = usuario_card.querySelector("#usuario_cargo").innerText;
    let email = usuario_card.querySelector("#usuario_email").innerText;
    let telefone = usuario_card.querySelector("#usuario_telefone").innerText;
    let dataCadastro = usuario_card.querySelector("#usuario_dataCadastro").innerText;

    console.log("Informações do usuário:" + foto, nome, cargo, email, telefone, dataCadastro);

    popup_screen.innerHTML = `        
    <div class="popup_container">
        <div class="popup">
            <img src="${foto}" alt="">
            <h1>${nome}</h1>
            <h2>Cargo:</h2>
            <select id="cargo_select" onchange="editar_cargo()">
                <option value="Administrador" ${cargo === "Administrador" ? "selected" : ""}>Administrador</option>
                <option value="Usuário" ${cargo === "Usuário" ? "selected" : ""}>Usuário</option>
            </select>
            <h2>Email:</h2>
            <h3>${email}</h3>
            <h2>Celular:</h2>
            <h3>${telefone}</h3>
            <h2>Data de cadastro:</h2>
            <h3>${dataCadastro}</h3>


            <!-- Mensagem de Erro -->
            <div id="mensagem_erro"></div>

            <!-- Botões -->
            <div class="btns_popup">
                <button onclick="popup_deletar(${usuario_id})">Deletar Usuário</button>
                <button onclick="fechar_popup()">Fechar</button>
            </div>
        </div>
    </div>`;
}

function editar_cargo(){
    
}

function deletar_usuario(usuario_id){
    fetch(`/usuarios/deletarUsuario/${usuario_id}`, {
        method: 'DELETE',
    }).then(function (response) {
        if (response.ok) {
            console.log(`Usuário ID ${usuario_id} deletado com sucesso!`);
            
            location.reload(); 
        } else {
            console.error(`Falha ao deletar o usuário ${usuario_id}. Status: ${response.status}`);
        }
    })
    .catch(function (error) {
        console.error("Erro de rede:", error);
    });
}

function listarCargos() {
    fetch(`/usuarios/listarCargos`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    }).then(function (dadosCargos) {
        console.log(dadosCargos);
        for (let i = 0; i < dadosCargos.length; i++) {
            ipt_cargo.innerHTML += `<option value="${dadosCargos[i].idCargo}">${dadosCargos[i].nome_cargo}</option>`;
        }
    })
}

