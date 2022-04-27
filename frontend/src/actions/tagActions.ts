import { Dispatch } from 'redux';

import backend from '../api/backend';

import { UserDetail } from '../types/userTypes';
import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL,

    TAG_SELECT_QUERY,
    TAG_SELECT_SUCCESS,
    TAG_SELECT_FAIL,
    TAG_SELECT_RESET,

    TAG_CREATE_QUERY,
    TAG_CREATE_SUCCESS,
    TAG_CREATE_FAIL,
    TAG_CREATE_RESET,

    TAG_UPDATE_QUERY,
    TAG_UPDATE_SUCCESS,
    TAG_UPDATE_FAIL,
    TAG_UPDATE_RESET,

    TAG_DELETE_QUERY,
    TAG_DELETE_SUCCESS,
    TAG_DELETE_FAIL,
    TAG_DELETE_RESET
} from '../constants/tagConstants';
import {
    Tag,
    TagListQueryAction,
    TagListSuccessAction,
    TagListFailAction,

    TagSelectQueryAction,
    TagSelectSuccessAction,
    TagSelectFailAction,
    TagSelectResetAction,

    TagCreateQueryAction,
    TagCreateSuccessAction,
    TagCreateFailAction,
    TagCreateResetAction,

    TagUpdateQueryAction,
    TagUpdateSuccessAction,
    TagUpdateFailAction,
    TagUpdateResetAction,

    TagDeleteQueryAction,
    TagDeleteSuccessAction,
    TagDeleteFailAction,
    TagDeleteResetAction,
    TagMinimal,
} from '../types/tagTypes';


interface TagListApiResponse {
    tags: Tag[],
    errors? : string,
    detail?: string
}

export const getAllUserTags = () => async (dispatch: Dispatch) => {

    try {
        dispatch<TagListQueryAction>({
            type: TAG_LIST_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.get<TagListApiResponse>(
            '/tags/',
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );
    
        dispatch<TagListSuccessAction>({
            type: TAG_LIST_SUCCESS,
            payload: data.tags
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<TagListFailAction>({
                type: TAG_LIST_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<TagListFailAction>({
                type: TAG_LIST_FAIL,
                payload: e.message
            });
        } else {
            dispatch<TagListFailAction>({
                type: TAG_LIST_FAIL,
                payload: 'Something went wrong while fetching user tags...'
            });
        }
    }
};


export const selectUserTag = (id: string) => async (dispatch: Dispatch) => {

    try {
        dispatch<TagSelectQueryAction>({
            type: TAG_SELECT_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.get<Tag>(
            `/tags/${id}/`,
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );
    
        dispatch<TagSelectSuccessAction>({
            type: TAG_SELECT_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<TagSelectFailAction>({
                type: TAG_SELECT_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<TagSelectFailAction>({
                type: TAG_SELECT_FAIL,
                payload: e.message
            });
        } else {
            dispatch<TagSelectFailAction>({
                type: TAG_SELECT_FAIL,
                payload: 'Something went wrong while fetching user tags...'
            });
        }
    }
};

export const resetSelectUserTag = () => (dispatch: Dispatch) => {
    dispatch<TagSelectResetAction>({
        type: TAG_SELECT_RESET
    });
};


export const createUserTag = (tagCreate: TagMinimal) => async (dispatch: Dispatch) => {

    try {
        dispatch<TagCreateQueryAction>({
            type: TAG_CREATE_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.post<Tag>(
            `/tags/`,
            { ...tagCreate },
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );
    
        dispatch<TagCreateSuccessAction>({
            type: TAG_CREATE_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<TagCreateFailAction>({
                type: TAG_CREATE_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<TagCreateFailAction>({
                type: TAG_CREATE_FAIL,
                payload: e.message
            });
        } else {
            dispatch<TagCreateFailAction>({
                type: TAG_CREATE_FAIL,
                payload: 'Something went wrong while creating user tag...'
            });
        }
    }
};

export const resetCreateUserTag = () => (dispatch: Dispatch) => {
    dispatch<TagCreateResetAction>({
        type: TAG_CREATE_RESET
    });
};


export const updateUserTag = (tagUpdate: TagMinimal) => async (dispatch: Dispatch) => {

    try {
        if (!tagUpdate.id) {
            throw new Error('Cannot update tag without id');
        }

        dispatch<TagUpdateQueryAction>({
            type: TAG_UPDATE_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.put<Tag>(
            `/tags/${tagUpdate.id}/`,
            { ...tagUpdate },
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );
    
        dispatch<TagUpdateSuccessAction>({
            type: TAG_UPDATE_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<TagUpdateFailAction>({
                type: TAG_UPDATE_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<TagUpdateFailAction>({
                type: TAG_UPDATE_FAIL,
                payload: e.message
            });
        } else {
            dispatch<TagUpdateFailAction>({
                type: TAG_UPDATE_FAIL,
                payload: 'Something went wrong while updating user tag...'
            });
        }
    }
};

export const resetUpdateUserTag = () => (dispatch: Dispatch) => {
    dispatch<TagUpdateResetAction>({
        type: TAG_UPDATE_RESET
    });
};


export const deleteUserTag = (id: string) => async (dispatch: Dispatch) => {

    try {
        dispatch<TagDeleteQueryAction>({
            type: TAG_DELETE_QUERY
        });
    
        const userDetail: UserDetail = localStorage.getItem('userDetail') 
            ? JSON.parse(localStorage.getItem('userDetail') || '')
            : null;
    
        const { data } = await backend.delete<{ id: string }>(
            `/tags/${id}/`,
            { headers: { Authorization: `Bearer ${userDetail.token}` } }
        );
    
        dispatch<TagDeleteSuccessAction>({
            type: TAG_DELETE_SUCCESS,
            payload: data
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<TagDeleteFailAction>({
                type: TAG_DELETE_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<TagDeleteFailAction>({
                type: TAG_DELETE_FAIL,
                payload: e.message
            });
        } else {
            dispatch<TagDeleteFailAction>({
                type: TAG_DELETE_FAIL,
                payload: 'Something went wrong while deleting user tag...'
            });
        }
    }
};

export const resetDeleteUserTag = () => (dispatch: Dispatch) => {
    dispatch<TagDeleteResetAction>({
        type: TAG_DELETE_RESET
    });
};