import { Dispatch } from 'redux';
import { dispatchErrorForAction } from '../utils/errorUtils';

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
        dispatchErrorForAction<UserLoginFailAction, typeof USER_LOGIN_FAIL>(
            dispatch, e, USER_LOGIN_FAIL
        );
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
        dispatchErrorForAction<UserRegisterFailAction, typeof USER_REGISTER_FAIL>(
            dispatch, e, USER_REGISTER_FAIL
        );
    }
};