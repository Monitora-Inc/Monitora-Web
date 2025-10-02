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

function popup_confirmar_senha(){
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

function popup_adicionar_servidor(){
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
}

function popup_usuario(usuario_card, usuario_id)  {
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
            <img src="${foto}" alt="" onclick="popup_editar_foto()">
            <h1>${nome}</h1>
            <h2>Cargo:</h2>
            <h3>${cargo}</h3>
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
                <button onclick="fechar_popup()">Fechar</button>
            </div>
        </div>
    </div>`;
}

