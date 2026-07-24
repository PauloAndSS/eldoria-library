const listaEl = document.getElementById('listaRascunhos');

function renderLista() {
    listaEl.innerHTML = '';
    const rascunhos = StorageDB.getRascunhos();
    
    if (rascunhos.length === 0) {
        listaEl.innerHTML = '<p>Nenhum rascunho salvo.</p>';
        return;
    }

    rascunhos.forEach(r => {
        const div = document.createElement('div');
        div.className = 'list-item';
        
        // Área clicável para abrir o RASCUNHO NO EDITOR
        const info = document.createElement('div');
        info.className = 'list-item-info';
        info.innerHTML = `<span><strong>${r.titulo}</strong></span>`;
        info.onclick = () => {
            // Aqui enviamos para o editor com o ID do rascunho
            window.location.href = `editor.html?id=${r.id}`;
        };
        
        // Botão de excluir
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-small-danger';
        btnDelete.textContent = 'Excluir';
        btnDelete.onclick = (e) => {
            e.stopPropagation(); // Impede que o clique no botão abra o editor
            if(confirm(`Tem certeza que deseja apagar o rascunho "${r.titulo}"?`)) {
                StorageDB.deletarRascunho(r.id);
                renderLista(); // Atualiza a lista após apagar
            }
        };
        
        div.appendChild(info);
        div.appendChild(btnDelete);
        listaEl.appendChild(div);
    });
}

// CORREÇÃO: O Botão de novo rascunho agora redireciona corretamente para o editor
document.getElementById('btnNovo').onclick = () => {
    window.location.href = 'editor.html';
};

// Renderiza a lista na tela
renderLista();