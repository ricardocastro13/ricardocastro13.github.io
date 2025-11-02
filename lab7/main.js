// -----------------------
// CONSTANTES
// -----------------------
const API_URL_PRODUTOS = 'https://deisishop.pythonanywhere.com/products';
const API_URL_CATEGORIAS = 'https://deisishop.pythonanywhere.com/categories';
const CHAVE_LS_CARRINHO = 'produtos-no-carrinho';
const CHAVE_LS_PRODUTOS = 'lista-de-produtos';

// -----------------------
// SELECTORES DO DOM
// -----------------------
const selectCategoria = document.querySelector('#categoria');
const selectOrdenar = document.querySelector('#ordenar');
const inputPesquisa = document.querySelector('#pesquisa');
const listaProdutosElement = document.querySelector('#lista-produtos');
const listaCarrinhoElement = document.querySelector('#lista-carrinho');
const totalCarrinhoElement = document.querySelector('#total');
const btnComprar = document.querySelector('#buy');

// -----------------------
// INICIALIZAÇÃO
// -----------------------
document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosDaAPI();
    await carregarCategoriasDaAPI();
    atualizarCarrinho();
    configurarFiltros();
    configurarCheckout();
});

// -----------------------
// LOCAL STORAGE HELPERS
// -----------------------
function salvarNoLocalStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function lerDoLocalStorage(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
}

// -----------------------
// API
// -----------------------
async function carregarProdutosDaAPI() {
    try {
        const resposta = await fetch(API_URL_PRODUTOS);
        const produtos = await resposta.json();
        salvarNoLocalStorage(CHAVE_LS_PRODUTOS, produtos);
        mostrarProdutos(produtos);
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        alert("Erro ao carregar produtos. Verifique a ligação.");
    }
}

async function carregarCategoriasDaAPI() {
    try {
        const resposta = await fetch(API_URL_CATEGORIAS);
        const categorias = await resposta.json();
        mostrarCategorias(categorias);
    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}

// -----------------------
// RENDERIZAÇÃO
// -----------------------
function mostrarCategorias(categorias) {
    categorias.forEach(categoria => {
        const opcao = document.createElement('option');
        opcao.value = categoria;
        opcao.textContent = categoria;
        selectCategoria.append(opcao);
    });
}

function mostrarProdutos(produtos) {
    listaProdutosElement.innerHTML = "";
    produtos.forEach(produto => {
        const cardProduto = criarCardProduto(produto);
        listaProdutosElement.appendChild(cardProduto);
    });
}

function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.classList.add('produto-card');
    card.innerHTML = `
        <h3>${produto.title}</h3>
        <img src="${produto.image}" alt="${produto.title}">
        <p>${produto.category}</p>
        <p>€${produto.price}</p>
        <p>${produto.description}</p>
    `;
    card.appendChild(criarBotaoAdicionar(produto));
    return card;
}

function criarBotaoAdicionar(produto) {
    const botao = document.createElement('button');
    botao.textContent = "+ Adicionar ao carrinho";
    botao.addEventListener('click', () => {
        adicionarProdutoAoCarrinho(produto);
        atualizarCarrinho();
    });
    return botao;
}

function criarCardCarrinho(produto, index) {
    const card = document.createElement('article');
    card.innerHTML = `
        <h4>${produto.title}</h4>
        <p>€${produto.price}</p>
    `;
    card.appendChild(criarBotaoRemover(index));
    return card;
}

function criarBotaoRemover(index) {
    const botao = document.createElement('button');
    botao.textContent = "❌ Remover";
    botao.addEventListener('click', () => {
        removerProdutoDoCarrinho(index);
    });
    return botao;
}

// -----------------------
// CARRINHO
// -----------------------
function obterCarrinho() {
    return lerDoLocalStorage(CHAVE_LS_CARRINHO);
}

function adicionarProdutoAoCarrinho(produto) {
    const carrinho = obterCarrinho();
    carrinho.push(produto);
    salvarNoLocalStorage(CHAVE_LS_CARRINHO, carrinho);
}

function removerProdutoDoCarrinho(index) {
    const carrinho = obterCarrinho();
    carrinho.splice(index, 1);
    salvarNoLocalStorage(CHAVE_LS_CARRINHO, carrinho);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    listaCarrinhoElement.innerHTML = "";
    const carrinho = obterCarrinho();
    let total = 0;

    carrinho.forEach((produto, i) => {
        total += Number(produto.price);
        const card = criarCardCarrinho(produto, i);
        listaCarrinhoElement.appendChild(card);
    });

    totalCarrinhoElement.textContent = "Total: €" + total.toFixed(2);
}

// -----------------------
// FILTROS
// -----------------------
function configurarFiltros() {
    selectCategoria.addEventListener('change', aplicarFiltros);
    selectOrdenar.addEventListener('change', aplicarFiltros);
    inputPesquisa.addEventListener('keyup', aplicarFiltros);
}

function aplicarFiltros() {
    let produtos = lerDoLocalStorage(CHAVE_LS_PRODUTOS);
    produtos = filtrarPorCategoria(produtos, selectCategoria.value);
    produtos = filtrarPorTermo(produtos, inputPesquisa.value);
    produtos = ordenarProdutos(produtos, selectOrdenar.value);
    mostrarProdutos(produtos);
}

function filtrarPorCategoria(produtos, categoriaSelecionada) {
    if (categoriaSelecionada === "todos") return produtos.slice();
    return produtos.filter(p => p.category === categoriaSelecionada);
}

function filtrarPorTermo(produtos, termo) {
    termo = termo.toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(p =>
        p.title.toLowerCase().includes(termo) ||
        p.description.toLowerCase().includes(termo)
    );
}

function ordenarProdutos(produtos, ordemSelecionada) {
    const listaOrdenada = produtos.slice();
    if (ordemSelecionada === "ascendente") listaOrdenada.sort((a, b) => a.price - b.price);
    if (ordemSelecionada === "descendente") listaOrdenada.sort((a, b) => b.price - a.price);
    return listaOrdenada;
}

// -----------------------
// CHECKOUT
// -----------------------
function configurarCheckout() {
    btnComprar.addEventListener('click', async () => {
        const carrinho = obterCarrinho();
        if (!carrinho.length) {
            alert("O carrinho está vazio!");
            return;
        }

        const idsProdutos = carrinho.map(p => p.id);
        const estudante = document.querySelector('#student-check')?.checked || false;
        const codigoCupao = document.querySelector('#cupao')?.value.trim() || null;
        const nomeCliente = document.querySelector('#nome')?.value.trim() || "Sem nome";

        const dadosCompra = {
            products: idsProdutos,
            student: estudante,
            coupon: codigoCupao,
            name: nomeCliente
        };

        try {
            const resposta = await fetch('https://deisishop.pythonanywhere.com/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCompra)
            });

            const resultado = await resposta.json();

            // Limpa o carrinho e atualiza UI
            localStorage.removeItem(CHAVE_LS_CARRINHO);
            atualizarCarrinho();

            alert(`Compra efetuada com sucesso!
Referência: ${resultado.reference}
Total: €${resultado.totalCost}`);
        } catch (erro) {
            console.error(erro);
            alert("Falha ao processar a compra.");
        }
    });
}
