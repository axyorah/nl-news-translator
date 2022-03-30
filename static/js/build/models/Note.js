import { postData } from "../utils.js";
export class Note {
    constructor(side_a, side_b) {
        this.side_a = side_a;
        this.side_b = side_b;
        this.id = null;
        this.created = null;
        this.owner = null; // owner id!!!
        this.tags = []; // Tag[]
    }
    static createFromJson(json) {
        const note = new Note(json.side_a, json.side_b);
        Object.keys(json).forEach((key) => {
            note[key] = json[key];
        });
        return note;
    }
    json() {
        const json = {
            id: this.id,
            side_a: this.side_a,
            side_b: this.side_b,
        };
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
        return postData(`/api/notes/${id}/edit/`, json, 'PUT')
            .then((res) => {
            // udpate this
            if (res.data) {
                Object.keys(res.data).forEach((key) => {
                    this[key] = res.data[key];
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
            side_a: this.side_a,
            side_b: this.side_b
        };
        // post data to db
        return postData('/api/notes/new/', data, 'POST')
            .then((res) => {
            // update this
            Object.keys(res.data).forEach((key) => {
                this[key] = res.data[key];
            });
            return this;
        })
            .catch(err => {
            console.log(err);
            return { 'errors': err };
        });
    }
    delete(id) {
        // deletes note with given id from db; returns promise with success or failure msg
        return postData(`/api/notes/${id}/delete/`, {}, 'DELETE');
    }
}
