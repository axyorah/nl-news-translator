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
    UserLoginInfo,
    UserLoginAction,
    UserRegisterAction
} from '../types/userTypes';

export const userLoginReducers = (
    state: UserLoginInfo = {}, action: UserLoginAction
) => {
    switch (action.type) {
        case USER_LOGIN_QUERY:
            return {
                loading: true,
            };
            
        case USER_LOGIN_SUCCESS:
            return {
                loading: false,
                userDetail: action.payload
            };

        case USER_LOGIN_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case USER_LOGOUT:
            return {};

        default:
            return state;
    }
};

export const userRegisterReducers = (
    state: UserLoginInfo = {}, action: UserRegisterAction
) => {
    switch (action.type) {
        case USER_REGISTER_QUERY:
            return {
                loading: true,
            };
            
        case USER_REGISTER_SUCCESS:
            return {
                loading: false,
                userDetail: action.payload
            };

        case USER_REGISTER_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        default:
            return state;
    }
};