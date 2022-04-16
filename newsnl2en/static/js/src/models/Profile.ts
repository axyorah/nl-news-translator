import { postData, JSONData, APIResponse, ErrorResponse } from "../utils";
import { Tag } from './Tag';
import { Note } from './Note';

// examples:
// https://dreisbach.us/articles/building-dashboards-with-django-and-d3/
// https://medium.com/geekculture/integrating-d3-js-to-a-typescript-react-application-d77580756b20

export interface ProfileJSON {
    id: string;
    username: string;
    tags?: Tag[];
    notes?: Note[];
    user?: string | number;    
    created?: string;
}

export class Profile implements ProfileJSON {
    id: string;
    username: string;
    tags?: Tag[];
    notes?: Note[];
    user?: string | number;    
    created?: string;

    constructor(username: string) {
        this.username = username;
        this.id = null;
        this.user = null;
        this.created = null;
        this.notes = []; // Note[]
        this.tags = []; // Tag[]
    }

    static createFromJson(json: ProfileJSON) {
        const profile = new Profile(json.username);

        Object.keys(json).forEach((key: string) => {
            profile[key] = json[key];
        });
        return profile;
    }

    json(): ProfileJSON {
        const json = {
            id: this.id,
            username: this.username
        }

        Object.keys(this).forEach(key => {
            if (typeof(this[key]) !== 'function' && this[key] !== null) {
                json[key] = this[key];
            }
        }); // add remaining non-null properties, ignore methods

        return json
    }

    update(json: ProfileJSON): Promise<Profile | ErrorResponse> {
        /* updates this and db and returns updated instance */
         const id = this.id || json.id;

        // udpate db
        return postData<ProfileJSON, APIResponse<ProfileJSON> | ErrorResponse> (
            `/api/users/${id}/edit/`, json, 'PUT'
        )
        .then((res: APIResponse<ProfileJSON> | ErrorResponse): Profile => {
            // udpate this
            if (res.data) {
                Object.keys(res.data).forEach((key: string) => {
                    this[key] = res.data[key];
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

    add(): Promise<Profile | ErrorResponse> {
        /* adds this to db, updates this and returns updated instance */
        const data = {
            username: this.username
        };

        // post data to db
        return postData<JSONData, APIResponse<ProfileJSON>>('/api/users/new/', data, 'POST')
        .then((res: APIResponse<ProfileJSON>): Profile => {
            // update this
            Object.keys(res.data).forEach((key: string) => {
                this[key] = res.data[key];
            });
            return this;
        })
        .catch(err => {
            console.log(err);
            return {'errors': err}
        });
    }

    delete(id: string): Promise<JSONData> {
        // deletes note with given id from db; returns promise with success or failure msg
        return postData(`/api/users/${id}/delete/`, {}, 'DELETE');
    }
}