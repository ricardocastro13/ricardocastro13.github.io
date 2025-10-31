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
  listaProdutos.innerHTML = "";
  for (var i = 0; i < todosProdutos.length; i++) {
    var p = todosProdutos[i];
    var artigo = document.createElement("article");
    artigo.innerHTML = 
      "<img src='" + p.image + "' alt='" + p.title + "'>" +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.category + "</p>" +
      "<p><strong>€" + p.price.toFixed(2) + "</strong></p>" +
      "<button>Adicionar ao Carrinho</button>";
    
    (function(index) {
      artigo.querySelector("button").addEventListener("click", function() {
        adicionarAoCarrinho(todosProdutos[index]);
      });
    })(i);

    listaProdutos.appendChild(artigo);
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
  listaCarrinho.innerHTML = "";
  var total = 0;

  for (var i = 0; i < carrinho.length; i++) {
    var p = carrinho[i];
    var artigo = document.createElement("article");
    artigo.innerHTML = 
      "<img src='" + p.image + "' alt='" + p.title + "'>" +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.category + "</p>" +
      "<p><strong>€" + p.price.toFixed(2) + "</strong></p>" +
      "<button>❌ Remover</button>";

    (function(index) {
      artigo.querySelector("button").addEventListener("click", function() {
        removerDoCarrinho(index);
      });
    })(i);

    listaCarrinho.appendChild(artigo);
    total += p.price;
  }

  totalElement.textContent = "Total: €" + total.toFixed(2);

  if (carrinho.length > 0) {
    carrinhoContainer.style.backgroundColor = "#d0f0fd";
  } else {
    carrinhoContainer.style.backgroundColor = "transparent";
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