import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL
} from '../constants/noteConstants';
import {
    Note,
    NoteListInfo,
    NoteListAction
} from '../types/noteTypes';
import { Tag }  from '../types/tagTypes';


const initNote: Note = {
    id: '',
    created: '',
    owner: 0,
    side_a: '',
    side_b: '',
    tags: []
};


export const noteListReducers = (
    state: NoteListInfo = { noteList: []}, action: NoteListAction
) => {
    switch (action.type) {
        case NOTE_LIST_QUERY:
            return {
                loading: true,
                noteList: []
            };

        case NOTE_LIST_SUCCESS:
            return {
                loading: false,
                noteList: action.payload
            };

        case NOTE_LIST_FAIL:
            return {
                loading: false,
                errors: action.payload,
                noteList: []
            };

        default:
            return state;
    }
}

