import { postData } from "../utils";
export class Profile {
    constructor(username) {
        this.username = username;
        this.id = null;
        this.user = null;
        this.created = null;
        this.notes = []; // Note[]
        this.tags = []; // Tag[]
    }
    static createFromJson(json) {
        const profile = new Profile(json.username);
        Object.keys(json).forEach((key) => {
            profile[key] = json[key];
        });
        return profile;
    }
    json() {
        const json = {
            id: this.id,
            username: this.username
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
        return postData(`/api/users/${id}/edit/`, json, 'PUT')
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
            username: this.username
        };
        // post data to db
        return postData('/api/users/new/', data, 'POST')
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
        return postData(`/api/users/${id}/delete/`, {}, 'DELETE');
    }
}
