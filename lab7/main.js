// -----------------------
// CONSTANTES
// -----------------------
const API_PRODUTOS = 'https://deisishop.pythonanywhere.com/products';
const API_CATEGORIAS = 'https://deisishop.pythonanywhere.com/categories';
const LOCAL_STORAGE_CARRINHO = 'produtos-selecionados';
const LOCAL_STORAGE_PRODUTOS = 'produtos';

// -----------------------
// SELECTORES DO DOM
// -----------------------
const SELECT_CATEGORIA = document.querySelector('#categoria');
const SELECT_ORDENAR = document.querySelector('#ordenar');
const INPUT_PESQUISA = document.querySelector('#pesquisa');
const LISTA_PRODUTOS = document.querySelector('#lista-produtos');
const LISTA_CARRINHO = document.querySelector('#lista-carrinho');
const TOTAL_CARRINHO = document.querySelector('#total');
const BTN_COMPRAR = document.querySelector('#buy');

// -----------------------
// INICIALIZAÇÃO
// -----------------------
document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosAPI();
    await carregarCategoriasAPI();
    atualizarCarrinho();
    configurarFiltros();
    iniciarCheckout();
});

// -----------------------
// LOCAL STORAGE HELPERS
// -----------------------
function salvarLS(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function lerLS(chave) {
    const data = localStorage.getItem(chave);
    return data ? JSON.parse(data) : [];
}

// -----------------------
// API
// -----------------------
async function carregarProdutosAPI() {
    try {
        const resp = await fetch(API_PRODUTOS);
        const produtos = await resp.json();
        salvarLS(LOCAL_STORAGE_PRODUTOS, produtos);
        mostrarProdutos(produtos);
    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        alert("Erro ao carregar produtos. Verifique a ligação.");
    }
}

async function carregarCategoriasAPI() {
    try {
        const resp = await fetch(API_CATEGORIAS);
        const categorias = await resp.json();
        mostrarCategorias(categorias);
    } catch (e) {
        console.error("Erro ao carregar categorias:", e);
    }
}

// -----------------------
// RENDERIZAÇÃO
// -----------------------
function mostrarCategorias(categorias) {
    categorias.forEach(cat => {
        const op = document.createElement('option');
        op.value = cat;
        op.textContent = cat;
        SELECT_CATEGORIA.append(op);
    });
}

function mostrarProdutos(produtos) {
    LISTA_PRODUTOS.innerHTML = "";
    produtos.forEach(prod => {
        const card = criarCardProduto(prod);
        LISTA_PRODUTOS.appendChild(card);
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
    const btn = document.createElement('button');
    btn.textContent = "+ Adicionar ao cesto";
    btn.addEventListener('click', () => {
        adicionarAoCarrinho(produto);
        atualizarCarrinho();
    });
    return btn;
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
    const btn = document.createElement('button');
    btn.textContent = "❌ Remover";
    btn.addEventListener('click', () => {
        removerDoCarrinho(index);
    });
    return btn;
}

// -----------------------
// CARRINHO
// -----------------------
function getCarrinho() {
    return lerLS(LOCAL_STORAGE_CARRINHO);
}

function adicionarAoCarrinho(produto) {
    const cesto = getCarrinho();
    cesto.push(produto);
    salvarLS(LOCAL_STORAGE_CARRINHO, cesto);
}

function removerDoCarrinho(index) {
    const cesto = getCarrinho();
    cesto.splice(index, 1);
    salvarLS(LOCAL_STORAGE_CARRINHO, cesto);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    LISTA_CARRINHO.innerHTML = "";
    const cesto = getCarrinho();
    let total = 0;

    cesto.forEach((p, i) => {
        total += Number(p.price);
        const card = criarCardCarrinho(p, i);
        LISTA_CARRINHO.appendChild(card);
    });

    TOTAL_CARRINHO.textContent = "Total: €" + total.toFixed(2);
}

// -----------------------
// FILTROS
// -----------------------
function configurarFiltros() {
    SELECT_CATEGORIA.addEventListener('change', aplicarFiltros);
    SELECT_ORDENAR.addEventListener('change', aplicarFiltros);
    INPUT_PESQUISA.addEventListener('keyup', aplicarFiltros);
}

function aplicarFiltros() {
    let produtos = lerLS(LOCAL_STORAGE_PRODUTOS);
    produtos = filtrarPorCategoria(produtos, SELECT_CATEGORIA.value);
    produtos = filtrarPorTermo(produtos, INPUT_PESQUISA.value);
    produtos = ordenarProdutos(produtos, SELECT_ORDENAR.value);
    mostrarProdutos(produtos);
}

function filtrarPorCategoria(produtos, categoria) {
    if (categoria === "todos") return produtos.slice();
    return produtos.filter(p => p.category === categoria);
}

function filtrarPorTermo(produtos, termo) {
    termo = termo.toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(p =>
        p.title.toLowerCase().includes(termo) ||
        p.description.toLowerCase().includes(termo)
    );
}

function ordenarProdutos(produtos, ordem) {
    const lista = produtos.slice();
    if (ordem === "ascendente") lista.sort((a, b) => a.price - b.price);
    if (ordem === "descendente") lista.sort((a, b) => b.price - a.price);
    return lista;
}

// -----------------------
// CHECKOUT COM DESCONTO
// -----------------------
function iniciarCheckout() {
    BTN_COMPRAR.addEventListener('click', async () => {
        const cesto = getCarrinho();
        if (!cesto.length) {
            alert("O cesto está vazio!");
            return;
        }

        const ids = cesto.map(p => p.id); // apenas IDs
        const estudante = document.querySelector('#student-check')?.checked || false;
        const cupao = document.querySelector('#cupao')?.value.trim() || null;
        const nome = document.querySelector('#nome')?.value.trim() || "Sem nome";

        const dadosCompra = {
            products: ids,
            student: estudante,
            coupon: cupao,
            name: nome
        };

        try {
            const resp = await fetch('https://deisishop.pythonanywhere.com/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCompra)
            });

            const resJSON = await resp.json();

            // Limpa carrinho e atualiza UI
            localStorage.removeItem(LOCAL_STORAGE_CARRINHO);
            atualizarCarrinho();

            alert(`Compra efetuada com sucesso!
Referência: ${resJSON.reference}
Total: €${resJSON.totalCost}`);
        } catch (e) {
            console.error(e);
            alert("Falha ao processar a compra.");
        }
    });
}