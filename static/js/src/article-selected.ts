import { 
    ParagraphsRaw, ParagraphsParsed, ParagraphResponse 
} from "./article-list";

export interface ColumnSpec {
    name?: string,
    widthPercent: number
}

export class CustomHTMLTable {
    root: HTMLElement
    table: HTMLTableElement
    columnSpecs: ColumnSpec[] | null

    constructor(divRoot: HTMLElement, columnSpecs?: ColumnSpec[]) {
        // https://stackoverflow.com/questions/928849/setting-table-column-width
        this.root = divRoot;
        this.columnSpecs = columnSpecs;
        this.table = this.initTable();
    }

    initTable(): HTMLTableElement {
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

    addRow(columns: string[]): HTMLTableRowElement {
        if (this.columnSpecs) {
            console.assert(
                columns.length == this.columnSpecs.length,
                `Number of columns doesn't match the number of column specs: 
                require ${this.columnSpecs.length} got ${columns.length}`
            );
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

function splitParagraph(paragraphRaw: string) {
    return paragraphRaw
        .split('. ')
        .map((sentence: string): string => {
            return sentence.endsWith('.') ? sentence : sentence + '.'
        });
}

function translateSentences(sentences: string[]) {
    // TODO: proper translation
    return sentences.map((sentence: string, is: number) => {
        return `sentence #${is}`;
    })
}

export function displayArticleParagraphs(
    paragraphsRaw: ParagraphsRaw, divRoot: HTMLElement
): void {
    // initialize table
    const columnSpecs = [
        {'name': 'original', 'widthPercent': 45},
        {'name': 'original-space', 'widthPercent': 5},
        {'name': 'translation-space', 'widthPercent': 5},
        {'name': 'translation', 'widthPercent': 45}
    ];
    const table = new CustomHTMLTable(divRoot, columnSpecs);

    // fill table
    paragraphsRaw.forEach((paragraphRaw: string, ip: number) => {
        const sentences = splitParagraph(paragraphRaw);
        const translations = translateSentences(sentences);
        
        sentences.forEach((sentence: string, is: number) => {            
            table.addRow([
                sentence, '', '', translations[is]
            ]);
        });
        table.addRow(['', '', '', '']);

    });

}