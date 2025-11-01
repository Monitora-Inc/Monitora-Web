#!/bin/bash

cat <<'EOF'
--------------------------------------------------------

 __  __  ___  _   _ ___ _____ ___  ____      _
|  \/  |/ _ \| \ | |_ _|_   _/ _ \|  _ \    / \
| |\/| | | | |  \| || |  | || | | | |_) |  / _ \
| |  | | |_| | |\  || |  | || |_| |  _ <  / ___ \
|_|  |_|\___/|_| \_|___| |_| \___/|_| \_\/_/   \_\

--------------------------------------------------------

EOF

sistema_Linux() {
    echo "Verificando instalacao do Java..."
    
    if ! command -v java &> /dev/null; then
        echo "Java nao encontrado. Instalando Java 21..."
        sudo apt update
        sudo apt install -y openjdk-21-jdk
    else
        echo "Java ja esta instalado."
    fi

    echo "Verificando instalacao do Python..."
    if ! command -v python3 &> /dev/null; then
        echo "Python nao encontrado. Instalando Python 3.10..."
        sudo apt update
        sudo apt install -y python3 python3-pip
    else
        echo "Python ja esta instalado."
    fi

    echo
    echo "--------------------------------------------------------"
    echo "Iniciando execucao do servidor Java:"
    echo "--------------------------------------------------------"

    JAR_FILE=$(find . -maxdepth 1 -name "*.jar" -type f | head -n 1)
    
    if [ -z "$JAR_FILE" ]; then
        JAR_FILE=$(find . -name "*.jar" -type f | head -n 1)
    fi

    if [ -n "$JAR_FILE" ]; then
        echo "Executando $JAR_FILE..."
        java -jar "$JAR_FILE"
    else
        echo "Erro: Nenhum arquivo .jar encontrado na pasta."
        echo "Certifique-se de que o arquivo adicionarServidor.jar esta presente."
        exit 1
    fi

    echo
    echo "--------------------------------------------------------"
    echo "Servidor finalizado. Iniciando captura de dados (Python):"
    echo "--------------------------------------------------------"

    if [ ! -d "Monitora-Python" ]; then
        git clone https://github.com/Monitora-Inc/Monitora-Python.git
    fi

    cd Monitora-Python
    git pull
    python3 -m pip install --upgrade pip --user
    python3 -m pip install ping3 pandas psutil --user
    python3 new_script_captura.py
}

OS=$(uname -s)
echo "Sistema detectado: $OS"

if [[ "$OS" == "Linux" ]]; then
    sistema_Linux
elif [[ "$OS" == MINGW* || "$OS" == CYGWIN* || "$OS" == MSYS* ]]; then
    echo "Windows detectado. Use o script .bat."
else
    echo "Sistema nao suportado: $OS"
    exit 1
fi