const expandables = document.querySelectorAll('.expandable');
const articles = document.querySelectorAll('.article');

expandables.forEach(expandable => {
    expandable.addEventListener('mouseover', function(evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'block';
    });
    expandable.addEventListener('mouseout', function(evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'none';
    })
});

articles.forEach(article => {
    article.addEventListener('click', async function(evt) {
        const aNode = this.querySelector('a');
        const sourceNode = this.querySelector('#source');
        
        const params = {
            url: aNode.href,
            source: sourceNode.innerText
        }

        console.log(params);

        fetch(`/api/paragraphs?url=${params['url']}&source=${params['source']}`)
            .then(res => res.json())
            .then(res => {
                // this should be moved to `article-selected.js`
                document.querySelector(
                    '#article-selected'
                ).innerHTML = JSON.stringify(res.data, null, 4);
            })
            .catch(err => console.log(err));
    })
})

