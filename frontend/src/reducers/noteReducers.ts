import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL,

    NOTE_SELECT_QUERY,
    NOTE_SELECT_SUCCESS,
    NOTE_SELECT_FAIL,

    NOTE_CREATE_QUERY,
    NOTE_CREATE_SUCCESS,
    NOTE_CREATE_FAIL,
    NOTE_CREATE_RESET,

    NOTE_UPDATE_QUERY,
    NOTE_UPDATE_SUCCESS,
    NOTE_UPDATE_FAIL,
    NOTE_UPDATE_RESET,

    NOTE_DELETE_QUERY,
    NOTE_DELETE_SUCCESS,
    NOTE_DELETE_FAIL
} from '../constants/noteConstants';
import {
    Note,
    NoteListDetail,
    NoteListInfo,
    NoteListAction,
    NoteSelectInfo,
    NoteSelectAction,
    NoteCreateInfo,
    NoteCreateAction,
    NoteUpdateInfo,
    NoteUpdateAction,
    NoteDeleteInfo,
    NoteDeleteAction
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


export const noteCreateReducers = (
    state: NoteCreateInfo = {}, 
    action: NoteCreateAction
): NoteCreateInfo => {
    switch (action.type) {
        case NOTE_CREATE_QUERY:
            return {
                loading: true
            };

        case NOTE_CREATE_SUCCESS:
            return {
                loading: false,
                noteCreate: action.payload
            };

        case NOTE_CREATE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case NOTE_CREATE_RESET:
            return {};

        default:
            return state;
    }
};


export const noteUpdateReducers = (
    state: NoteUpdateInfo = { noteUpdate: initNote }, 
    action: NoteUpdateAction
): NoteUpdateInfo => {
    switch (action.type) {
        case NOTE_UPDATE_QUERY:
            return {
                loading: true
            };

        case NOTE_UPDATE_SUCCESS:
            return {
                loading: false,
                noteUpdate: action.payload
            };

        case NOTE_UPDATE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case NOTE_UPDATE_RESET:
            return {};

        default:
            return state;
    }
};


export const noteDeleteReducers = (
    state: NoteDeleteInfo = { noteDelete: { id: '' } }, 
    action: NoteDeleteAction
): NoteDeleteInfo => {
    switch (action.type) {
        case NOTE_DELETE_QUERY:
            return {
                loading: true
            };

        case NOTE_DELETE_SUCCESS:
            return {
                loading: false,
                noteDelete: action.payload
            };

        case NOTE_DELETE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        default:
            return state;
    }
};