let contador = 0;

// Mostra um alerta
function saudar() {
  alert("Olá!");
}

// Muda o texto do h1
function mudarTexto() {
  const titulo = document.querySelector("#titulo");
  if (titulo.textContent === "Olá!") {
    titulo.textContent = "Adeus!";
    titulo.style.color = "green";
  } else {
    titulo.textContent = "Olá!";
    titulo.style.color = "black";
  }
}

// Muda a cor de fundo
function mudarCor() {
  document.body.style.backgroundColor = "lightblue";
}

// Quando o rato passa por cima
function destacar() {
  const msg = document.querySelector("#mensagem");
  msg.textContent = "Estás com o rato sobre o botão!";
}

// Quando o rato sai
function retirarDestaque() {
  const msg = document.querySelector("#mensagem");
  msg.textContent = "O rato saiu do botão.";
}

// Contador simples
function contar() {
  contador++;
  const texto = document.querySelector("#contador");
  texto.textContent = "Contador: " + contador;
}