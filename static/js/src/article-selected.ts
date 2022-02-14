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

    private getColGroup(columnSpecs: ColumnSpec[]): HTMLTableColElement {

        const colGroup = document.createElement('colgroup');
            
        // add first blank column (needed for bootstrap?)
        const colBlank = document.createElement('col');
        colBlank.setAttribute('span', '1');
        colBlank.style.width = '0%';
        colGroup.appendChild(colBlank);

        // set column widths
        columnSpecs.forEach(spec => {
            const col = document.createElement('col');
            col.setAttribute('span', '1');
            col.style.width = `${spec.widthPercent}%`;
            colGroup.appendChild(col);
        });

        return colGroup;
    }

    private getTHead(columnSpecs: ColumnSpec[]): HTMLTableSectionElement {
        const thead = document.createElement('thead');        
        const row = document.createElement('tr');

        const thBlank = document.createElement('th');
        thBlank.setAttribute('scope', 'col');
        row.appendChild(thBlank);
        
        columnSpecs.forEach(spec => {
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.innerText = spec.name;
            row.appendChild(th);
        });
        
        thead.appendChild(row);
        return thead;
    }

    initTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.setAttribute('class', 'table');
        
        // add column group and table header if column specs are provided
        if (this.columnSpecs) {
            const colGroup = this.getColGroup(this.columnSpecs);
            table.appendChild(colGroup);

            const thead = this.getTHead(this.columnSpecs);
            table.appendChild(thead);
        }
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

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

        const tbody = this.table.querySelector('tbody');

        const row = document.createElement('tr');
        const tdBlank = document.createElement('td');
        tdBlank.setAttribute('scope', 'row');
        row.appendChild(tdBlank);

        columns.forEach(colText => {
            const col = document.createElement('td');
            col.innerText = colText;
            row.appendChild(col);
        });

        tbody.appendChild(row);

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
        {'name': 'Original Text', 'widthPercent': 45},
        {'name': '', 'widthPercent': 5},
        {'name': '', 'widthPercent': 5},
        {'name': 'Translation', 'widthPercent': 45}
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