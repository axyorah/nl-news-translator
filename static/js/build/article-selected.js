class Table {
    constructor(divRoot, columnSpecs) {
        // https://stackoverflow.com/questions/928849/setting-table-column-width
        this.root = divRoot;
        this.header = header;
        this.table = null;
        this.init();
    }

    init() {
        this.table = document.createElement('table');
        this.root.appendChild(this.table);
    }

    addRow(columns) {

    }
}