var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { postData } from "./utils.js";
export class CustomHTMLTable {
    constructor(divRoot, columnSpecs) {
        // https://stackoverflow.com/questions/928849/setting-table-column-width
        this.root = divRoot;
        this.columnSpecs = columnSpecs;
        this.table = this.initTable();
    }
    getColGroup(columnSpecs) {
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
    getTHead(columnSpecs) {
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
    initTable() {
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
    addRow(columns) {
        if (this.columnSpecs) {
            console.assert(columns.length == this.columnSpecs.length, `Number of columns doesn't match the number of column specs: 
                require ${this.columnSpecs.length} got ${columns.length}`);
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
function splitParagraph(paragraphRaw) {
    return paragraphRaw
        .split('. ')
        .map((sentence) => {
        return sentence.endsWith('.') ? sentence : sentence + '.';
    });
}
function translateSentences(sentences) {
    return postData('/api/translations/', { sentences: sentences }, 'POST')
        .then((res) => res.translations)
        .catch(err => console.log(err));
}
export function displayArticleParagraphs(paragraphs, divRoot) {
    // clear div
    while (divRoot.childNodes.length) {
        divRoot.removeChild(divRoot.lastChild);
    }
    // initialize table
    const columnSpecs = [
        { 'name': 'Original Text', 'widthPercent': 47 },
        { 'name': '', 'widthPercent': 3 },
        { 'name': '', 'widthPercent': 3 },
        { 'name': 'Translation', 'widthPercent': 47 }
    ];
    const table = new CustomHTMLTable(divRoot, columnSpecs);
    // fill table // await to ensure that paragraph order is preserved
    function addParagraphAndTranslation(i) {
        return __awaiter(this, void 0, void 0, function* () {
            if (i >= paragraphs.length) {
                return;
            }
            const sentences = splitParagraph(paragraphs[i]);
            yield translateSentences(sentences)
                .then((translations) => {
                translations.forEach((translation, itrans) => {
                    table.addRow([
                        sentences[itrans], '', '', translation
                    ]);
                });
                table.addRow(['', '', '', '']);
            });
            yield addParagraphAndTranslation(i + 1);
        });
    }
    addParagraphAndTranslation(0);
}
