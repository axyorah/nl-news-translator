import { toggleExpandable, fetchArticleParagraphs } from './article-list.js';
import { displayArticleParagraphs } from './article-selected.js';
const expandables = document.querySelectorAll('.expandable');
const articles = document.querySelectorAll('.article');
expandables.forEach((expandable) => {
    toggleExpandable(expandable);
});
articles.forEach((article) => {
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
        console.log(tarContainer);
        tarContainer.style.display = 'block';
        // set title, source and url to selected
        tarTitleNode.innerText = srcTitleNode.innerText;
        tarANode.href = srcANode.href;
        tarSourceNode.innerText = srcSourceNode.innerText;
        // show article body
        fetchArticleParagraphs(srcSourceNode.innerText, srcANode.href)
            .then((res) => {
            displayArticleParagraphs(res.data, tarBodyContainer);
        })
            .catch(err => console.log(err));
    });
});
