import { Tag } from './Tag.js';
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
