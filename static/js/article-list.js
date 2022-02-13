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
        const a = this.querySelector('a');
        console.log(a.href);
        console.log(a.innerText);
        const url = a.href;
        const source = a.innerText;

        //const res = await fetch(url).catch(err => console.log(err));
    })
})

