import { postData } from '../utils.js';
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
    json() {
        const json = {
            id: this.id,
            name: this.name
        }; // this is needed to comply with TagJSON interface
        Object.keys(this).forEach(key => {
            if (typeof (this[key]) !== 'function' && this[key] !== null) {
                json[key] = this[key];
            }
        }); // add remaining non-null properties, ignore methods
        return json;
    }
    update(json) {
        /* updates this and db and returns updated instance */
        const id = this.id || json.id;
        // udpate db        
        return postData(`/api/tags/${id}/edit/`, json, 'PUT')
            .then((res) => {
            // udpate this
            if (res.tag) {
                Object.keys(res.tag).forEach((key) => {
                    this[key] = res.tag[key];
                });
                return this;
            }
            else {
                throw new Error(res.errors);
            }
        })
            .catch(err => {
            return {
                'errors': err
            };
        });
    }
    add() {
        /* adds this to db, updates this and returns updated instance */
        const data = {
            name: this.name
        };
        // post data to db
        return postData('/api/tags/new/', data, 'POST')
            .then((res) => {
            // update this
            Object.keys(res.tag).forEach((key) => {
                this[key] = res.tag[key];
            });
            return this;
        })
            .catch(err => {
            console.log(err);
            return { 'errors': err };
        });
    }
    delete(id) {
        // deletes tag with given id from db; returns promise with success or failure msg
        return postData(`/api/tags/${id}/delete/`, {}, 'DELETE');
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
        // TODO: this should be move to a separate class... 
        // get current children
        const lis = tagsUl.querySelectorAll('li');
        // create new child (tag); should look as:
        const li = document.createElement('li');
        li.setAttribute('class', 'col capsule');
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
