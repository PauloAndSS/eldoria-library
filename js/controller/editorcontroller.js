import Rascunho from '../model/rascunhosmodel.js'; 
import StorageController from './storagedbcontroller.js'; 

const storage = new StorageController();

let categoriasTemporarias = [];
let rascunhoAtual = null;

function carregarDoCache() {
    const dadosSalvos = localStorage.getItem('minecraftbs_rascunhos');
    
    if (dadosSalvos) {
        const rascunhosParse = JSON.parse(dadosSalvos);
        
        rascunhosParse.forEach(dado => {
            const rascunhoRecriado = new Rascunho(dado.id, dado.titulo, dado.conteudo, dado.categorias);
            rascunhoRecriado.dataCriacao = dado.dataCriacao;
            storage.addRascunho(rascunhoRecriado);
        });

        if (rascunhosParse.length > 0) {
            Rascunho.idCounter = Math.max(...rascunhosParse.map(r => r.id));
        }
    }
}

function salvarNoCache() {
    localStorage.setItem('minecraftbs_rascunhos', JSON.stringify(storage.getRascunhos()));
}

window.salvarRascunho = function() {
    const tituloInput = document.getElementById('titulo-rascunho').value;
    const conteudoInput = document.getElementById('conteudo-rascunho').value;

    if (!rascunhoAtual) {
        // É um rascunho novo
        rascunhoAtual = new Rascunho(null, tituloInput, conteudoInput, [...categoriasTemporarias]);
        storage.addRascunho(rascunhoAtual);
        
        // Atualiza a URL (boa prática, caso algo falhe no redirecionamento)
        const novaUrl = new URL(window.location);
        novaUrl.searchParams.set('id', rascunhoAtual.id);
        window.history.pushState({}, '', novaUrl);
    } else {
        // Estamos editando um rascunho existente
        rascunhoAtual.editTitulo(tituloInput);
        rascunhoAtual.editConteudo(conteudoInput);
        rascunhoAtual.categorias = [...categoriasTemporarias];
    }

    salvarNoCache();
    alert("Rascunho salvo!");
    window.location.href = 'rascunhos.html'; 
};

window.addCategoriaNaTela = function() {
    const inputCat = document.getElementById('input-categoria');
    const novaCategoria = inputCat.value.trim();

    if (novaCategoria && !categoriasTemporarias.includes(novaCategoria)) {
        categoriasTemporarias.push(novaCategoria);
        inputCat.value = '';
        renderizarCategorias();
    }
};

window.removerCategoriaDaTela = function(categoria) {
    categoriasTemporarias = categoriasTemporarias.filter(cat => cat !== categoria);
    renderizarCategorias();
};

function renderizarCategorias() {
    const lista = document.getElementById('lista-categorias');
    lista.innerHTML = '';
    
    categoriasTemporarias.forEach(cat => {
        lista.innerHTML += `
            <li class="categoria-item">
                ${cat} <span style="color: red; cursor: pointer; font-weight: bold;" onclick="removerCategoriaDaTela('${cat}')">x</span>
            </li>
        `;
    });
}

function iniciarEditor() {
    carregarDoCache();
    // 3. CORREÇÃO: A lógica da URL fica apenas aqui dentro, depois que os rascunhos já foram carregados do cache!
    const urlParams = new URLSearchParams(window.location.search);
    const rascunhoId = urlParams.get('id');

    if (rascunhoId) {
        rascunhoAtual = storage.getRascunhos().find(r => r.id === parseInt(rascunhoId));
        if (rascunhoAtual) {
            document.getElementById('titulo-rascunho').value = rascunhoAtual.titulo;
            document.getElementById('conteudo-rascunho').value = rascunhoAtual.conteudo;
            categoriasTemporarias = [...rascunhoAtual.categorias];
            renderizarCategorias();
        }
    }
}

iniciarEditor();