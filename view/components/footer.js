console.log('Footer component loaded.');

const footerElement = document.querySelector('footer');

function footer() {
    footerElement.classList.add('footer');
    footerElement.innerHTML = `
        <p>© 2024 Minecraft Book Studio. Todos os direitos reservados.</p>
        <p>Desenvolvido por <a href="https://github.com/PauloAndSS" target="_blank">PauloAndSS</a>.</p>
    `;
    return footer;
}

footer();