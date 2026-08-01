import Livros from '../model/livrosmodel.js';
import StorageController from './storagedbcontroller.js';

const storage = new StorageController();

const coresCapa = [
    'linear-gradient(135deg, #7c2222, #4a1414)',
    'linear-gradient(135deg, #2c3e50, #1a252f)',
    'linear-gradient(135deg, #2e4a22, #182910)',
    'linear-gradient(135deg, #5c4033, #33231c)',
    'linear-gradient(135deg, #3d2b1f, #1a120c)'
];

function carregarDoCache() {
    const dadosSalvos = localStorage.getItem('minecraftbs_livros');
    if (dadosSalvos) {
        const livrosParse = JSON.parse(dadosSalvos);
        livrosParse.forEach(dado => {
            const livroRecriado = new Livros(dado.id, dado.titulo, dado.paginas || dado.conteudo, dado.categorias);
            livroRecriado.dataCriacao = dado.dataCriacao;
            storage.addLivro(livroRecriado);
        });
    }
}

function salvarNoCache() {
    localStorage.setItem('minecraftbs_livros', JSON.stringify(storage.getLivros()));
}

function renderizarEstante() {
    const containerGrid = document.getElementById('grid-livros');
    const termoTitulo = document.getElementById('busca-titulo').value.toLowerCase();
    const termoCategoria = document.getElementById('busca-categoria').value.toLowerCase();
    
    containerGrid.innerHTML = ''; 

    const todosLivros = storage.getLivros();

    const livrosFiltrados = todosLivros.filter(livro => {
        const matchTitulo = livro.titulo.toLowerCase().includes(termoTitulo);
        const matchCategoria = livro.categorias.some(cat => cat.toLowerCase().includes(termoCategoria));
        
        if (termoCategoria === "") return matchTitulo;
        if (termoTitulo === "") return matchCategoria;
        return matchTitulo && matchCategoria;
    });

    if (livrosFiltrados.length === 0) {
        containerGrid.innerHTML = '<p class="msg-vazia" style="grid-column: 1 / -1;">Nenhum conhecimento antigo encontrado com estes termos...</p>';
        return;
    }

    livrosFiltrados.forEach((livro, index) => {
        const categoriasTexto = livro.categorias.length > 0 ? livro.categorias.join(', ') : 'Sem categoria';
        const corEscolhida = coresCapa[livro.id % coresCapa.length];

        containerGrid.innerHTML += `
            <div class="livro-capa" style="background: ${corEscolhida};">
                <div class="livro-detalhes">
                    <h3 class="livro-titulo">${livro.titulo}</h3>
                    <p class="livro-cats">${categoriasTexto}</p>
                </div>
                
                <div class="livro-acoes">
                    <button class="btn-abrir-estante" onclick="abrirLivro(${livro.id})">Ler</button>
                    <button class="btn-deletar-estante" onclick="deletarLivro(${livro.id})">Queimar</button>
                </div>
            </div>
        `;
    });
}

window.abrirLivro = function(id) {
    const isGitHub = window.location.hostname.includes('github.io');
    const base = isGitHub ? '/minecraft-bookstudio' : '';
    
    window.location.href = `${base}/view/leitor.html?id=${id}`;
};

window.deletarLivro = function(id) {
    const confirmacao = confirm("🔥 Deseja jogar este livro no fogo? Todo o conhecimento será perdido permanentemente.");
    if (confirmacao) {
        storage.deleteLivroById(id);
        salvarNoCache();
        renderizarEstante();
    }
};

document.getElementById('busca-titulo').addEventListener('input', renderizarEstante);
document.getElementById('busca-categoria').addEventListener('input', renderizarEstante);

carregarDoCache();
renderizarEstante();