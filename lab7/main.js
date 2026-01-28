const API_URL_PRODUTOS = "https://deisishop.pythonanywhere.com/products"
const API_URL_CATEGORIAS = "https://deisishop.pythonanywhere.com/categories"
const CHAVE_LS_CARRINHO = "produtos-no-carrinho"
const CHAVE_LS_PRODUTOS = "lista-de-produtos"

const selectCategoria = document.querySelector("#categoria")
const selectOrdenar = document.querySelector("#ordenar")
const inputPesquisa = document.querySelector("#pesquisa")
const listaProdutosElement = document.querySelector("#lista-produtos")
const listaCarrinhoElement = document.querySelector("#lista-carrinho")
const totalCarrinhoElement = document.querySelector("#total")
const btnComprar = document.querySelector("#buy")

document.addEventListener("DOMContentLoaded", function () {
  iniciar()
})

async function iniciar() {
  await carregarProdutosDaAPI()
  await carregarCategoriasDaAPI()
  atualizarCarrinho()
  configurarFiltros()
  configurarCheckout()
}

function salvarNoLocalStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

function lerDoLocalStorage(chave) {
  const dados = localStorage.getItem(chave)
  if (dados) return JSON.parse(dados)
  return []
}

async function carregarProdutosDaAPI() {
  try {
    const resposta = await fetch(API_URL_PRODUTOS)
    const produtos = await resposta.json()
    salvarNoLocalStorage(CHAVE_LS_PRODUTOS, produtos)
    mostrarProdutos(produtos)
  } catch (erro) {
    alert("Erro ao carregar produtos. Verifique a ligação.")
  }
}

async function carregarCategoriasDaAPI() {
  try {
    const resposta = await fetch(API_URL_CATEGORIAS)
    const categorias = await resposta.json()
    mostrarCategorias(categorias)
  } catch (erro) {}
}

function mostrarCategorias(categorias) {
  for (let i = 0; i < categorias.length; i++) {
    const opcao = document.createElement("option")
    opcao.value = categorias[i]
    opcao.textContent = categorias[i]
    selectCategoria.appendChild(opcao)
  }
}

function mostrarProdutos(produtos) {
  listaProdutosElement.innerHTML = ""

  for (let i = 0; i < produtos.length; i++) {
    const cardProduto = criarCardProduto(produtos[i])
    listaProdutosElement.appendChild(cardProduto)
  }
}

function criarCardProduto(produto) {
  const card = document.createElement("article")
  card.className = "produto-card"

  const h3 = document.createElement("h3")
  h3.textContent = produto.title

  const img = document.createElement("img")
  img.src = produto.image
  img.alt = produto.title

  const cat = document.createElement("p")
  cat.textContent = produto.category

  const preco = document.createElement("p")
  preco.textContent = "€" + Number(produto.price).toFixed(2)

  const desc = document.createElement("p")
  desc.textContent = produto.description

  const botao = document.createElement("button")
  botao.textContent = "+ Adicionar ao carrinho"
  botao.onclick = function () {
    adicionarProdutoAoCarrinho(produto)
    atualizarCarrinho()
  }

  card.appendChild(h3)
  card.appendChild(img)
  card.appendChild(cat)
  card.appendChild(preco)
  card.appendChild(desc)
  card.appendChild(botao)

  return card
}

function obterCarrinho() {
  return lerDoLocalStorage(CHAVE_LS_CARRINHO)
}

function adicionarProdutoAoCarrinho(produto) {
  const carrinho = obterCarrinho()
  carrinho.push(produto)
  salvarNoLocalStorage(CHAVE_LS_CARRINHO, carrinho)
}

function removerProdutoDoCarrinho(index) {
  const carrinho = obterCarrinho()
  carrinho.splice(index, 1)
  salvarNoLocalStorage(CHAVE_LS_CARRINHO, carrinho)
  atualizarCarrinho()
}

