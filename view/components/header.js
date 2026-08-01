console.log("header.js carregado");

const headerElement = document.querySelector('header');

function header() {
    headerElement.classList.add('header');
    headerElement.innerHTML = `
        <h1>Minecraft Book Studio</h1>
        <nav>
            <ul>
                <li><a href="../index.html">Início</a></li>
                <li><a href="/view/rascunhos.html">Rascunhos</a></li>
                <li><a href="/view/sobre.html">Sobre</a></li>
            </ul>
        </nav>
    `;
}

header();