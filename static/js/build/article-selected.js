export class CustomHTMLTable {
    constructor(divRoot, columnSpecs) {
        // https://stackoverflow.com/questions/928849/setting-table-column-width
        this.root = divRoot;
        this.columnSpecs = columnSpecs;
        this.table = this.initTable();
    }
    initTable() {
        const table = document.createElement('table');
        table.setAttribute('class', 'table');
        if (this.columnSpecs) {
            const colGroup = document.createElement('colgroup');
            this.columnSpecs.forEach(spec => {
                const col = document.createElement('col');
                col.setAttribute('span', '1');
                col.style.width = `${spec.widthPercent}%`;
                colGroup.appendChild(col);
            });
            table.appendChild(colGroup);
        }
        this.root.appendChild(table);
        return table;
    }
    addRow(columns) {
        if (this.columnSpecs) {
            console.assert(columns.length == this.columnSpecs.length, `Number of columns doesn't match the number of column specs: 
                require ${this.columnSpecs.length} got ${columns.length}`);
        }
        const row = document.createElement('tr');
        columns.forEach(colText => {
            const col = document.createElement('td');
            col.innerText = colText;
            row.appendChild(col);
        });
        this.table.appendChild(row);
        return row;
    }
}
function splitParagraph(paragraphRaw) {
    return paragraphRaw
        .split('. ')
        .map((sentence) => {
        return sentence.endsWith('.') ? sentence : sentence + '.';
    });
}
function translateSentences(sentences) {
    // TODO: proper translation
    return sentences.map((sentence, is) => {
        return `sentence #${is}`;
    });
}
export function displayArticleParagraphs(paragraphsRaw, divRoot) {
    // initialize table
    const columnSpecs = [
        { 'name': 'original', 'widthPercent': 45 },
        { 'name': 'original-space', 'widthPercent': 5 },
        { 'name': 'translation-space', 'widthPercent': 5 },
        { 'name': 'translation', 'widthPercent': 45 }
    ];
    const table = new CustomHTMLTable(divRoot, columnSpecs);
    // fill table
    paragraphsRaw.forEach((paragraphRaw, ip) => {
        const sentences = splitParagraph(paragraphRaw);
        const translations = translateSentences(sentences);
        sentences.forEach((sentence, is) => {
            table.addRow([
                sentence, '', '', translations[is]
            ]);
        });
        table.addRow(['', '', '', '']);
    });
}
