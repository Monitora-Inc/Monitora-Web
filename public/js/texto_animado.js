document.addEventListener('DOMContentLoaded', function() {
  const texto = "Monitore o desempenho dos seus servidores em tempo real, com simplicidade e segurança.";
  const elemento = document.querySelector('.text-base');
  let i = 0;
  elemento.textContent = "";
  function escrever() {
    if (i < texto.length) {
      elemento.textContent += texto.charAt(i);
      i++;
      setTimeout(escrever, 50);
    }
  }
  escrever();
});
