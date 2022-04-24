import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL
} from '../constants/noteConstants';
import {
    Note,
    NoteListDetail,
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

const initNoteListDetail: NoteListDetail = {
    noteList: [],
    page: 0,
    numPages: 0
};


export const noteListReducers = (
    state: NoteListInfo = { noteListDetail: initNoteListDetail }, action: NoteListAction
) => {
    switch (action.type) {
        case NOTE_LIST_QUERY:
            return {
                loading: true,
                noteListDetail: initNoteListDetail
            };

        case NOTE_LIST_SUCCESS:
            return {
                loading: false,
                noteListDetail: action.payload
            };

        case NOTE_LIST_FAIL:
            return {
                loading: false,
                errors: action.payload,
                noteListDetail: initNoteListDetail
            };

        default:
            return state;
    }
}

