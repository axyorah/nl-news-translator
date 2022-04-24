import { Dispatch } from 'redux';

import backend from '../api/backend';

import { UserDetail } from '../types/userTypes';
import {
    NOTE_LIST_QUERY,
    NOTE_LIST_SUCCESS,
    NOTE_LIST_FAIL
} from '../constants/noteConstants';
import {
    Note,
    NoteListQueryAction,
    NoteListSuccessAction,
    NoteListFailAction
} from '../types/noteTypes';


interface NoteListApiResponse {
    notes: Note[],
    page: Number,
    num_pages: Number,
    errors? : string,
    detail?: string
}

export const getAllUserNotes = (page: number = 1) => async (dispatch: Dispatch) => {

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
                params: { page: page },
                headers: { Authorization: `Bearer ${userDetail.token}` } 
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