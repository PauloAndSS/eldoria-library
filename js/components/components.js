class UIComponents {
    /**
     * Renderiza o Header dinamicamente
     * @param {string} basePath - O caminho relativo para a raiz ('.' para index, '..' para arquivos na pasta view)
     */
    static renderHeader(basePath) {
        const headerContainer = document.getElementById('header-container');
        
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <nav class="navbar">
                <h2>Biblioteca de Eldoria</h2>
                <div>
                    <a href="${basePath}/index.html">Home</a>
                    <a href="${basePath}/view/rascunhos.html">Rascunhos</a>
                </div>
            </nav>
        `;
    }
}