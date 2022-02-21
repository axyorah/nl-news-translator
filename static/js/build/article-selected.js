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
import { CustomHTMLTable } from "./CustomHTMLTable.js";
function splitParagraph(paragraphRaw) {
    return paragraphRaw
        .split('. ')
        .map((sentence) => {
        return sentence.endsWith('.') ? sentence : sentence + '.';
    });
}
function translateSentences(sentences) {
    return postData('/api/translations/', { sentences: sentences }, 'POST')
        .then((res) => {
        return res.translations;
    })
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
                if (!translations || !translations.length) {
                    throw new Error('No translations received :(');
                }
                translations.forEach((translation, itrans) => {
                    table.addRow([
                        sentences[itrans], '', '', translation
                    ]);
                });
                table.addRow(['', '', '', '']);
            })
                .catch(err => console.log(err));
            yield addParagraphAndTranslation(i + 1);
        });
    }
    addParagraphAndTranslation(0);
}
