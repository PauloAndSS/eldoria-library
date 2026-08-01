export default class MinecraftFormatter {
    static MAX_CHARS_POR_LINHA = 19;
    static MAX_LINHAS_POR_PAGINA = 14;
    static MAX_PAGINAS_LIVRO = 100;

    static formatarParaLivro(textoBruto) {
        if (!textoBruto) return [];

        const paginasDoLivro = [];

        const secoes = textoBruto.split('//');

        for (const secao of secoes) {
            // Processa cada seção separada e adiciona ao livro
            const paginasDaSecao = this.#paginarSecao(secao.trim());
            paginasDoLivro.push(...paginasDaSecao);
        }

        return paginasDoLivro.slice(0, this.MAX_PAGINAS_LIVRO);
    }

    static #paginarSecao(textoSecao) {
        if (!textoSecao) return [""]; // Permite criar uma página em branco se o usuário digitar "// //"

        const linhas = this.#quebrarEmLinhas(textoSecao);
        const paginas = [];

        for (let i = 0; i < linhas.length; i += this.MAX_LINHAS_POR_PAGINA) {
            const linhasDaPagina = linhas.slice(i, i + this.MAX_LINHAS_POR_PAGINA);
            paginas.push(linhasDaPagina.join('\n'));
        }

        return paginas;
    }

    static #quebrarEmLinhas(texto) {
        const paragrafos = texto.split('\n');
        const linhasFormatadas = [];

        for (const paragrafo of paragrafos) {
            // Se for apenas um Enter vazio, adiciona uma linha em branco
            if (paragrafo === '') {
                linhasFormatadas.push('');
                continue;
            }

            const palavras = paragrafo.split(' ');
            let linhaAtual = "";

            for (const palavra of palavras) {
                const tamanhoPalavra = this.#getTamanhoVisivel(palavra);
                const tamanhoLinha = this.#getTamanhoVisivel(linhaAtual);
                const tamanhoEspaco = linhaAtual.length > 0 ? 1 : 0; // Conta o espaço " " se a linha não estiver vazia

                // Se a palavra couber na linha atual, adiciona ela
                if (tamanhoLinha + tamanhoEspaco + tamanhoPalavra <= this.MAX_CHARS_POR_LINHA) {
                    linhaAtual += (linhaAtual.length > 0 ? " " : "") + palavra;
                } else {
                    // A linha encheu. Guarda a linha atual e começa uma nova com a palavra atual
                    if (linhaAtual.length > 0) {
                        linhasFormatadas.push(linhaAtual);
                    }
                    linhaAtual = palavra;
                }
            }
            
            // Não esquece de guardar a última linha gerada no fim do parágrafo
            if (linhaAtual.length > 0) {
                linhasFormatadas.push(linhaAtual);
            }
        }

        return linhasFormatadas;
    }

    static #getTamanhoVisivel(texto) {
        return texto.replace(/[&§][0-9a-fk-or]/gi, '').length;
    }
}