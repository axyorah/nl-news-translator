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

    json(): TagJSON {
        const json = {
            id: this.id,
            name: this.name
        }; // this is needed to comply with TagJSON interface

        Object.keys(this).forEach(key => {
            if (typeof(this[key]) !== 'function' && this[key] !== null) {
                json[key] = this[key];
            }
        }); // add remaining non-null properties, ignore methods

        return json;
    }

    update(json: TagJSON): Promise<Tag | ErrorResponse> {
        /* updates this and db and returns updated instance */
         const id = this.id || json.id;

        // udpate db        
        return postData<TagJSON, TagResponse | ErrorResponse>(
            `/api/tags/${id}/edit/`, json, 'PUT'
        )
        .then((res: TagResponse | ErrorResponse): Tag => {
            // udpate this
            if (res.tag) {
                Object.keys(res.tag).forEach((key: string) => {
                    this[key] = res.tag[key];
                });
                return this;
            } else {
                throw new Error(res.errors)
            }
        })
        .catch(err => {
            return {
                'errors': err
            }
        });
    }

    add(): Promise<Tag | ErrorResponse> {
        /* adds this to db, updates this and returns updated instance */
        const data = {
            name: this.name
        }
        // post data to db
        return postData<JSONData, TagResponse>('/api/tags/new/', data, 'POST')
        .then((res: TagResponse): Tag => {
            // update this
            Object.keys(res.tag).forEach((key: string) => {
                this[key] = res.tag[key];
            });
            return this;
        })
        .catch(err => {
            console.log(err);
            return {'errors': err}
        });
    }

    delete(id: string): Promise<JSONData> {
        // deletes tag with given id from db; returns promise with success or failure msg
        return postData(`/api/tags/${id}/delete/`, {}, 'DELETE');
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
        // TODO: this should be move to a separate class... 
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