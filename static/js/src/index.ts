import {
    ParagraphResponse,
    Expandable,
    toggleExpandable,
    fetchArticleParagraphs,
    displayArticleParagraphs
} from './article-list';


const expandables: NodeListOf<Expandable> = document.querySelectorAll('.expandable');
const articles: NodeListOf<HTMLElement> = document.querySelectorAll('.article');

expandables.forEach((expandable: Expandable): void => {
    toggleExpandable(expandable);
});

articles.forEach((article: HTMLElement): void => {
    article.addEventListener('click', function(evt) {
        const aNode: HTMLAnchorElement = this.querySelector('a');
        const sourceNode: HTMLElement = this.querySelector('#source');

        fetchArticleParagraphs(sourceNode.innerText, aNode.href)
        .then((res: ParagraphResponse) => {
            const articleSelectedContainer: HTMLElement = document.querySelector('#article-selected');
            displayArticleParagraphs(res, articleSelectedContainer);
        })
        .catch(err => console.log(err));
    })
})
