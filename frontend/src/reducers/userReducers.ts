import {
    USER_LOGIN_QUERY,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
} from '../constants/userConstants';

import {
    UserLoginInfo,
    UserLoginAction
} from '../types/userTypes';

export const userLoginReducers = (
    state: UserLoginInfo = {}, action: UserLoginAction
) => {
    console.log(state)
    console.log(action)
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