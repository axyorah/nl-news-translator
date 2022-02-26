import { Tag, TagJSON, TagsUL } from './models/Tag';
import { ErrorResponse } from './utils';


const addPartialTagName: HTMLInputElement = document.querySelector('#add-partial-tag-name');
const addPartialTagBtn: HTMLButtonElement = document.querySelector('#add-partial-tag-btn');
const tagsUl: TagsUL = document.querySelector('#id_tags');


addPartialTagBtn.addEventListener('click', function(evt): void {
    
    const tag = Tag.createFromFormField(addPartialTagName);
    tag.add() // add to db and update this
        .then((maybeTag: Tag | ErrorResponse): void => {
            maybeTag.addToForm(tagsUl);
        }) // add updated tag to form
        .catch(err => console.log(err));
})

window.addEventListener('load', function(evt){
    // restyle form
    // tags should be displayed as a row of capsules
    tagsUl.setAttribute('class', 'row');
    tagsUl.style.listStyleType = 'none';

    const lis: NodeListOf<HTMLLIElement> = tagsUl.querySelectorAll('li');
    lis.forEach((li: HTMLLIElement) => {
        li.setAttribute('class', 'col capsule');
    });
})