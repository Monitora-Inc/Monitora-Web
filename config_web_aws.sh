#!/bin/bash
clear
echo "<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->"

echo "  ____ ___  _   _ _____ ___ ____      ___        ______   "
echo " / ___/ _ \| \ | |  ___|_ _/ ___|    / \ \      / / ___|  "
echo "| |  | | | |  \| | |_   | | |  _    / _ \ \ /\ / /\___ \  "
echo "| |__| |_| | |\  |  _|  | | |_| |  / ___ \ V  V /  ___) | "
echo " \____\___/|_| \_|_|   |___\____| /_/   \_\_/\_/  |____/  "

echo "<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->"

echo "Para descobrir suas credenciais de acesso, acesse o console da AWS na web e veja o arquivo '~/.aws/credentials'"
echo
echo "Digite o AWS Access Key ID:"
read accessKey

echo "Digite o AWS Secret Access Key:"
read secretKey

echo "Digite o token de sessão temporário (Session Token): "
read sessionToken

aws configure set aws_access_key_id "$accessKey"
aws configure set aws_secret_access_key "$secretKey"
aws configure set aws_session_token "$sessionToken"
aws configure set default.region "us-east-1"

echo "<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->"