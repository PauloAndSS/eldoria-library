class Rascunho {
    constructor(id, titulo, conteudo, categoria) {
        this.id = id || Date.now().toString();
        this.titulo = titulo || 'Novo Rascunho';
        this.conteudo = conteudo || '';
        this.categoria = categoria || '';
    }
}

class Livro {
    constructor(id, titulo, paginas, categoria) {
        this.id = id || Date.now().toString();
        this.titulo = titulo || 'Novo Livro';
        this.paginas = paginas || [];
        this.categoria = categoria || 'Geral';
        this.dataCriacao = new Date().toLocaleDateString();
    }
}

class StorageDB {
    // === RASCUNHOS ===
    static getRascunhos() {
        const data = JSON.parse(localStorage.getItem('mc_rascunhos')) || [];
        return data.map(d => new Rascunho(d.id, d.titulo, d.conteudo, d.categoria));
    }

    static salvarRascunho(rascunho) {
        const rascunhos = this.getRascunhos();
        const index = rascunhos.findIndex(r => r.id === rascunho.id);
        if (index > -1) rascunhos[index] = rascunho;
        else rascunhos.push(rascunho);
        
        this.adicionarCategoria(rascunho.categoria);
        localStorage.setItem('mc_rascunhos', JSON.stringify(rascunhos));
    }

    static deletarRascunho(id) {
        let rascunhos = this.getRascunhos();
        rascunhos = rascunhos.filter(r => r.id !== id);
        localStorage.setItem('mc_rascunhos', JSON.stringify(rascunhos));
    }

    // === LIVROS ===
    static getLivros() {
        const data = JSON.parse(localStorage.getItem('mc_livros')) || [];
        return data.map(d => new Livro(d.id, d.titulo, d.paginas, d.categoria));
    }

    static salvarLivro(livro) {
        const livros = this.getLivros();
        livros.push(livro);
        this.adicionarCategoria(livro.categoria);
        localStorage.setItem('mc_livros', JSON.stringify(livros));
    }

    static deletarLivro(id) {
        let livros = this.getLivros();
        livros = livros.filter(l => l.id !== id);
        localStorage.setItem('mc_livros', JSON.stringify(livros));
    }

    // === CATEGORIAS ===
    static getCategorias() {
        return JSON.parse(localStorage.getItem('mc_categorias')) || ['Fantasia', 'Ficção', 'Regras RPG'];
    }

    static adicionarCategoria(novaCategoria) {
        if (!novaCategoria) return;
        const categorias = this.getCategorias();
        // Se a categoria não existir na lista, salva ela para usos futuros
        if (!categorias.includes(novaCategoria)) {
            categorias.push(novaCategoria);
            localStorage.setItem('mc_categorias', JSON.stringify(categorias));
        }
    }
}