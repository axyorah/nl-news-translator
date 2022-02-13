export function toggleExpandable(expandable) {
    expandable.addEventListener('mouseover', function (evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'block';
    });
    expandable.addEventListener('mouseout', function (evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'none';
    });
}
export function fetchArticleParagraphs(source, url) {
    return fetch(`/api/paragraphs?url=${url}&source=${source}`)
        .then((res) => res.json());
}
export function displayArticleParagraphs(res, div) {
    // this should be moved to `article-selected.js`
    div.innerHTML = JSON.stringify(res.data, null, 4);
}
// expandables.forEach((expandable: HTMLElement): void => {
//     expandable.addEventListener('mouseover', function(evt) {
//         const hidden: HTMLElement = this.querySelector('.hidden');
//         hidden.style.display = 'block';
//     });
//     expandable.addEventListener('mouseout', function(evt) {
//         const hidden: HTMLElement = this.querySelector('.hidden');
//         hidden.style.display = 'none';
//     })
// });
// articles.forEach((article: HTMLElement): void => {
//     article.addEventListener('click', function(evt) {
//         const aNode: HTMLAnchorElement = this.querySelector('a');
//         const sourceNode: HTMLElement = this.querySelector('#source');
//         const params = {
//             url: aNode.href,
//             source: sourceNode.innerText
//         }
//         console.log(params);
//         fetch(`/api/paragraphs?url=${params['url']}&source=${params['source']}`)
//             .then((res: Response): Promise<ParagraphResponse> => res.json())
//             .then((res: ParagraphResponse): void => {
//                 // this should be moved to `article-selected.js`
//                 document.querySelector(
//                     '#article-selected'
//                 ).innerHTML = JSON.stringify(res.data, null, 4);
//             })
//             .catch(err => console.log(err));
//     })
// })
