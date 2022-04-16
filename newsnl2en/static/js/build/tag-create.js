import { Tag } from './models/Tag.js';
const addPartialTagName = document.querySelector('#add-partial-tag-name');
const addPartialTagBtn = document.querySelector('#add-partial-tag-btn');
const tagsUl = document.querySelector('#id_tags');
addPartialTagBtn.addEventListener('click', function (evt) {
    const tag = Tag.createFromFormField(addPartialTagName);
    tag.add() // add to db and update this
        .then((maybeTag) => {
        maybeTag.addToForm(tagsUl);
    }) // add updated tag to form
        .catch(err => console.log(err));
});
window.addEventListener('load', function (evt) {
    // restyle form
    // tags should be displayed as a row of capsules
    tagsUl.setAttribute('class', 'row');
    tagsUl.style.listStyleType = 'none';
    const lis = tagsUl.querySelectorAll('li');
    lis.forEach((li) => {
        li.setAttribute('class', 'col capsule');
    });
});
