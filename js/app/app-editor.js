const titleEl = document.getElementById('draftTitle');
const categoryEl = document.getElementById('draftCategory');
const contentEl = document.getElementById('draftContent');
const categoryListEl = document.getElementById('categoryList');

const urlParams = new URLSearchParams(window.location.search);
const draftId = urlParams.get('id');

let rascunhoAtual = new Rascunho();

// Carrega as categorias existentes no Datalist para auto-completar
function carregarCategorias() {
    const categorias = StorageDB.getCategorias();
    categoryListEl.innerHTML = '';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        categoryListEl.appendChild(option);
    });
}
carregarCategorias();

if (draftId) {
    const rascunhos = StorageDB.getRascunhos();
    const found = rascunhos.find(r => r.id === draftId);
    if (found) {
        rascunhoAtual = found;
        titleEl.value = rascunhoAtual.titulo !== 'Novo Rascunho' ? rascunhoAtual.titulo : '';
        categoryEl.value = rascunhoAtual.categoria;
        contentEl.value = rascunhoAtual.conteudo;
        setTimeout(() => autoResizeTextarea(contentEl), 50);
    }
}

function autoResizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

contentEl.addEventListener('input', function() {
    autoResizeTextarea(this);
});

document.getElementById('btnSalvar').onclick = () => {
    rascunhoAtual.titulo = titleEl.value || 'Sem Título';
    rascunhoAtual.categoria = categoryEl.value || 'Geral';
    rascunhoAtual.conteudo = contentEl.value;
    
    StorageDB.salvarRascunho(rascunhoAtual);
    alert('Rascunho salvo com sucesso!');
    window.location.href = 'rascunhos.html';
};

document.getElementById('btnConverter').onclick = () => {
    if (!contentEl.value.trim()) {
        alert("O rascunho está vazio!");
        return;
    }
    
    const tituloFinal = titleEl.value || 'Livro Sem Título';
    const categoriaFinal = categoryEl.value || 'Geral';
    
    const paginas = MCFormatter.paginate(contentEl.value);
    const novoLivro = new Livro(null, tituloFinal, paginas, categoriaFinal);
    
    StorageDB.salvarLivro(novoLivro);
    
    if(confirm('Livro gerado e salvo na "Biblioteca de Eldoria"! Deseja apagar este rascunho agora?')) {
        StorageDB.deletarRascunho(rascunhoAtual.id);
    }
    
    window.location.href = '../index.html';
};