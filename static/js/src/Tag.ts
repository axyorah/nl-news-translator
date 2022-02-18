import { postData, JSONData } from './utils';

export interface TagJSON {
    id: string;
    name: string;
}

export interface TagResponse extends JSONData {
    tag: TagJSON
}

export interface ErrorResponse extends JSONData {
    errors: string
}

export interface TagsUL extends HTMLUListElement {
    childNode?: TagsLI;
}

export interface TagsLI extends HTMLLIElement {
    childNode: TagsLILabel;
}

export interface TagsLILabel extends HTMLLabelElement {
    childNode: TagsLIInput
}

export interface TagsLIInput extends HTMLInputElement {
    type: "checkbox";
    name: "tags";
    value: string;
    id: string;
}

export class Tag implements TagJSON {
    name: string;
    id: string | null;
    owner?: string;
    created?: string;

    constructor(name: string) {
        this.name = name;
        this.id = null;
        this.owner = null;
        this.created = null;
    }

    static createFromFormField(field: HTMLInputElement): Tag {
        const name: string = field.value;
        if (!name) {
            throw new Error('No tag name specified!');
        }
        return new Tag(name);
    }

    static createFromJson(json: TagJSON): Tag {
        const tag = new Tag(json.name);
        Object.keys(json).forEach((key: string) => {
            tag[key] = json[key];
        });
        return tag;
    }

    update(json: TagJSON): Tag {
        /* updates this and returns updated instance */
        // TODO: should also update DB
        Object.keys(json).forEach((key: string) => {
            this[key] = json[key];
        });
        return this;
    }

    add(): Promise<Tag | ErrorResponse> {
        /* adds this to db via api, updates this and returns updated instance */
        const data = {
            name: this.name
        }
        return postData<JSONData, TagResponse>('/api/tags/new/', data, 'POST')
        .then((res: TagResponse): Tag => {
            return this.update(res.tag);
        })
        .catch(err => {
            console.log(err);
            return {'errors': err}
        });
    }

    addToForm(tagsUl: TagsUL): void {
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