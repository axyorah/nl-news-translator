import { Dispatch } from 'redux';

import backend from '../api/backend';

import { UserDetail } from '../types/userTypes';
import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL
} from '../constants/tagConstants';
import {
    Tag,
    TagListQueryAction,
    TagListSuccessAction,
    TagListFailAction
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
                payload: 'Something went wrong while registering...'
            });
        }
    }
};