function atualizarCarrinho() {
  listaCarrinhoElement.innerHTML = ""
  const carrinho = obterCarrinho()
  let total = 0

  for (let i = 0; i < carrinho.length; i++) {
    const produto = carrinho[i]
    total = total + Number(produto.price)

    const card = document.createElement("article")

    const h4 = document.createElement("h4")
    h4.textContent = produto.title

    const p = document.createElement("p")
    p.textContent = "€" + Number(produto.price).toFixed(2)

    const botao = document.createElement("button")
    botao.textContent = "❌ Remover"
    botao.onclick = (function (idx) {
      return function () {
        removerProdutoDoCarrinho(idx)
      }
    })(i)

    card.appendChild(h4)
    card.appendChild(p)
    card.appendChild(botao)

    listaCarrinhoElement.appendChild(card)
  }

  totalCarrinhoElement.textContent = "Total: €" + total.toFixed(2)
}

function configurarFiltros() {
  selectCategoria.onchange = aplicarFiltros
  selectOrdenar.onchange = aplicarFiltros
  inputPesquisa.onkeyup = aplicarFiltros
}

function aplicarFiltros() {
  let produtos = lerDoLocalStorage(CHAVE_LS_PRODUTOS)

  produtos = filtrarPorCategoria(produtos, selectCategoria.value)
  produtos = filtrarPorTermo(produtos, inputPesquisa.value)
  produtos = ordenarProdutos(produtos, selectOrdenar.value)

  mostrarProdutos(produtos)
}

function filtrarPorCategoria(produtos, categoriaSelecionada) {
  if (categoriaSelecionada === "todos" || categoriaSelecionada === "") return produtos.slice()

  const filtrados = []
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].category === categoriaSelecionada) filtrados.push(produtos[i])
  }
  return filtrados
}

function filtrarPorTermo(produtos, termo) {
  const t = (termo || "").toLowerCase()
  if (t === "") return produtos

  const filtrados = []
  for (let i = 0; i < produtos.length; i++) {
    const titulo = String(produtos[i].title || "").toLowerCase()
    const desc = String(produtos[i].description || "").toLowerCase()

    if (titulo.includes(t) || desc.includes(t)) {
      filtrados.push(produtos[i])
    }
  }
  return filtrados
}

function ordenarProdutos(produtos, ordemSelecionada) {
  const listaOrdenada = produtos.slice()

  if (ordemSelecionada === "ascendente") {
    listaOrdenada.sort(function (a, b) {
      return Number(a.price) - Number(b.price)
    })
  }

  if (ordemSelecionada === "descendente") {
    listaOrdenada.sort(function (a, b) {
      return Number(b.price) - Number(a.price)
    })
  }

  return listaOrdenada
}

function configurarCheckout() {
  btnComprar.onclick = async function () {
    const carrinho = obterCarrinho()
    if (carrinho.length === 0) {
      alert("O carrinho está vazio!")
      return
    }

    const idsProdutos = []
    for (let i = 0; i < carrinho.length; i++) {
      idsProdutos.push(carrinho[i].id)
    }

    const studentEl = document.getElementById("student-check")
    const cupaoEl = document.getElementById("cupao")
    const nomeEl = document.getElementById("nome")

    const estudante = studentEl ? studentEl.checked : false
    const codigoCupao = cupaoEl ? cupaoEl.value.trim() : null
    const nomeCliente = nomeEl && nomeEl.value.trim() ? nomeEl.value.trim() : "Sem nome"

    const dadosCompra = {
      products: idsProdutos,
      student: estudante,
      coupon: codigoCupao,
      name: nomeCliente,
    }

    try {
      const resposta = await fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCompra),
      })

      const resultado = await resposta.json()

      localStorage.removeItem(CHAVE_LS_CARRINHO)
      atualizarCarrinho()

      alert(
        "Compra efetuada com sucesso!\nReferência: " +
          resultado.reference +
          "\nTotal: €" +
          resultado.totalCost
      )
    } catch (erro) {
      alert("Falha ao processar a compra.")
    }
  }
}