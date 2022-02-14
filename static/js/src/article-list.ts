export type ParagraphsRaw = string[];
export type ParagraphsParsed = string[][];

export interface ParagraphResponse {
    data: ParagraphsRaw;
}

export interface Expandable extends HTMLElement {
    class: 'expandable';
    childNode: {
        class: 'hidden'
    }
}

export function toggleExpandable(expandable: Expandable): void {
    expandable.addEventListener('mouseover', function(evt) {
        const hidden: HTMLElement = this.querySelector('.hidden');
        hidden.style.display = 'block';
    });
    expandable.addEventListener('mouseout', function(evt) {
        const hidden: HTMLElement = this.querySelector('.hidden');
        hidden.style.display = 'none';
    });
}

export function fetchArticleParagraphs(
    source: string, url: string
): Promise<ParagraphResponse> {
    return fetch(`/api/paragraphs?url=${url}&source=${source}`)
        .then((res: Response): Promise<ParagraphResponse> => res.json());
}

export function displayArticleParagraphs(
    res: ParagraphResponse, div: HTMLElement
): void {
    // this should be moved to `article-selected.js`
    div.innerHTML = JSON.stringify(res.data, null, 4);
}
