class MCFormatter {
    static CHARS_PER_LINE = 19;
    static LINES_PER_PAGE = 14;

    static getVisibleLength(text) {
        return text.replace(/[&§][0-9a-fk-or]/gi, '').length;
    }

    static paginate(text) {
        const pages = [];
        let currentPageText = "";
        let currentLineCount = 0;
        
        const paragraphs = text.split('\n');
        
        for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
            const paragraph = paragraphs[pIndex];
            
            // 1. CHECA SE A LINHA É UMA QUEBRA DE PÁGINA FORÇADA (Sozinha na linha)
            if (paragraph.trim() === '//') {
                if (currentPageText !== "") {
                    // Salva a página atual e remove espaços/enters extras do final
                    pages.push(currentPageText.trimEnd());
                    currentPageText = "";
                    currentLineCount = 0;
                }
                continue; // Pula a linha do "//" para não renderizá-la no livro
            }
            
            // Se for uma linha totalmente vazia (usuário deu múltiplos enters)
            if (paragraph === "") {
                currentLineCount++;
                if (currentLineCount >= this.LINES_PER_PAGE) {
                    pages.push(currentPageText.trimEnd());
                    currentPageText = "";
                    currentLineCount = 0;
                } else {
                    currentPageText += "\n";
                }
                continue;
            }
            
            const words = paragraph.split(' ');
            let charsOnCurrentLine = 0;
            
            for (let wIndex = 0; wIndex < words.length; wIndex++) {
                const word = words[wIndex];
                
                // 2. CHECA SE A QUEBRA FOI COLOCADA NO MEIO DO TEXTO (Inline)
                if (word === '//') {
                    if (currentPageText !== "") {
                        pages.push(currentPageText.trimEnd());
                        currentPageText = "";
                        currentLineCount = 0;
                        charsOnCurrentLine = 0;
                    }
                    continue; // Pula o "//" e vai para a próxima palavra na próxima página
                }

                const wordLen = this.getVisibleLength(word);
                const needsSpace = (currentPageText !== "" && !currentPageText.endsWith('\n'));
                const virtualSpaceLen = (charsOnCurrentLine > 0) ? 1 : 0;
                
                if (charsOnCurrentLine + virtualSpaceLen + wordLen <= this.CHARS_PER_LINE) {
                    charsOnCurrentLine += virtualSpaceLen + wordLen;
                    currentPageText += (needsSpace ? " " : "") + word;
                } else {
                    if (charsOnCurrentLine > 0) currentLineCount++;
                    
                    if (currentLineCount >= this.LINES_PER_PAGE) {
                        pages.push(currentPageText.trimEnd());
                        currentPageText = word;
                        currentLineCount = 0;
                        charsOnCurrentLine = wordLen;
                    } else {
                        currentPageText += (needsSpace ? " " : "") + word;
                        charsOnCurrentLine = wordLen;
                    }
                }
            }
            
            // Fim de um parágrafo (adiciona a quebra de linha normal)
            if (pIndex < paragraphs.length - 1) {
                currentLineCount++;
                if (currentLineCount >= this.LINES_PER_PAGE) {
                    pages.push(currentPageText.trimEnd());
                    currentPageText = "";
                    currentLineCount = 0;
                } else {
                    currentPageText += "\n";
                }
            }
        }
        
        // Adiciona a última página se tiver sobrado texto
        if (currentPageText !== "") {
            pages.push(currentPageText.trimEnd());
        }
        
        return pages;
    }
}