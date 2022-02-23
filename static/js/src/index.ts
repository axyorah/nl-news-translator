import {
    ParagraphResponse,
    fetchArticleParagraphs
} from './article-list';

import { Expandable, toggleExpandable, GlobalExpandable, toggleGlobalExpandable } from './expandable';
import { displayArticleParagraphs } from './article-selected';

const articles: NodeListOf<HTMLElement> = document.querySelectorAll('.article');
const expandables: NodeListOf<Expandable> = document.querySelectorAll('.expandable');
const globalExpandables: NodeListOf<GlobalExpandable> = document.querySelectorAll('.expandable-global');

expandables.forEach((expandable: Expandable): void => {
    toggleExpandable(expandable);
});

globalExpandables.forEach((expandable: GlobalExpandable): void => {
    toggleGlobalExpandable(expandable);
})

articles.forEach((article: HTMLElement): void => {
    /*
    on click: 
    - fetch article paragraphs from source
    - translate paragraphs with model from HuggingFace at /api/translations
    - display original and translated paragraphs in a "table"
    */ 
    article.addEventListener('click', function(evt) {
        // get all necessary tar html elements
        const tarContainer: HTMLElement = document.querySelector('#article-selected-container');
        const tarBodyContainer: HTMLElement = tarContainer.querySelector('#article-selected-body');

        const tarTitleNode: HTMLElement = tarContainer.querySelector('#article-selected-title');
        const tarANode: HTMLAnchorElement = tarContainer.querySelector('a');
        const tarSourceNode: HTMLElement = tarContainer.querySelector('#article-selected-source');

        // get title, source and url from list (src)
        const srcTitleNode: HTMLElement = this.querySelector('.li-title');
        const srcANode: HTMLAnchorElement = this.querySelector('a');
        const srcSourceNode: HTMLElement = this.querySelector('#source');

        // make container for selected article visible
        tarContainer.style.display = 'block';

        // set title, source and url to selected
        tarTitleNode.innerText = srcTitleNode.innerText;
        tarANode.href = srcANode.href;
        tarSourceNode.innerText = srcSourceNode.innerText;

        // show article body
        fetchArticleParagraphs(srcSourceNode.innerText, srcANode.href)
        .then((res: ParagraphResponse) => {
            if (res && res.data) {
                // displays original and translated paragraphs
                displayArticleParagraphs(res.data, tarBodyContainer);
            } else {
                throw new Error(`Couldn't fetch any data from ${srcANode.href}`);
            }
        })
        .catch(err => console.log(err));
    })
});
