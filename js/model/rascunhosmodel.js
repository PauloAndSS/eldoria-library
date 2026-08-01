export default class Rascunho {
    static idCounter = 0;
    id;
    titulo;
    conteudo;
    categorias;
    dataCriacao;

    constructor(id, titulo, conteudo, categorias) {
        this.id = id || ++Rascunho.idCounter;
        this.titulo = titulo || 'Novo Rascunho';
        this.conteudo = conteudo || '';
        this.categorias = categorias || [];
        this.dataCriacao = new Date().toLocaleDateString();
    }

    editTitulo(novoTitulo) {
        this.titulo = novoTitulo;
    }

    editConteudo(novoConteudo) {
        this.conteudo = novoConteudo;
    }

    addCategoria(novaCategoria) {
        if (!this.categorias.includes(novaCategoria)) {
            this.categorias.push(novaCategoria);
        }
    }

    removeCategoria(categoria) {
        this.categorias = this.categorias.filter(cat => cat !== categoria);
    }
}