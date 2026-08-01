import Livros from "../model/livrosmodel.js";
import Rascunho from "../model/rascunhosmodel.js";

console.log("StorageController carregado");

export default class StorageController {
    livros = [];
    rascunhos = [];

    constructor(livrosarray = [], rascunhosarray = []) {
        if (Array.isArray(livrosarray)) {
            this.livros = livrosarray;
        }else {
            console.error("O array de livros fornecido não é válido. Deve ser um array.");
        }
        if (Array.isArray(rascunhosarray)) {
            this.rascunhos = rascunhosarray;
        }else {
            console.error("O array de rascunhos fornecido não é válido. Deve ser um array.");
        }
    }

    getLivros() {
        //retorna uma cópia do array de livros para evitar manipulação direta
        return [...this.livros];
    }

    getRascunhos() {
        //retorna uma cópia do array de rascunhos para evitar manipulação direta
        return [...this.rascunhos];
    }

    addLivro(livro) {
        if (livro instanceof Livros) {
            this.livros.push(livro);
        } else {
            console.error("O objeto fornecido não é uma instância da classe Livros.");
        }
    }

    addRascunho(rascunho) {
        if (rascunho instanceof Rascunho) {
            this.rascunhos.push(rascunho);
        } else {
            console.error("O objeto fornecido não é uma instância da classe Rascunho.");
        }
    }

    deleteLivroById(id) {
        const index = this.livros.findIndex(l => l.id === id);
        if (index !== -1) {
            this.livros.splice(index, 1);
        } else {
            console.error(`Livro com ID ${id} não encontrado.`);
        }
    }

    deleteRascunhoById(id) {
        const index = this.rascunhos.findIndex(r => r.id === id);
        if (index !== -1) {
            this.rascunhos.splice(index, 1);
        } else {
            console.error(`Rascunho com ID ${id} não encontrado.`);
        }
    }
}