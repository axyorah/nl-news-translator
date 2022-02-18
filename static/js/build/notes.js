import { postData } from './utils.js';
const addPartialTagName = document.querySelector('#add-partial-tag-name');
const addPartialTagBtn = document.querySelector('#add-partial-tag-btn');
const tagsUl = document.querySelector('#id_tags');
function createPartialTag(name) {
    const data = {
        name: name
    };
    return postData('/api/tags/new/', data, 'POST')
        .catch(err => {
        console.log(err);
        return { 'errors': err };
    });
}
function addTagToForm(tag) {
    // get current children
    const lis = tagsUl.querySelectorAll('li');
    // create new child (tag); should look as:
    // <li>
    //   <label for="id_tags_<tag index>">
    //     <input type="checkbox" name="tags" value="<tag id>" id="id_tags_<tag index>"/>
    //     "< tag.name >"
    //   </>
    // </li>
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.setAttribute('for', `id_tags_${lis.length}`);
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'tags');
    input.setAttribute('value', tag.id);
    input.setAttribute('id', `id_tags_${lis.length}`);
    // add all children
    tagsUl.appendChild(li);
    li.appendChild(label);
    label.appendChild(input);
    label.append(` ${tag.name}`);
}
addPartialTagBtn.addEventListener('click', function (evt) {
    const name = addPartialTagName.value;
    if (!name) {
        throw new Error('No tag name specified!');
    }
    createPartialTag(name)
        .then((res) => {
        console.log(res);
        if (res.errors) {
            throw new Error(res.errors);
        }
        addTagToForm(res.tag);
    })
        .catch(err => console.log(err));
});
