import { Dispatch } from 'redux';

import backend from '../api/backend';

import { UserDetail } from '../types/userTypes';
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

    NOTE_DELETE_QUERY,
    NOTE_DELETE_SUCCESS,
    NOTE_DELETE_FAIL,
    NOTE_UPDATE_RESET, 
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

    NoteUpdateQueryAction,
    NoteUpdateSuccessAction,
    NoteUpdateFailAction,

    NoteDeleteQueryAction,
    NoteDeleteSuccessAction,
    NoteDeleteFailAction,

    NoteDeleteInfo,
    NoteUpdateResetAction
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
        if (typeof e === 'string') {
            dispatch<NoteListFailAction>({
                type: NOTE_LIST_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NoteListFailAction>({
                type: NOTE_LIST_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NoteListFailAction>({
                type: NOTE_LIST_FAIL,
                payload: 'Something went wrong while fetching notes...'
            });
        }
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
        if (typeof e === 'string') {
            dispatch<NoteSelectFailAction>({
                type: NOTE_SELECT_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NoteSelectFailAction>({
                type: NOTE_SELECT_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NoteSelectFailAction>({
                type: NOTE_SELECT_FAIL,
                payload: `Something went wrong while fetching note ${noteId}...`
            });
        }
    }
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
            `/notes/${noteUpdate.id}/edit/`,
            { ...noteUpdate },
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteUpdateSuccessAction>({
            type: NOTE_UPDATE_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<NoteUpdateFailAction>({
                type: NOTE_UPDATE_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NoteUpdateFailAction>({
                type: NOTE_UPDATE_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NoteUpdateFailAction>({
                type: NOTE_UPDATE_FAIL,
                payload: `Something went wrong while updating note ${noteUpdate.id}...`
            });
        }
    }
};


export const resetUserNote = (): NoteUpdateResetAction => {
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
            `/notes/${noteId}/delete/`,
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );

        dispatch<NoteDeleteSuccessAction>({
            type: NOTE_DELETE_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<NoteDeleteFailAction>({
                type: NOTE_DELETE_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NoteDeleteFailAction>({
                type: NOTE_DELETE_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NoteDeleteFailAction>({
                type: NOTE_DELETE_FAIL,
                payload: `Something went wrong while deleting note ${noteId}...`
            });
        }
    }
};