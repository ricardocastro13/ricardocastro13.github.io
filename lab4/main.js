let contador = 0;


function saudar() {
  alert("Olaa!");
}

function mudarTexto() {
  const titulo = document.querySelector("#titulo");
  if (titulo.textContent === "Olá!") {
    titulo.textContent = "xau!";
    titulo.style.color = "green";
  } else {
    titulo.textContent = "Olá!";
    titulo.style.color = "black";
  }
}


function mudarCor() {
  document.body.style.backgroundColor = "lightblue";
}


function destacar() {
  const msg = document.querySelector("#mensagem");
  msg.textContent = "Estás com o rato sobre o botão!";
}


function retirarDestaque() {
  const msg = document.querySelector("#mensagem");
  msg.textContent = "O rato saiu do botão";
}


function contar() {
  contador++;
  const texto = document.querySelector("#contador");
  texto.textContent = "Contador: " + contador;
}