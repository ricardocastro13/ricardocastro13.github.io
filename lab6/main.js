import { produtos } from "./produtos.js";
import { produtos as produtos2 } from "./produtos2.js";

const listaProdutos = document.getElementById("lista-produtos");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalElement = document.getElementById("total");

let carrinho = [];


const todosProdutos = [...produtos, ...produtos2];


function mostrarProdutos() {
  listaProdutos.innerHTML = "";
  todosProdutos.forEach((p) => {
    const artigo = document.createElement("article");
    artigo.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.category}</p>
      <p><strong>€${p.price.toFixed(2)}</strong></p>
      <button>Adicionar ao Carrinho</button>
    `;
    artigo.querySelector("button").addEventListener("click", () => adicionarAoCarrinho(p));
    listaProdutos.appendChild(artigo);
  });
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
  let total = 0;

  carrinho.forEach((p, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      ${p.title} - €${p.price.toFixed(2)}
      <button>❌</button>
    `;
    item.querySelector("button").addEventListener("click", () => removerDoCarrinho(index));
    listaCarrinho.appendChild(item);
    total += p.price;
  });

  totalElement.textContent = `Total: €${total.toFixed(2)}`;
}

mostrarProdutos();