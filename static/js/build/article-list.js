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
