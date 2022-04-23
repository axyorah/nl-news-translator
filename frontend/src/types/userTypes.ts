import {
    USER_LOGIN_QUERY,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,

    USER_REGISTER_QUERY,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants';

export interface User {
    id: number,
    username: string,
    isAdmin: boolean,
    token: string
}

export interface UserDetail {
    id: number,
    username: string,
    isAdmin: boolean,
    token: string
}

export interface UserTokens {
    refresh: string,
    access: string
}

export interface UserLoginInfo {
    userDetail?: UserDetail,
    loading?: boolean,
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


export interface UserRegisterQueryAction {
    type: typeof USER_REGISTER_QUERY
}

export interface UserRegisterSuccessAction {
    type: typeof USER_REGISTER_SUCCESS,
    payload: User
}

export interface UserRegisterFailAction {
    type: typeof USER_REGISTER_FAIL,
    payload: string
}

export type UserRegisterAction = 
    UserRegisterQueryAction | 
    UserRegisterSuccessAction | 
    UserRegisterFailAction;
    