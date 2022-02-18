import { postData } from './utils.js';
export class Tag {
    constructor(name) {
        this.name = name;
        this.id = null;
        this.owner = null;
        this.created = null;
    }
    static createFromFormField(field) {
        const name = field.value;
        if (!name) {
            throw new Error('No tag name specified!');
        }
        return new Tag(name);
    }
    static createFromJson(json) {
        const tag = new Tag(json.name);
        Object.keys(json).forEach((key) => {
            tag[key] = json[key];
        });
        return tag;
    }
    update(json) {
        /* updates this and returns updated instance */
        // TODO: should also update DB
        Object.keys(json).forEach((key) => {
            this[key] = json[key];
        });
        return this;
    }
    add() {
        /* adds this to db via api, updates this and returns updated instance */
        const data = {
            name: this.name
        };
        return postData('/api/tags/new/', data, 'POST')
            .then((res) => {
            return this.update(res.tag);
        })
            .catch(err => {
            console.log(err);
            return { 'errors': err };
        });
    }
    addToForm(tagsUl) {
        /*
        adds this to form UL element
        where all li elements are tags with the following format:
        <li>
          <label for="id_tags_<tag index>">
            <input
              type="checkbox" name="tags"
              value="<tag id>" id="id_tags_<tag index>"
            />
            "< tag.name >"
          </>
        </li>
        */
        // get current children
        const lis = tagsUl.querySelectorAll('li');
        // create new child (tag); should look as:
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.setAttribute('for', `id_tags_${lis.length}`);
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'tags');
        input.setAttribute('value', this.id);
        input.setAttribute('id', `id_tags_${lis.length}`);
        // add all children
        tagsUl.appendChild(li);
        li.appendChild(label);
        label.appendChild(input);
        label.append(` ${this.name}`);
    }
}
