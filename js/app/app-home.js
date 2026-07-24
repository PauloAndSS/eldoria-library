// Aguarda o HTML carregar 100% antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    const listaEl = document.getElementById('listaLivros');
    const filtroEl = document.getElementById('filtroCategoria');

    // Trava de segurança: se não achar o HTML, avisa no console e para
    if (!listaEl || !filtroEl) {
        console.error("Erro: Elementos da lista ou filtro não encontrados no HTML da Home.");
        return;
    }

    // Preenche o Select com as categorias salvas
    function inicializarFiltro() {
        try {
            const categorias = StorageDB.getCategorias();
            filtroEl.innerHTML = '<option value="Todos">Todas as Categorias</option>';
            
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                filtroEl.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar o filtro:", error);
        }
    }

    // Renderiza a lista na Home
    function renderLista(filtro = 'Todos') {
        listaEl.innerHTML = '';
        
        try {
            let livros = StorageDB.getLivros();
            
            // Filtra os livros (Considera 'Geral' se um livro antigo não tiver categoria)
            if (filtro !== 'Todos') {
                livros = livros.filter(l => (l.categoria || 'Geral') === filtro);
            }
            
            if (!livros || livros.length === 0) {
                listaEl.innerHTML = '<p style="text-align: center; padding: 2rem; color: #5a4030; background: rgba(255,255,255,0.4); border-radius: 4px;">Nenhum livro encontrado. Abra um pergaminho e comece a escrever!</p>';
                return;
            }

            // Mostra apenas os 5 livros mais recentes na Home
            const livrosRecentes = livros.slice(-5).reverse();

            livrosRecentes.forEach(livro => {
                const div = document.createElement('div');
                div.className = 'list-item';
                
                // Proteção extra: se as páginas não existirem, diz que tem 0
                const qtdPaginas = livro.paginas ? livro.paginas.length : 0;
                const catLivro = livro.categoria || 'Geral';
                const dataLivro = livro.dataCriacao || 'Recente';
                
                const info = document.createElement('div');
                info.className = 'list-item-info';
                info.innerHTML = `
                    <span>
                        <strong>${livro.titulo}</strong> 
                        <span class="badge-categoria">${catLivro}</span>
                        <br>
                        <small>(${dataLivro}) - ${qtdPaginas} págs</small>
                    </span>
                `;
                
                // Caminho com "view/" pois estamos na raiz
                info.onclick = () => window.location.href = `view/leitor.html?id=${livro.id}`;
                
                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn-small-danger';
                btnDelete.textContent = 'Excluir';
                btnDelete.onclick = (e) => {
                    e.stopPropagation();
                    if(confirm(`Deseja destruir permanentemente o livro "${livro.titulo}"?`)) {
                        StorageDB.deletarLivro(livro.id);
                        renderLista(filtroEl.value); 
                        inicializarFiltro();
                    }
                };
                
                div.appendChild(info);
                div.appendChild(btnDelete);
                listaEl.appendChild(div);
            });
        } catch (error) {
            console.error("Erro fatal ao renderizar os livros:", error);
            listaEl.innerHTML = '<p style="color: var(--danger); font-weight: bold; text-align: center;">Houve um erro ao carregar sua biblioteca. Verifique o console do navegador.</p>';
        }
    }

    // Quando mudar o seletor, recarrega a lista
    filtroEl.addEventListener('change', (e) => {
        renderLista(e.target.value);
    });

    // Inicialização segura
    inicializarFiltro();
    renderLista();
});