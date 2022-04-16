import { Paragraph } from "./article-list";
import { postData, JSONData, Method } from "./utils";
import { ColumnSpec, CustomHTMLTable } from "./CustomHTMLTable";

export type Sentence = string;
export type Translation = string;

export interface SentenceRequest extends JSONData {
    sentences: Sentence[];
}

export interface TranslationResponse extends JSONData {
    translations: Translation[];
}

function splitParagraph(paragraphRaw: Paragraph): Sentence[] {
    return paragraphRaw
        .split('. ')
        .map((sentence: Sentence): Sentence => {
            return sentence.endsWith('.') ? sentence : sentence + '.'
        });
}

function translateSentences(sentences: Sentence[]): Promise<Translation[]> {
    return postData<SentenceRequest, JSONData>(
        '/api/translations/', { sentences: sentences }, 'POST'
        )
        .then((res: JSONData) => {
            return res.translations;
        })
        .catch(err => console.log(err));
}

export function displayArticleParagraphs(
    paragraphs: Paragraph[], divRoot: HTMLElement
): void {
    // clear div
    while (divRoot.childNodes.length) {
        divRoot.removeChild(divRoot.lastChild);
    }

    // initialize table
    const columnSpecs = [
        {'name': 'Original Text', 'widthPercent': 47},
        {'name': '', 'widthPercent': 3},
        {'name': '', 'widthPercent': 3},
        {'name': 'Translation', 'widthPercent': 47}
    ] as ColumnSpec[];
    const table = new CustomHTMLTable(divRoot, columnSpecs);

    // fill table // await to ensure that paragraph order is preserved
    async function addParagraphAndTranslation(i: number): Promise<void> {
        if (i >= paragraphs.length) {
            return;
        }
        const sentences = splitParagraph(paragraphs[i]);
        await translateSentences(sentences)
            .then((translations: Translation[]): void => {
                if (!translations || !translations.length) {
                    throw new Error('No translations received :(');
                }
                translations.forEach(
                    (translation: Translation, itrans: number): void => {
                    table.addRow([
                        sentences[itrans], '', '', translation
                    ]);
                });
                table.addRow(['', '', '', '']);
            })
            .catch(err => console.log(err));

        await addParagraphAndTranslation(i + 1);
    }

    addParagraphAndTranslation(0);
}