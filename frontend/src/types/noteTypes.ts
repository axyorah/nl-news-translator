import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL,

    NOTE_SELECT_QUERY,
    NOTE_SELECT_SUCCESS,
    NOTE_SELECT_FAIL,

    NOTE_UPDATE_QUERY,
    NOTE_UPDATE_SUCCESS,
    NOTE_UPDATE_FAIL,
    NOTE_UPDATE_RESET,

    NOTE_DELETE_QUERY,
    NOTE_DELETE_SUCCESS,
    NOTE_DELETE_FAIL,
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

export interface NoteMinimal {
    id: string,
    created?: string,
    owner: number,
    side_a: string,
    side_b: string,
    tags: string[]
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


export interface NoteSelectInfo {
    noteSelect: Note,
    loading?: boolean,
    errors?: string
}

export interface NoteSelectQueryAction {
    type: typeof NOTE_SELECT_QUERY
}

export interface NoteSelectSuccessAction {
    type: typeof NOTE_SELECT_SUCCESS,
    payload: Note
}

export interface NoteSelectFailAction {
    type: typeof NOTE_SELECT_FAIL,
    payload: string
}

export type NoteSelectAction = 
    NoteSelectQueryAction | 
    NoteSelectSuccessAction | 
    NoteSelectFailAction;


export interface NoteUpdateInfo {
    noteUpdate?: Note,
    loading?: boolean,
    errors?: string
}

export interface NoteUpdateQueryAction {
    type: typeof NOTE_UPDATE_QUERY
}

export interface NoteUpdateSuccessAction {
    type: typeof NOTE_UPDATE_SUCCESS,
    payload: Note
}

export interface NoteUpdateFailAction {
    type: typeof NOTE_UPDATE_FAIL,
    payload: string
}

export interface NoteUpdateResetAction {
    type: typeof NOTE_UPDATE_RESET,
}

export type NoteUpdateAction = 
    NoteUpdateQueryAction | 
    NoteUpdateSuccessAction | 
    NoteUpdateFailAction |
    NoteUpdateResetAction;


export interface NoteDeleteInfo {
    noteDelete?: { id: string },
    loading?: boolean,
    errors?: string
}

export interface NoteDeleteQueryAction {
    type: typeof NOTE_DELETE_QUERY
}

export interface NoteDeleteSuccessAction {
    type: typeof NOTE_DELETE_SUCCESS,
    payload: { id: string }
}

export interface NoteDeleteFailAction {
    type: typeof NOTE_DELETE_FAIL,
    payload: string
}

export type NoteDeleteAction = 
    NoteDeleteQueryAction | 
    NoteDeleteSuccessAction | 
    NoteDeleteFailAction;