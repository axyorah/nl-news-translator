import { Dispatch } from 'redux';
import { dispatchErrorForAction } from '../utils/errorUtils';
 
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
        dispatchErrorForAction<TagListFailAction, typeof TAG_LIST_FAIL>(
            dispatch, e, TAG_LIST_FAIL
        );
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
        dispatchErrorForAction<TagSelectFailAction, typeof TAG_SELECT_FAIL>(
            dispatch, e, TAG_SELECT_FAIL
        );
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
        dispatchErrorForAction<TagCreateFailAction, typeof TAG_CREATE_FAIL>(
            dispatch, e, TAG_CREATE_FAIL
        );
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
        dispatchErrorForAction<TagUpdateFailAction, typeof TAG_UPDATE_FAIL>(
            dispatch, e, TAG_UPDATE_FAIL
        );
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
        dispatchErrorForAction<TagDeleteFailAction, typeof TAG_DELETE_FAIL>(
            dispatch, e, TAG_DELETE_FAIL
        );
    }
};

export const resetDeleteUserTag = () => (dispatch: Dispatch) => {
    dispatch<TagDeleteResetAction>({
        type: TAG_DELETE_RESET
    });
};