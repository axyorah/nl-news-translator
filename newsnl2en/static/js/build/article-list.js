export function fetchArticleParagraphs(source, url) {
    return fetch(`/api/paragraphs?url=${url}&source=${source}`)
        .then((res) => res.json());
}
