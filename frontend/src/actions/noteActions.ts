import { Dispatch } from 'redux';
import { dispatchErrorForAction } from '../utils/errorUtils';

import backend from '../api/backend';

import { UserDetail } from '../types/userTypes';
import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL, 
    
    NOTE_SELECT_QUERY,
    NOTE_SELECT_SUCCESS,
    NOTE_SELECT_FAIL, 
    NOTE_SELECT_RESET,

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
    NOTE_DELETE_FAIL,
    NOTE_DELETE_RESET
} from '../constants/noteConstants';
import {
    Note,
    NoteMinimal,

    NoteListQueryAction,
    NoteListSuccessAction,
    NoteListFailAction,

    NoteSelectQueryAction,
    NoteSelectSuccessAction,
    NoteSelectFailAction,
    NoteSelectResetAction,

    NoteCreateQueryAction,
    NoteCreateSuccessAction,
    NoteCreateFailAction,
    NoteCreateResetAction,

    NoteUpdateQueryAction,
    NoteUpdateSuccessAction,
    NoteUpdateFailAction,
    NoteUpdateResetAction,

    NoteDeleteQueryAction,
    NoteDeleteSuccessAction,
    NoteDeleteFailAction,
    NoteDeleteResetAction
} from '../types/noteTypes';


interface NoteListApiResponse {
    notes: Note[],
    page: number,
    num_pages: number,
    errors? : string,
    detail?: string
}

export const getAllUserNotes = (page: number = 1, tags: string[] = []) => async (dispatch: Dispatch) => {

    try {
        dispatch<NoteListQueryAction>({
            type: NOTE_LIST_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.get<NoteListApiResponse>(
            '/notes/',
            { 
                headers: { 
                    Authorization: `Bearer ${userDetail.token}` 
                },
                params: { 
                    page: page, 
                    tags: tags && tags.length ? tags.join(',') : [] 
                } 
            }
        );
    
        dispatch<NoteListSuccessAction>({
            type: NOTE_LIST_SUCCESS,
            payload: {
                noteList: data.notes,
                page: data.page,
                numPages: data.num_pages
            }
        });

    } catch (e) {
        dispatchErrorForAction<NoteListFailAction, typeof NOTE_LIST_FAIL>(
            dispatch, e, NOTE_LIST_FAIL
        );
    }
};


export const selectUserNote = (noteId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch<NoteSelectQueryAction>({
            type: NOTE_SELECT_QUERY
        });

        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;

        const { data } = await backend.get<Note>(
            `/notes/${noteId}/`,
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteSelectSuccessAction>({
            type: NOTE_SELECT_SUCCESS,
            payload: data
        });

    } catch (e) {
        dispatchErrorForAction<NoteSelectFailAction, typeof NOTE_SELECT_FAIL>(
            dispatch, e, NOTE_SELECT_FAIL
        );
    }
};

export const resetSelectUserNote = (): NoteSelectResetAction => {
    return {
        type: NOTE_SELECT_RESET
    };
};


export const createUserNote = (noteCreate: NoteMinimal) => async (dispatch: Dispatch) => {
    try {
        dispatch<NoteCreateQueryAction>({
            type: NOTE_CREATE_QUERY
        });

        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;

        const { data } = await backend.post<Note>(
            `/notes/`,
            { ...noteCreate },
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteCreateSuccessAction>({
            type: NOTE_CREATE_SUCCESS,
            payload: data
        });

    } catch (e) {
        dispatchErrorForAction<NoteCreateFailAction, typeof NOTE_CREATE_FAIL>(
            dispatch, e, NOTE_CREATE_FAIL
        );
    }
};

export const resetCreateUserNote = (): NoteCreateResetAction => {
    return {
        type: NOTE_CREATE_RESET
    };
};


export const updateUserNote = (noteUpdate: NoteMinimal) => async (dispatch: Dispatch) => {
    try {
        if (!noteUpdate.id) {
            throw new Error('Cannot update note with unknown id');
        }

        dispatch<NoteUpdateQueryAction>({
            type: NOTE_UPDATE_QUERY
        });

        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;

        const { data } = await backend.put<Note>(
            `/notes/${noteUpdate.id}/`,
            { ...noteUpdate },
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteUpdateSuccessAction>({
            type: NOTE_UPDATE_SUCCESS,
            payload: data
        });

    } catch (e) {
        dispatchErrorForAction<NoteUpdateFailAction, typeof NOTE_UPDATE_FAIL>(
            dispatch, e, NOTE_UPDATE_FAIL
        );
    }
};

export const resetUpdateUserNote = (): NoteUpdateResetAction => {
    return {
        type: NOTE_UPDATE_RESET
    };
};


export const deleteUserNote = (noteId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch<NoteDeleteQueryAction>({
            type: NOTE_DELETE_QUERY
        });

        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;

        const { data } = await backend.delete<{ id: string }>(
            `/notes/${noteId}/`,
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteDeleteSuccessAction>({
            type: NOTE_DELETE_SUCCESS,
            payload: data
        });

    } catch (e) {
        dispatchErrorForAction<NoteDeleteFailAction, typeof NOTE_DELETE_FAIL>(
            dispatch, e, NOTE_DELETE_FAIL
        );
    }
};

export const resetDeleteUserNote = (): NoteDeleteResetAction => {
    return {
        type: NOTE_DELETE_RESET
    };
};