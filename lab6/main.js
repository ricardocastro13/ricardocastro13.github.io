


import { produtos } from "./produtos.js";
import { produtos as produtos2 } from "./produtos2.js";

var listaProdutos = document.getElementById("lista-produtos");
var listaCarrinho = document.getElementById("lista-carrinho");
var totalElement = document.getElementById("total");
var carrinhoContainer = document.getElementById("carrinho");

var secInicio = document.getElementById("inicio");
var secProdutos = document.getElementById("catalogo");

var linkInicio = document.querySelector("nav ul li a[href='#inicio']");
var linkProdutos = document.querySelector("nav ul li a[href='#catalogo']");
var linkCarrinho = document.querySelector("nav ul li a[href='#carrinho']");

var carrinho = [];
var todosProdutos = produtos.concat(produtos2);


function mostrarProdutos() {
  listaProdutos.innerHTML = ""

  for (let i = 0; i < todosProdutos.length; i++) {
    const p = todosProdutos[i]
    const artigo = document.createElement("article")

    artigo.innerHTML =
      "<img src='" + p.image + "' alt='" + p.title + "'>" +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.category + "</p>" +
      "<p><strong>€" + p.price.toFixed(2) + "</strong></p>" +
      "<button>Adicionar ao Carrinho</button>"

    artigo.querySelector("button").onclick = function () {
      adicionarAoCarrinho(todosProdutos[i])
    }

    listaProdutos.appendChild(artigo)
  }
}


function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
}


function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}


function atualizarCarrinho() {
  listaCarrinho.innerHTML = ""
  let total = 0

  for (let i = 0; i < carrinho.length; i++) {
    const p = carrinho[i]
    const artigo = document.createElement("article")

    artigo.innerHTML =
      "<img src='" + p.image + "' alt='" + p.title + "'>" +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.category + "</p>" +
      "<p><strong>€" + p.price.toFixed(2) + "</strong></p>" +
      "<button>❌ Remover</button>"

    artigo.querySelector("button").onclick = function () {
      removerDoCarrinho(i)
    }

    listaCarrinho.appendChild(artigo)
    total = total + p.price
  }

  totalElement.textContent = "Total: €" + total.toFixed(2)

  if (carrinho.length > 0) {
    carrinhoContainer.style.backgroundColor = "#d0f0fd"
  } else {
    carrinhoContainer.style.backgroundColor = "transparent"
  }
}

linkInicio.addEventListener("click", function(e) {
  e.preventDefault();
  secInicio.scrollIntoView({ behavior: "smooth" });
});

linkProdutos.addEventListener("click", function(e) {
  e.preventDefault();
  secProdutos.scrollIntoView({ behavior: "smooth" });
});

linkCarrinho.addEventListener("click", function(e) {
  e.preventDefault();
  carrinhoContainer.scrollIntoView({ behavior: "smooth" });
});


mostrarProdutos();