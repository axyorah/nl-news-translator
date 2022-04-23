import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL
} from '../constants/noteConstants';

import { Tag } from './tagTypes';


export interface Note {
    id: string,
    created: string,
    owner: Number,
    side_a: string,
    side_b: string,
    tags: Tag[]
}

export interface NoteListInfo {
    noteList: Note[],
    loading?: boolean,
    errors?: string
}

export interface NoteListQueryAction {
    type: typeof NOTE_LIST_QUERY
}

export interface NoteListSuccessAction {
    type: typeof NOTE_LIST_SUCCESS,
    payload: Note[]
}

export interface NoteListFailAction {
    type: typeof NOTE_LIST_FAIL,
    payload: string
}

export type NoteListAction = 
    NoteListQueryAction | 
    NoteListSuccessAction | 
    NoteListFailAction;