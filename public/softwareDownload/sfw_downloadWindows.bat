@echo off
title Setup Monitora

cd /d "%~dp0"

echo Verificando instalacao do Java...

java -version >nul 2>&1
if errorlevel 1 (
    echo Java nao encontrado. Instalando Java 21...
    
    echo Tentando instalar Java 21 via winget...
    winget install -e --id Oracle.JavaRuntimeEnvironment.21 --silent --accept-package-agreements --accept-source-agreements
    
    if errorlevel 1 (
        echo Winget falhou. Baixando Java 21...
        powershell -Command "Invoke-WebRequest -Uri 'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe' -OutFile 'jdk-21-installer.exe'"
        if exist "jdk-21-installer.exe" (
            echo Executando instalador do Java 21...
            start /wait jdk-21-installer.exe /s
            timeout /t 10
            del "jdk-21-installer.exe"
        ) else (
            echo Erro: Nao foi possivel baixar o instalador do Java.
            echo Por favor, instale o Java 21 manualmente de: https://www.oracle.com/java/technologies/downloads/
            pause
            exit /b
        )
    )
)

java -version >nul 2>&1
if errorlevel 1 (
    echo Erro: Java nao foi instalado corretamente.
    echo Por favor, instale o Java 21 manualmente de: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b
)

echo Java instalado com sucesso!

python --version >nul 2>&1
if errorlevel 1 (
    echo Python nao encontrado. Instalando Python 3.10...
    winget install -e --id Python.Python.3.10 --silent --accept-package-agreements --accept-source-agreements
) else (
    echo Python ja esta instalado.
)

echo.
echo ------------------------------------------------------------------------------
echo Iniciando execucao do servidor Java:
echo ------------------------------------------------------------------------------

set "JAR_FILE="
for /f "delims=" %%a in ('dir /b *.jar 2^>nul') do set "JAR_FILE=%%a"

if not defined JAR_FILE (
    for /f "delims=" %%a in ('dir /b /s *.jar 2^>nul') do set "JAR_FILE=%%a"
)

if defined JAR_FILE (
    echo Executando %JAR_FILE%...
    java -jar "%JAR_FILE%"
) else (
    echo Erro: Nenhum arquivo .jar encontrado na pasta.
    echo Certifique-se de que o arquivo adicionarServidor.jar esta presente.
    pause
    exit /b 1
)

echo.
echo ------------------------------------------------------------------------------
echo Servidor finalizado. Iniciando captura de dados (Python):
echo ------------------------------------------------------------------------------

if not exist "Monitora-Python" (
    git clone https://github.com/Monitora-Inc/Monitora-Python.git
)

cd Monitora-Python
git pull
python -m pip install --upgrade pip
python -m pip install ping3 pandas psutil --user
python new_script_captura.py

pause