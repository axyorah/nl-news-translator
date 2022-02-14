export function toggleExpandable(expandable) {
    expandable.addEventListener('mouseover', function (evt) {
        const hiddensElements = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden) => {
            hidden.style.display = 'block';
        });
    });
    expandable.addEventListener('mouseout', function (evt) {
        const hiddensElements = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden) => {
            hidden.style.display = 'none';
        });
    });
}
export function fetchArticleParagraphs(source, url) {
    return fetch(`/api/paragraphs?url=${url}&source=${source}`)
        .then((res) => res.json());
}
