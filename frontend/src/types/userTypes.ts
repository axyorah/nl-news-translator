import {
    USER_LOGIN_QUERY,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from '../constants/userConstants';

export interface User {
    id: number,
    username: string,
    isAdmin: boolean,
    token: string
}

export interface UserLoginInfo {
    userDetail: User,
    loading?: string,
    errors?: string
}

export interface UserLoginQueryAction {
    type: typeof USER_LOGIN_QUERY
}

export interface UserLoginSuccessAction {
    type: typeof USER_LOGIN_SUCCESS,
    payload: User
}

export interface UserLoginFailAction {
    type: typeof USER_LOGIN_FAIL,
    payload: string
}

export interface UserLogoutAction {
    type: typeof USER_LOGOUT
}


export type UserLoginAction = 
    UserLoginQueryAction | 
    UserLoginSuccessAction | 
    UserLoginFailAction |
    UserLogoutAction;
