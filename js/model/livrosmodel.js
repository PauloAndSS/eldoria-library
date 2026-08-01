export default class Livros {
    static idCounter = 0;
    id;
    titulo;
    paginas;
    categorias;
    dataCriacao;

    constructor(id, titulo, paginas, categorias) {
        this.id = id || ++Livros.idCounter;
        this.titulo = titulo || 'Novo Livro';
        this.paginas = paginas || [];
        this.categorias = categorias || [];
        this.dataCriacao = new Date().toLocaleDateString();
    }

    editTitulo(novoTitulo) {
        this.titulo = novoTitulo;
    }
    editCategorias(novasCategorias) {
        this.categorias = novasCategorias;
    }
}
