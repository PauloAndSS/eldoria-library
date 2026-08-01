const headerElement = document.querySelector('header');

function header() {
    const isGitHub = window.location.hostname.includes('github.io');
    const base = isGitHub ? '/minecraft-bookstudio' : '';

    headerElement.classList.add('header');
    headerElement.innerHTML = `
        <h1>Minecraft Book Studio</h1>
        <nav>
            <ul>
                <li><a href="${base}/index.html">Início</a></li>
                <li><a href="${base}/view/rascunhos.html">Rascunhos</a></li>
                <li><a href="${base}/view/sobre.html">Sobre</a></li>
            </ul>
        </nav>
    `;
}

header();