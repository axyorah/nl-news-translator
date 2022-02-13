interface ColumnSpec {
    name?: string,
    widthPercent: number
}

class CustomHTMLTable {
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
        
        if (this.columnSpecs) {
            const colGroup = document.createElement('colgroup');
            this.columnSpecs.forEach(spec => {
                const col = document.createElement('col');
                col.setAttribute('span', '1');
                col.style.width = `${spec.widthPercent}%`;
                colGroup.appendChild(col);
            });
            this.table.appendChild(colGroup);
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
            const col = document.createElement('th');
            col.innerText = colText;
            row.appendChild(col);
        });

        this.table.appendChild(row);

        return row;
    }
}