let somar = 0
const mensagem = document.querySelector("#mensagem")
const contador = document.querySelector("#contador")

function saudar(){
  alert("ola")
}

function mudarTexto(){
  const titulo = document.querySelector("#titulo")

if(titulo.textContent === "Olá!"){

  titulo.textContent = "Xau!"
} else{
  titulo.textContent = "Olá!"
}
}

function mudarCor(){
  

  if(document.body.style.backgroundColor=== "red"){
    document.body.style.backgroundColor = "blue"
  } else{
    document.body.style.backgroundColor = "red"
  }
}


function destacar(){
  
  mensagem.textContent = "estas com o rato em cima "

}
function retirarDestaque(){

  mensagem.textContent = "saiste"

}

function contar(){

  somar = somar+1

  contador.textContent = "contador: "+ somar

}