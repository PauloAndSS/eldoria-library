import Rascunho from '../model/rascunhosmodel.js';
import StorageController from './storagedbcontroller.js';
import MinecraftFormatter from './formatter.js';
import Livros from '../model/livrosmodel.js';

const storage = new StorageController();

function carregarDoCache() {
    const dadosSalvosRascunhos = localStorage.getItem('minecraftbs_rascunhos');
    if (dadosSalvosRascunhos) {
        const rascunhosParse = JSON.parse(dadosSalvosRascunhos);
        rascunhosParse.forEach(dado => {
            const rascunhoRecriado = new Rascunho(dado.id, dado.titulo, dado.conteudo, dado.categorias);
            rascunhoRecriado.dataCriacao = dado.dataCriacao;
            storage.addRascunho(rascunhoRecriado);
        });

        if (rascunhosParse.length > 0) {
            Rascunho.idCounter = Math.max(...rascunhosParse.map(r => r.id));
        }
    }

    const dadosSalvosLivros = localStorage.getItem('minecraftbs_livros');
    if (dadosSalvosLivros) {
        const livrosParse = JSON.parse(dadosSalvosLivros);
        livrosParse.forEach(dado => {
            const livroRecriado = new Livros(dado.id, dado.titulo, dado.paginas || dado.conteudo, dado.categorias);
            livroRecriado.dataCriacao = dado.dataCriacao;
            storage.addLivro(livroRecriado);
        });

        if (livrosParse.length > 0) {
            Livros.idCounter = Math.max(...livrosParse.map(l => l.id));
        }
    }

    console.log("Rascunhos na memória:", storage.getRascunhos());
    console.log("Livros na memória:", storage.getLivros());
}

function salvarNoCache() {
    localStorage.setItem('minecraftbs_rascunhos', JSON.stringify(storage.getRascunhos()));
}

function renderizarRascunhos() {
    const containerLista = document.getElementById('lista-rascunhos');
    const todosRascunhos = storage.getRascunhos();

    containerLista.innerHTML = '';

    if (todosRascunhos.length === 0) {
        containerLista.innerHTML = '<p class="msg-vazia">Nenhum rascunho encontrado nas estantes. Comece a escrever!</p>';
        return;
    }

    todosRascunhos.forEach(rascunho => {
        const categoriasTexto = rascunho.categorias.length > 0
            ? rascunho.categorias.join(', ')
            : 'Nenhuma categoria';

        containerLista.innerHTML += `
            <div class="card-rascunho">
                <h3>${rascunho.titulo}</h3>
                <p class="data">📜 Data: ${rascunho.dataCriacao}</p>
                <p class="categorias">🔖 Categorias: ${categoriasTexto}</p>
                
                <div class="card-acoes">
                    <button class="btn-abrir" onclick="abrirRascunho(${rascunho.id})">Abrir</button>
                    <button class="btn-transformar" onclick="transformarLivro(${rascunho.id})">Selar</button>
                    <button class="btn-excluir" onclick="deletarRascunho(${rascunho.id})">Deletar</button>
                </div>
            </div>
        `;
    });
}


window.transformarLivro = function (id) {
    const rascunho = storage.getRascunhos().find(r => r.id === id);

    if (rascunho) {
        try {
            const paginasFormatadas = MinecraftFormatter.formatarParaLivro(rascunho.conteudo);

            const novoLivro = new Livros(null, rascunho.titulo, paginasFormatadas, rascunho.categorias);

            storage.addLivro(novoLivro);

            localStorage.setItem('minecraftbs_livros', JSON.stringify(storage.getLivros()));

            const deletarOriginal = confirm("✨ Transformação Concluída! O livro foi gerado com a formatação do Minecraft.\nDeseja apagar este rascunho da sua mesa?");
            if (deletarOriginal) {
                storage.deleteRascunhoById(id);
                salvarNoCache();
                renderizarRascunhos();
            } else {
                alert("Livro selado com sucesso na sua biblioteca!");
            }
        } catch (erro) {
            console.error("Erro ao formatar o livro:", erro);
            alert("Ocorreu um erro ao selar o livro. Verifique o console.");
        }
    }
};


window.abrirRascunho = function (id) {
    window.location.href = `editor.html?id=${id}`;
};

window.deletarRascunho = function (id) {
    const confirmacao = confirm("Tem certeza que deseja jogar este rascunho no fogo? Esta ação não pode ser desfeita.");

    if (confirmacao) {
        storage.deleteRascunhoById(id);
        salvarNoCache();
        renderizarRascunhos();
    }
};

// Inicialização
carregarDoCache();
renderizarRascunhos();