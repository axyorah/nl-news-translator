import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL
} from '../constants/noteConstants';

import { Tag } from './tagTypes';


export interface Note {
    id: string,
    created: string,
    owner: number,
    side_a: string,
    side_b: string,
    tags: Tag[]
}

export interface NoteListDetail {
    noteList: Note[],
    page: number,
    numPages: number
}

export interface NoteListInfo {
    noteListDetail: NoteListDetail,
    loading?: boolean,
    errors?: string
}

export interface NoteListQueryAction {
    type: typeof NOTE_LIST_QUERY
}

export interface NoteListSuccessAction {
    type: typeof NOTE_LIST_SUCCESS,
    payload: NoteListDetail
}

export interface NoteListFailAction {
    type: typeof NOTE_LIST_FAIL,
    payload: string
}

export type NoteListAction = 
    NoteListQueryAction | 
    NoteListSuccessAction | 
    NoteListFailAction;