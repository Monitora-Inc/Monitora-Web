navbar.innerHTML = `
    <img src="../Images/Logo Maior - PNG.png" class="logo">
    <div>
        <h1>Navegação</h1>
        <div class="collapseSection">
            <div class="collapseTitulo" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                <img src="../Images/home.svg">
                <h2>Dashboards</h2>
                <img src="../Images/chevron_right.svg" class="setaBaixo">
            </div>
            <div class="collapse" id="collapseExample">
                <div class="collapsePages">
                    <h3>Estatísticas</h3>
                    <h3>Gráficos</h3>
                </div>
            </div>
        </div>
    </div>
`;