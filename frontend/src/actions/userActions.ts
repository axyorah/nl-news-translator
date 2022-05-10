import { Dispatch } from 'redux';
import { AxiosError } from 'axios';

import backend from '../api/backend';
import {
    USER_LOGIN_QUERY,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,

    USER_REGISTER_QUERY,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants';
import { 
    UserTokens, 
    UserDetail, 
    UserLoginQueryAction,
    UserLoginFailAction, 
    UserLoginSuccessAction, 
    UserRegisterQueryAction,
    UserRegisterFailAction, 
    UserRegisterSuccessAction  
} from '../types/userTypes';


type UserLoginApiResponse = UserTokens & { errors?: string };
type UserProfileApiResponse = UserDetail & { errors?: string };

export const loginUser = (username: string, password: string) => async (dispatch: Dispatch) => {
    
    try {
        dispatch<UserLoginQueryAction>({
            type: USER_LOGIN_QUERY
        });
    
        // get tokens
        const { data: { access } } = await backend.post<UserLoginApiResponse>(
            '/users/login/', 
            { username: username, password: password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // get account details
        const { data } = await backend.get<UserProfileApiResponse>(
            '/users/profile/',
            { headers: { Authorization: `Bearer ${access}` } }
        );

        if (data.errors) {
            throw new Error(data.errors || 'Something went wrong while loggin in...');
        }

        dispatch<UserLoginSuccessAction>({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userDetail', JSON.stringify(data));

    } catch (e) {
        const err = e as AxiosError;
        if ( err && err.response ) {
            dispatch<UserLoginFailAction>({
                type: USER_LOGIN_FAIL,
                payload: err.response.data.errors || err.response.data.detail
            });
        } else if (typeof e === 'string') {
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

export const logout = () => {
    localStorage.removeItem('userDetail');

    return {
        type: USER_LOGOUT
    }
};

export const registerUser = (username: string, password: string) => async (dispatch: Dispatch) => {
    
    try {
        dispatch<UserRegisterQueryAction>({
            type: USER_REGISTER_QUERY
        });
        
        const { data } = await backend.post(
            '/users/new/',
            { username: username, password: password }
        );

        if (data.errors) {
            throw new Error(data.errors || 'Something went wrong while registering...');
        }

        dispatch<UserRegisterSuccessAction>({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });

        dispatch<UserLoginSuccessAction>({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userDetail', JSON.stringify(data));

    } catch (e) {
        const err = e as AxiosError;
        if ( err && err.response ) {
            dispatch<UserRegisterFailAction>({
                type: USER_REGISTER_FAIL,
                payload: err.response.data.errors || err.response.data.detail
            });
        } else if (typeof e === 'string') {
            dispatch<UserRegisterFailAction>({
                type: USER_REGISTER_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<UserRegisterFailAction>({
                type: USER_REGISTER_FAIL,
                payload: e.message
            });
        } else {
            dispatch<UserRegisterFailAction>({
                type: USER_REGISTER_FAIL,
                payload: 'Something went wrong while registering...'
            });
        }
    }
};