import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL,

    NOTE_SELECT_QUERY,
    NOTE_SELECT_SUCCESS,
    NOTE_SELECT_FAIL
} from '../constants/noteConstants';
import {
    Note,
    NoteListDetail,
    NoteListInfo,
    NoteListAction,
    NoteSelectInfo,
    NoteSelectAction
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
    state: NoteListInfo = { noteListDetail: initNoteListDetail }, 
    action: NoteListAction
): NoteListInfo => {
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

export const noteSelectReducers = (
    state: NoteSelectInfo = { noteSelect: initNote }, 
    action: NoteSelectAction
): NoteSelectInfo => {
    switch (action.type) {
        case NOTE_SELECT_QUERY:
            return {
                loading: true,
                noteSelect: initNote
            };

        case NOTE_SELECT_SUCCESS:
            return {
                loading: false,
                noteSelect: action.payload
            };

        case NOTE_SELECT_FAIL:
            return {
                loading: false,
                noteSelect: initNote,
                errors: action.payload
            };

        default:
            return state;
    }
};