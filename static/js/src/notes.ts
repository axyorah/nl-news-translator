import { Tag, TagJSON, ErrorResponse, TagsUL } from './Tag';


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