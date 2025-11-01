var listaProdutos = document.getElementById("lista-produtos");
var listaCarrinho = document.getElementById("lista-carrinho");
var totalElement = document.getElementById("total");
var carrinhoContainer = document.getElementById("carrinho");

var secInicio = document.getElementById("inicio");
var secProdutos = document.getElementById("catalogo");

var linkInicio = document.querySelector("nav ul li a[href='#inicio']");
var linkProdutos = document.querySelector("nav ul li a[href='#catalogo']");
var linkCarrinho = document.querySelector("nav ul li a[href='#carrinho']");

var selectCategoria = document.getElementById("categoria");
var selectOrdenar = document.getElementById("ordenar");

var todosProdutos = [];
var carrinho = [];

// ===========================
//  Buscar produtos da API
// ===========================
async function carregarProdutosAPI() {
  try {
    const resposta = await fetch("https://deisishop.pythonanywhere.com/products");
    const dados = await resposta.json();
    todosProdutos = dados;

    // Preencher filtro de categorias dinamicamente
    preencherCategorias();

    mostrarProdutos();
  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);
    listaProdutos.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
  }
}

// ===========================
//  Preencher categorias dinâmicas
// ===========================
function preencherCategorias() {
  const categoriasUnicas = [...new Set(todosProdutos.map(p => p.category.toLowerCase()))];
  selectCategoria.innerHTML = '<option value="todos">Todos</option>';

  categoriasUnicas.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    selectCategoria.appendChild(option);
  });
}

// ===========================
//  Mostrar produtos filtrados e ordenados
// ===========================
function mostrarProdutos() {
  var categoria = selectCategoria.value;
  var ordenar = selectOrdenar.value;

  var filtrados = todosProdutos.slice();

  if (categoria !== "todos") {
    filtrados = filtrados.filter(p => p.category.toLowerCase() === categoria);
  }

  if (ordenar === "ascendente") {
    filtrados.sort((a, b) => a.price - b.price);
  } else if (ordenar === "descendente") {
    filtrados.sort((a, b) => b.price - a.price);
  }

  listaProdutos.innerHTML = "";
  for (var i = 0; i < filtrados.length; i++) {
    var p = filtrados[i];
    var artigo = document.createElement("article");
    artigo.innerHTML = 
      "<img src='" + p.image + "' alt='" + p.title + "'>" +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.category + "</p>" +
      "<p><strong>€" + p.price.toFixed(2) + "</strong></p>" +
      "<button>Adicionar ao Carrinho</button>";

    (function(index) {
      artigo.querySelector("button").addEventListener("click", function() {
        adicionarAoCarrinho(filtrados[index]);
      });
    })(i);

    listaProdutos.appendChild(artigo);
  }
}

// ===========================
//  Carrinho
// ===========================
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

  carrinhoContainer.style.backgroundColor = (carrinho.length > 0) ? "#d0f0fd" : "transparent";
}

// ===========================
//  Navegação suave
// ===========================
linkInicio.addEventListener("click", e => { e.preventDefault(); secInicio.scrollIntoView({ behavior: "smooth" }); });
linkProdutos.addEventListener("click", e => { e.preventDefault(); secProdutos.scrollIntoView({ behavior: "smooth" }); });
linkCarrinho.addEventListener("click", e => { e.preventDefault(); carrinhoContainer.scrollIntoView({ behavior: "smooth" }); });

// ===========================
//  Filtros
// ===========================
selectCategoria.addEventListener("change", mostrarProdutos);
selectOrdenar.addEventListener("change", mostrarProdutos);

// ===========================
//  Inicializar
// ===========================
carregarProdutosAPI();