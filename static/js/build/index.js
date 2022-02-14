import { toggleExpandable, fetchArticleParagraphs } from './article-list.js';
import { displayArticleParagraphs } from './article-selected.js';
const expandables = document.querySelectorAll('.expandable');
const articles = document.querySelectorAll('.article');
expandables.forEach((expandable) => {
    toggleExpandable(expandable);
});
articles.forEach((article) => {
    article.addEventListener('click', function (evt) {
        const aNode = this.querySelector('a');
        const sourceNode = this.querySelector('#source');
        fetchArticleParagraphs(sourceNode.innerText, aNode.href)
            .then((res) => {
            const articleSelectedContainer = document.querySelector('#article-selected');
            displayArticleParagraphs(res.data, articleSelectedContainer);
        })
            .catch(err => console.log(err));
    });
});
