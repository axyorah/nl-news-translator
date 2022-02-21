import { toggleExpandable, fetchArticleParagraphs } from './article-list.js';
import { displayArticleParagraphs } from './article-selected.js';
import { Collapsible } from './Collapsible.js';
const expandables = document.querySelectorAll('.expandable');
const collapsibles = document.querySelectorAll('.collapsible');
const articles = document.querySelectorAll('.article');
expandables.forEach((expandable) => {
    toggleExpandable(expandable);
});
const decoratedCollapsibles = [];
collapsibles.forEach(element => {
    decoratedCollapsibles.push(new Collapsible(element));
    //decoratedCollapsibles.push(collapsible);
});
articles.forEach((article) => {
    /*
    on click:
    - fetch article paragraphs from source
    - translate paragraphs with model from HuggingFace at /api/translations
    - display original and translated paragraphs in a "table"
    */
    article.addEventListener('click', function (evt) {
        // get all necessary tar html elements
        const tarContainer = document.querySelector('#article-selected-container');
        const tarBodyContainer = tarContainer.querySelector('#article-selected-body');
        const tarTitleNode = tarContainer.querySelector('#article-selected-title');
        const tarANode = tarContainer.querySelector('a');
        const tarSourceNode = tarContainer.querySelector('#article-selected-source');
        // get title, source and url from list (src)
        const srcTitleNode = this.querySelector('.li-title');
        const srcANode = this.querySelector('a');
        const srcSourceNode = this.querySelector('#source');
        // make container for selected article visible
        tarContainer.style.display = 'block';
        // set title, source and url to selected
        tarTitleNode.innerText = srcTitleNode.innerText;
        tarANode.href = srcANode.href;
        tarSourceNode.innerText = srcSourceNode.innerText;
        // show article body
        fetchArticleParagraphs(srcSourceNode.innerText, srcANode.href)
            .then((res) => {
            if (res && res.data) {
                // displays original and translated paragraphs
                displayArticleParagraphs(res.data, tarBodyContainer);
            }
            else {
                throw new Error(`Couldn't fetch any data from ${srcANode.href}`);
            }
        })
            .catch(err => console.log(err));
    });
});
