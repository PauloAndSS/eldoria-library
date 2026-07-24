// Verifica qual livro foi clicado através da URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');
const paginasContainer = document.getElementById('paginasContainer');

if (bookId) {
    const livros = StorageDB.getLivros();
    const livroAtual = livros.find(l => l.id === bookId);
    
    if (livroAtual) {
        document.getElementById('livroTitulo').textContent = livroAtual.titulo;
        
        const contagem = document.getElementById('livroContagem');
        contagem.textContent = livroAtual.paginas.length;
        
        // Alerta visual se passar de 100 páginas
        if (livroAtual.paginas.length > 100) {
            contagem.style.color = 'var(--danger)';
            contagem.style.fontWeight = 'bold';
        }
        
        renderizarPaginas(livroAtual.paginas);
    } else {
        paginasContainer.innerHTML = '<p>Erro: Livro não encontrado.</p>';
    }
} else {
    // Se não tiver ID na URL, joga de volta pra lista
    window.location.href = 'livros.html';
}

function renderizarPaginas(paginas) {
    paginasContainer.innerHTML = '';
    
    paginas.forEach((texto, index) => {
        const pageNum = index + 1;
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const header = document.createElement('div');
        header.className = 'page-header';
        
        const titulo = document.createElement('span');
        titulo.textContent = `Página ${pageNum}`;
        if (pageNum > 100) {
            titulo.style.color = 'var(--danger)';
            titulo.textContent += ' (Excede limite do jogo)';
        }
        
        const btn = document.createElement('button');
        btn.textContent = 'Copiar';
        btn.onclick = () => copiarTexto(texto, btn);
        
        const conteudo = document.createElement('div');
        conteudo.className = 'mc-page';
        conteudo.textContent = texto;
        
        header.appendChild(titulo);
        header.appendChild(btn);
        card.appendChild(header);
        card.appendChild(conteudo);
        
        paginasContainer.appendChild(card);
    });
}

function copiarTexto(texto, btn) {
    navigator.clipboard.writeText(texto).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copiado!';
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('btn-success');
        }, 1500);
    });
}