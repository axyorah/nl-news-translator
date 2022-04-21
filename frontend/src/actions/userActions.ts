import { Dispatch } from 'redux';

import backend from '../api/backend';
import {
    USER_LOGIN_QUERY,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from '../constants/userConstants';
import { User, UserLoginFailAction } from '../types/userTypes';


type UserLoginApiResponse = User & { errors?: string }

export const loginUser = (username: string, password: string) => async (dispatch: Dispatch) => {
    
    try {
        dispatch({
            type: USER_LOGIN_QUERY
        });
    
        const { data } = await backend.post<UserLoginApiResponse>(
            '/users/login/', 
            { username: username, password: password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (data.errors) {
            throw new Error(data.errors || 'Something went wrong while loggin in...');
        }

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userDetail', JSON.stringify(data));

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<UserLoginFailAction>({
                type: USER_LOGIN_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<UserLoginFailAction>({
                type: USER_LOGIN_FAIL,
                payload: e.message
            });
        } else {
            dispatch<UserLoginFailAction>({
                type: USER_LOGIN_FAIL,
                payload: 'Something went wrong while loggin in...'
            });
        }

    }

};