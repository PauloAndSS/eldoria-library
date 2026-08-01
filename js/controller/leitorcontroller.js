import Livros from '../model/livrosmodel.js';
import StorageController from './storagedbcontroller.js';

const storage = new StorageController();
let livroAtual = null;
let indiceEsquerda = 0;

function carregarDoCache() {
    const dadosSalvos = localStorage.getItem('minecraftbs_livros');
    if (dadosSalvos) {
        const livrosParse = JSON.parse(dadosSalvos);
        livrosParse.forEach(dado => {
            const livroRecriado = new Livros(dado.id, dado.titulo, dado.paginas, dado.categorias);
            livroRecriado.dataCriacao = dado.dataCriacao;
            storage.addLivro(livroRecriado);
        });
    }
}

function iniciarLeitor() {
    carregarDoCache();

    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get('id');

    if (livroId) {
        livroAtual = storage.getLivros().find(l => l.id === parseInt(livroId));
        
        if (livroAtual) {
            document.getElementById('cover-title').innerText = livroAtual.titulo;
        } else {
            document.getElementById('cover-title').innerText = "Livro não encontrado.";
            document.querySelector('.btn-abrir-livro').style.display = "none";
        }
    }
}

window.abrirLivro = function() {
    document.getElementById('capa-wrapper').classList.add('escondido');
    document.getElementById('book-spread').classList.remove('escondido');
    indiceEsquerda = 0;
    renderizarPaginas();
};

function renderizarPaginas() {
    if (!livroAtual) return;

    const paginas = livroAtual.paginas;
    const totalPaginas = paginas.length;

    const contentLeft = document.getElementById('content-left');
    const contentRight = document.getElementById('content-right');
    const numLeft = document.getElementById('num-left');
    const numRight = document.getElementById('num-right');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (indiceEsquerda < totalPaginas) {
        contentLeft.innerText = paginas[indiceEsquerda];
        numLeft.innerText = `Pág. ${indiceEsquerda + 1}`;
    } else {
        contentLeft.innerText = "";
        numLeft.innerText = "";
    }

    const indiceDireita = indiceEsquerda + 1;
    if (indiceDireita < totalPaginas) {
        contentRight.innerText = paginas[indiceDireita];
        numRight.innerText = `Pág. ${indiceDireita + 1}`;
    } else {
        contentRight.innerText = "";
        numRight.innerText = "";
    }

    btnPrev.style.visibility = indiceEsquerda === 0 ? 'hidden' : 'visible';
    btnNext.style.visibility = indiceDireita >= totalPaginas - 1 ? 'hidden' : 'visible';
}

window.paginaAnterior = function() {
    if (indiceEsquerda > 0) {
        indiceEsquerda -= 2;
        renderizarPaginas();
    }
};

window.proximaPagina = function() {
    if (indiceEsquerda + 2 < livroAtual.paginas.length) {
        indiceEsquerda += 2;
        renderizarPaginas();
    }
};

window.copiarPagina = function(lado) {
    let textoParaCopiar = "";
    
    if (lado === 'esq') {
        textoParaCopiar = livroAtual.paginas[indiceEsquerda] || "";
    } else {
        textoParaCopiar = livroAtual.paginas[indiceEsquerda + 1] || "";
    }

    if (textoParaCopiar) {
        navigator.clipboard.writeText(textoParaCopiar).catch(err => {
            console.error("Erro ao copiar texto: ", err);
            alert("Erro ao copiar. Seu navegador pode não suportar esta ação.");
        });
    }
};

window.voltarParaHome = function() {
    const isGitHub = window.location.hostname.includes('github.io');
    const base = isGitHub ? '/minecraft-bookstudio' : '';
    
    window.location.href = `${base}/index.html`;
};

iniciarLeitor();